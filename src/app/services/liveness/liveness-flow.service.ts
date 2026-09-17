import { Injectable } from '@angular/core';
import QoreID from '@qore-id/web-sdk';

export type LivenessProvider = 'dojah' | 'qoreid';
export type BackendLivenessProvider = 'DOJAH' | 'VERIFYME' | 'QOREID' | string;

export type LivenessLaunchContext = {
  provider: LivenessProvider;
  customerReference: string;
  sessionId: string;
  qoreIdSessionToken?: string;
  ssid?: string;
  details: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    gender?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    email?: string;
  };
  verifiedData?: {
    firstName?: string;
    middleName?: string;
    surname?: string;
    sex?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    email?: string;
    nin?: string;
    bvn?: string;
    ssid?: string;
  };
};

export type LivenessFlowHandlers = {
  success: (provider: LivenessProvider, response: Record<string, unknown>) => void;
  failure: (error: unknown, fallbackMessage: string) => void;
  loading: (isLoading: boolean) => void;
  closed?: (provider: LivenessProvider, response: Record<string, unknown>) => void;
  initiated?: (
    provider: LivenessProvider,
    response: Record<string, unknown>,
  ) => void;
};

type DojahWidgetResponse = Record<string, unknown>;
type DojahConnectInstance = {
  setup: () => void;
  open: () => void;
};
type DojahConnectConstructor = new (
  options: Record<string, unknown>,
) => DojahConnectInstance;
type QoreIdStartConfig = {
  clientId: string;
  productCode: string;
  customerReference: string;
  applicantData: {
    firstname: string;
    middlename?: string;
    lastname: string;
    gender?: string;
    dob?: string;
    phone?: string;
    email?: string;
  };
};
type LivenessWindow = Window &
  typeof globalThis & {
    Connect?: DojahConnectConstructor;
    dojah?: { uri?: string };
    optimaLiveness?: {
      dojahWidgetUrl?: string;
    };
    QoreIdSDK?: {
      init: (config: QoreIdStartConfig & Record<string, unknown>) => void;
    };
  };

@Injectable({ providedIn: 'root' })
export class LivenessFlowService {
  private readonly qoreIdClientId = 'OGTMYVPVXGJQ4VUWLRU1';
  private readonly qoreIdProductCode = 'liveness';
  private readonly dojahAppId = '6a2da69165dff57337628633';
  private readonly dojahPublicKey = 'test_sk_ffeY3nnwwOq5lJcY9XJOZb7r8';
  // private readonly dojahWidgetId = '6a2eb613707a4cd23c17b8a6';
  // private readonly dojahWidgetId = '6a4ed489f137c814ce93456c';
  private readonly dojahWidgetId = '6a5101c560b6226d1777bef6';
  private readonly dojahWidgetType = 'custom';
  private readonly dojahWidgetUrl = 'https://widget.dojah.io/widget.js';

  private activeReference = '';
  private activeFlowToken = 0;
  private dojahScriptElement: HTMLScriptElement | null = null;
  private dojahScriptLoadPromise: Promise<void> | null = null;

  async startFromBackend(
    registration: {
      provider?: BackendLivenessProvider;
      livenessReference?: string;
      token?: string;
      sessionToken?: string;
      qoreIdSessionToken?: string;
    },
    context: Omit<
      LivenessLaunchContext,
      'provider' | 'customerReference' | 'qoreIdSessionToken'
    > & { customerReference: string },
    handlers: LivenessFlowHandlers,
  ): Promise<void> {
    const provider = this.normaliseBackendProvider(registration.provider);
    if (!provider) {
      throw new Error('Unsupported liveness verification provider.');
    }

    return this.start(
      {
        ...context,
        provider,
        customerReference:
          registration.livenessReference || context.customerReference,
        qoreIdSessionToken:
          registration.qoreIdSessionToken ||
          registration.sessionToken ||
          registration.token,
      },
      handlers,
    );
  }

  normaliseBackendProvider(
    provider?: BackendLivenessProvider,
  ): LivenessProvider | null {
    const normalisedProvider = provider?.trim().toLowerCase();

    if (normalisedProvider === 'dojah') {
      return 'dojah';
    }

    if (
      normalisedProvider === 'verifyme' ||
      normalisedProvider === 'qoreid'
    ) {
      return 'qoreid';
    }

    return null;
  }

  async start(
    context: LivenessLaunchContext,
    handlers: LivenessFlowHandlers,
  ): Promise<void> {
    const flowToken = ++this.activeFlowToken;
    this.activeReference = context.customerReference;
    this.resetArtifacts();

    if (context.provider === 'qoreid') {
      await this.startQoreIdVerification(context, handlers, flowToken);
      return;
    }

    await this.startDojahVerification(context, handlers, flowToken);
  }

  resetArtifacts(): void {
    this.resetDojahArtifacts();
    this.resetQoreIdArtifacts();
  }

  private async startDojahVerification(
    context: LivenessLaunchContext,
    handlers: LivenessFlowHandlers,
    flowToken: number,
  ): Promise<void> {
    handlers.loading(true);

    try {
      await this.loadDojahWidgetScript();
      this.openDojahWidget(context, handlers, flowToken);
      handlers.loading(false);
    } catch (error) {
      handlers.loading(false);
      this.handleFailure(
        error,
        handlers,
        context.customerReference,
        flowToken,
        'Unable to complete Dojah liveness verification.',
      );
    }
  }

  private loadDojahWidgetScript(): Promise<void> {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return Promise.reject(
        new Error('Dojah verification can only run in a browser.'),
      );
    }

    const livenessWindow = window as LivenessWindow;
    if (livenessWindow.Connect) {
      return Promise.resolve();
    }

    if (this.dojahScriptLoadPromise) {
      return this.dojahScriptLoadPromise;
    }

    this.dojahScriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const cleanup = () => {
        script.removeEventListener('load', onLoad);
        script.removeEventListener('complete', onLoad);
        script.removeEventListener('error', onError);
      };
      const onLoad = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        this.dojahScriptLoadPromise = null;
        reject(new Error('Unable to load Dojah verification widget.'));
      };

      script.src =
        livenessWindow.dojah?.uri ||
        livenessWindow.optimaLiveness?.dojahWidgetUrl ||
        this.dojahWidgetUrl;
      script.async = true;
      script.addEventListener('load', onLoad);
      script.addEventListener('complete', onLoad);
      script.addEventListener('error', onError);
      document.head.appendChild(script);
      this.dojahScriptElement = script;
    });

    return this.dojahScriptLoadPromise;
  }

  private openDojahWidget(
    context: LivenessLaunchContext,
    handlers: LivenessFlowHandlers,
    flowToken: number,
  ): void {
    const livenessWindow = window as LivenessWindow;
    if (!livenessWindow.Connect) {
      throw new Error('Dojah widget loaded, but Connect is unavailable.');
    }

    const connect = new livenessWindow.Connect({
      app_id: this.dojahAppId,
      p_key: this.dojahPublicKey,
      type: this.dojahWidgetType,
      config: {
        widget_id: this.dojahWidgetId,
      },
      // metadata: this.buildDojahMetadata(context),
      // user_data: this.buildDojahUserData(context),
      // gov_data: this.buildDojahGovData(context),
      reference_id: context.customerReference,
      onSuccess: (data: DojahWidgetResponse) => {
        this.handleSuccess('dojah', data, context, handlers, flowToken);
      },
      onError: (error: unknown) => {
        this.handleFailure(
          error,
          handlers,
          context.customerReference,
          flowToken,
          'Unable to complete Dojah liveness verification.',
        );
      },
      onClose: (data: unknown) => {
        this.handleClosed(
          'dojah',
          data,
          handlers,
          context.customerReference,
          flowToken,
          'Dojah liveness verification was closed.',
        );
      },
    });

    connect.setup();
    connect.open();
    handlers.initiated?.('dojah', {
      provider: 'dojah',
      event: 'initiated',
      referenceId: context.customerReference,
    });
  }

  private async startQoreIdVerification(
    context: LivenessLaunchContext,
    handlers: LivenessFlowHandlers,
    flowToken: number,
  ): Promise<void> {
    handlers.loading(true);

    try {
      const sdk = QoreID;

      const successHandler = (sdkResponse: Record<string, unknown>) => {
        this.removeQoreIdHandlers(
          sdk,
          successHandler,
          errorHandler,
          closeHandler,
          loadingHandler,
        );
        this.handleSuccess('qoreid', sdkResponse, context, handlers, flowToken);
      };
      const errorHandler = (error: unknown) => {
        this.removeQoreIdHandlers(
          sdk,
          successHandler,
          errorHandler,
          closeHandler,
          loadingHandler,
        );
        this.handleFailure(
          error,
          handlers,
          context.customerReference,
          flowToken,
          'Unable to complete QoreID liveness verification.',
        );
      };
      const closeHandler = (data: unknown) => {
        this.removeQoreIdHandlers(
          sdk,
          successHandler,
          errorHandler,
          closeHandler,
          loadingHandler,
        );
        this.handleClosed(
          'qoreid',
          data,
          handlers,
          context.customerReference,
          flowToken,
          'QoreID liveness verification was closed.',
        );
      };
      const loadingHandler = (isLoading: boolean) => {
        if (this.isActiveLaunch(context.customerReference, flowToken)) {
          handlers.loading(isLoading);
        }
      };

      sdk.on('success', successHandler);
      sdk.on('error', errorHandler);
      sdk.on('close', closeHandler);
      sdk.on('loading', loadingHandler);

      await this.openQoreIdSdk(context, {
        success: successHandler,
        error: errorHandler,
        close: closeHandler,
      });
      handlers.loading(false);
      handlers.initiated?.('qoreid', {
        provider: 'qoreid',
        event: 'initiated',
        referenceId: context.customerReference,
      });
    } catch (error) {
      handlers.loading(false);
      this.handleFailure(
        error,
        handlers,
        context.customerReference,
        flowToken,
        'Unable to start QoreID liveness verification.',
      );
    }
  }

  private removeQoreIdHandlers(
    sdk: typeof QoreID,
    successHandler: (response: Record<string, unknown>) => void,
    errorHandler: (error: unknown) => void,
    closeHandler: (response: Record<string, unknown>) => void,
    loadingHandler: (isLoading: boolean) => void,
  ): void {
    sdk.off?.('success', successHandler);
    sdk.off?.('error', errorHandler);
    sdk.off?.('close', closeHandler);
    sdk.off?.('loading', loadingHandler);
  }

  private async openQoreIdSdk(
    context: LivenessLaunchContext,
    handlers: {
      success: (response: Record<string, unknown>) => void;
      error: (error: unknown) => void;
      close: (response: Record<string, unknown>) => void;
    },
  ): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('QoreID verification can only run in a browser.');
    }

    await QoreID.init();

    const livenessWindow = window as LivenessWindow;
    if (!livenessWindow.QoreIdSDK?.init) {
      throw new Error('QoreID SDK loaded, but init is unavailable.');
    }

    livenessWindow.QoreIdSDK.init({
      ...this.buildQoreIdStartConfig(context),
      initializedEventTrigger: () => undefined,
      submittedEventTrigger: handlers.success,
      errorEventTrigger: handlers.error,
      closedEventTrigger: handlers.close,
    });
  }

  private handleSuccess(
    provider: LivenessProvider,
    data: unknown,
    context: LivenessLaunchContext,
    handlers: LivenessFlowHandlers,
    flowToken: number,
  ): void {
    if (!this.isActiveLaunch(context.customerReference, flowToken)) {
      return;
    }

    this.deactivateLaunch(context.customerReference, flowToken);
    this.resetArtifacts();
    handlers.loading(false);
    handlers.success(provider, {
      provider,
      event: 'success',
      referenceId: context.customerReference,
      data: this.toRecord(data),
    });
  }

  private handleFailure(
    error: unknown,
    handlers: LivenessFlowHandlers,
    customerReference: string,
    flowToken: number,
    fallbackMessage: string,
  ): void {
    if (!this.isActiveLaunch(customerReference, flowToken)) {
      return;
    }

    this.deactivateLaunch(customerReference, flowToken);
    this.resetArtifacts();
    handlers.loading(false);
    handlers.failure(error, fallbackMessage);
  }

  private handleClosed(
    provider: LivenessProvider,
    data: unknown,
    handlers: LivenessFlowHandlers,
    customerReference: string,
    flowToken: number,
    fallbackMessage: string,
  ): void {
    if (!this.isActiveLaunch(customerReference, flowToken)) {
      return;
    }

    this.deactivateLaunch(customerReference, flowToken);
    this.resetArtifacts();
    handlers.loading(false);

    if (!handlers.closed) {
      handlers.failure(data, fallbackMessage);
      return;
    }

    handlers.closed(provider, {
      provider,
      event: 'closed',
      referenceId: customerReference,
      data: this.toRecord(data),
    });
  }

  private isActiveLaunch(
    customerReference: string,
    flowToken: number,
  ): boolean {
    return (
      customerReference === this.activeReference &&
      flowToken === this.activeFlowToken
    );
  }

  private deactivateLaunch(customerReference: string, flowToken: number): void {
    if (!this.isActiveLaunch(customerReference, flowToken)) {
      return;
    }

    this.activeReference = '';
    this.activeFlowToken += 1;
  }

  private resetDojahArtifacts(): void {
    this.dojahScriptElement?.remove();
    this.dojahScriptElement = null;
    this.dojahScriptLoadPromise = null;

    if (typeof document === 'undefined') {
      return;
    }

    document
      .querySelectorAll(
        [
          '[class*="dojah" i]',
          '[id*="dojah" i]',
          'iframe[src*="dojah" i]',
          'iframe[src*="widget" i]',
        ].join(','),
      )
      .forEach((node) => node.remove());
  }

  private resetQoreIdArtifacts(): void {
    if (typeof document === 'undefined') {
      return;
    }

    document
      .querySelectorAll(
        [
          '#QoreIDButton',
          '#qoreid-sdk-root qoreid-button',
          '.sdkPopup',
          '.sdkBackdrop',
          '.qoreid-modal',
          '.qoreid-backdrop',
          '[class*="qoreid" i]',
          'iframe[src*="qoreid" i]',
        ].join(','),
      )
      .forEach((node) => node.remove());
  }

  private buildQoreIdStartConfig(
    context: LivenessLaunchContext,
  ): QoreIdStartConfig {
    const verifiedData = context.verifiedData;
    const details = context.details;

    return {
      clientId: this.qoreIdClientId,
      productCode: this.qoreIdProductCode,
      customerReference: context.customerReference,
      applicantData: {
        firstname: verifiedData?.firstName || details.firstName || 'Applicant',
        ...(verifiedData?.middleName || details.middleName
          ? { middlename: verifiedData?.middleName || details.middleName }
          : {}),
        lastname: verifiedData?.surname || details.lastName || 'Applicant',
        ...(verifiedData?.sex || details.gender
          ? {
              gender: this.normaliseGender(verifiedData?.sex || details.gender),
            }
          : {}),
        ...(verifiedData?.dateOfBirth || details.dateOfBirth
          ? {
              dob: this.normaliseDate(
                verifiedData?.dateOfBirth || details.dateOfBirth,
              ),
            }
          : {}),
        ...(verifiedData?.phoneNumber || details.phoneNumber
          ? {
              phone: this.formatNigerianPhoneNumber(
                verifiedData?.phoneNumber || details.phoneNumber,
              ),
            }
          : {}),
        ...(verifiedData?.email || details.email
          ? { email: verifiedData?.email || details.email }
          : {}),
      },
    };
  }

  private buildDojahUserData(
    context: LivenessLaunchContext,
  ): Record<string, string> {
    const verifiedData = context.verifiedData;
    const details = context.details;

    return {
      first_name: verifiedData?.firstName || details.firstName || '',
      last_name: verifiedData?.surname || details.lastName || '',
      dob: this.normaliseDate(verifiedData?.dateOfBirth || details.dateOfBirth),
    };
  }

  // private buildDojahGovData(
  //   context: LivenessLaunchContext,
  // ): Record<string, string> {
  //   const verifiedData = context.verifiedData;

  //   return {
  //     nin: verifiedData?.nin || '',
  //     bvn: verifiedData?.bvn || '',
  //     dl: '',
  //     mobile:
  //       this.formatNigerianPhoneNumber(verifiedData?.phoneNumber) ||
  //       verifiedData?.phoneNumber ||
  //       '',
  //   };
  // }

  // private buildDojahMetadata(
  //   context: LivenessLaunchContext,
  // ): Record<string, string> {
  //   const verifiedData = context.verifiedData;
  //   const details = context.details;

  //   return {
  //     session_id: context.sessionId,
  //     ssid: verifiedData?.ssid || context.ssid || '',
  //     email: verifiedData?.email || details.email || '',
  //     phone_number: this.formatNigerianPhoneNumber(
  //       verifiedData?.phoneNumber || details.phoneNumber,
  //     ),
  //     provider: 'dojah',
  //   };
  // }

  private normaliseDate(value?: string): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toISOString().slice(0, 10);
  }

  private normaliseGender(value?: string): string {
    const gender = value?.toLowerCase();
    if (gender === 'm' || gender === 'male') {
      return 'male';
    }

    if (gender === 'f' || gender === 'female') {
      return 'female';
    }

    return value || '';
  }

  private formatNigerianPhoneNumber(value?: string): string {
    if (!value) {
      return '';
    }

    const digits = value.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('0')) {
      return `234${digits.slice(1)}`;
    }

    if (digits.length === 10) {
      return `234${digits}`;
    }

    return digits;
  }

  private toRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === 'object'
      ? (value as Record<string, unknown>)
      : { value };
  }
}
