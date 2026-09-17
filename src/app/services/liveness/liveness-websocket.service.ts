import { Injectable, OnDestroy } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { Observable, Subject, filter, of, take, tap } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';

export interface LivenessSocketResponse {
  status: string;
  message: string;
  originalCorrelationId: string;
  nin?: string;
}

export type LivenessWebsocketStatus =
  'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

@Injectable({ providedIn: 'root' })
export class LivenessWebsocketService implements OnDestroy {
  private readonly connectionTimeoutMs = 5000;
  private client?: Client;
  private subscription?: StompSubscription;
  private activeBrokerUrl = '';
  private activeSubscriptionDestination = '';
  private hasConnected = false;

  private readonly livenessResultSubject =
    new Subject<LivenessSocketResponse>();
  private readonly connectionStatusSubject =
    new Subject<LivenessWebsocketStatus>();
  private readonly connectionErrorSubject = new Subject<string>();

  readonly livenessResult$ = this.livenessResultSubject.asObservable();
  readonly connectionStatus$ = this.connectionStatusSubject.asObservable();
  readonly connectionError$ = this.connectionErrorSubject.asObservable();

  connect(
    livenessReference: string,
    baseWsUrl = environment.websocketUrl || environment.baseUrl,
  ): Observable<void> {
    const brokerURL = this.buildBrokerUrl(baseWsUrl);
    const subscriptionDestination =
      this.buildSubscriptionDestination(livenessReference);

    if (
      this.client?.active &&
      this.activeBrokerUrl === brokerURL &&
      this.activeSubscriptionDestination === subscriptionDestination
    ) {
      return of(undefined);
    }

    return new Observable<void>((observer) => {
      this.disconnect();
      this.hasConnected = false;
      this.activeBrokerUrl = brokerURL;
      this.activeSubscriptionDestination = subscriptionDestination;
      this.connectionStatusSubject.next('CONNECTING');

      this.client = new Client({
        brokerURL,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectionTimeout: this.connectionTimeoutMs,
        debug: () => undefined,
      });

      const activeClient = this.client;
      let isSettled = false;

      const failConnection = (message: string) => {
        if (isSettled || activeClient !== this.client) {
          return;
        }

        isSettled = true;
        clearTimeout(connectionTimeoutId);
        this.connectionStatusSubject.next('ERROR');
        this.connectionErrorSubject.next(message);
        this.disconnect();
        observer.error(new Error(message));
      };

      const connectionTimeoutId = setTimeout(() => {
        failConnection(
          `Connection to liveness service timed out after ${
            this.connectionTimeoutMs / 1000
          } seconds.`,
        );
      }, this.connectionTimeoutMs);

      this.client.onConnect = () => {
        if (isSettled || activeClient !== this.client) {
          return;
        }

        isSettled = true;
        clearTimeout(connectionTimeoutId);
        this.subscription = this.client?.subscribe(
          subscriptionDestination,
          (message: IMessage) => {
            const payload = this.parseSocketMessage(message);

            if (payload) {
              console.log('Liveness websocket response received.', payload);
              this.livenessResultSubject.next(payload);
            }
          },
        );

        this.hasConnected = true;
        this.connectionStatusSubject.next('CONNECTED');
        console.log('Liveness websocket connection successful.', {
          brokerURL,
          subscriptionDestination,
        });
        observer.next();
        observer.complete();
      };

      this.client.onStompError = (frame) => {
        if (activeClient !== this.client) {
          return;
        }

        const message =
          frame.headers['message'] || 'Liveness websocket connection failed.';

        if (!this.hasConnected) {
          failConnection(message);
          return;
        }

        this.connectionStatusSubject.next('ERROR');
        this.connectionErrorSubject.next(message);
      };

      this.client.onWebSocketError = () => {
        if (activeClient !== this.client) {
          return;
        }

        const message = 'Unable to connect to liveness websocket.';

        if (!this.hasConnected) {
          failConnection(message);
          return;
        }

        this.connectionStatusSubject.next('ERROR');
        this.connectionErrorSubject.next(message);
      };

      this.client.onWebSocketClose = () => {
        if (activeClient !== this.client) {
          return;
        }

        if (!this.hasConnected) {
          failConnection(
            'Liveness websocket disconnected before subscription.',
          );
          return;
        }

        this.connectionStatusSubject.next('DISCONNECTED');
      };

      this.client.activate();

      return () => {
        clearTimeout(connectionTimeoutId);

        if (!isSettled && activeClient === this.client) {
          this.disconnect();
        }
      };
    });
  }

  waitForResult(livenessReference: string): Observable<LivenessSocketResponse> {
    return new Observable<LivenessSocketResponse>((observer) => {
      let hasResult = false;
      const resultSubscription = this.livenessResult$
        .pipe(
          filter(
            (result) => result.originalCorrelationId === livenessReference,
          ),
          take(1),
          tap(() => {
            hasResult = true;
            this.disconnect();
          }),
        )
        .subscribe(observer);

      const statusSubscription = this.connectionStatus$.subscribe((status) => {
        if (hasResult || status !== 'DISCONNECTED') {
          return;
        }

        observer.error(
          new Error('Liveness websocket disconnected before a response.'),
        );
      });

      const errorSubscription = this.connectionError$.subscribe((message) => {
        if (!hasResult) {
          observer.error(new Error(message));
        }
      });

      return () => {
        resultSubscription.unsubscribe();
        statusSubscription.unsubscribe();
        errorSubscription.unsubscribe();
      };
    });
  }

  disconnect(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;

    if (this.client) {
      void this.client.deactivate();
      this.client = undefined;
    }

    this.activeBrokerUrl = '';
    this.activeSubscriptionDestination = '';
    this.hasConnected = false;
    this.connectionStatusSubject.next('DISCONNECTED');
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.livenessResultSubject.complete();
    this.connectionStatusSubject.complete();
    this.connectionErrorSubject.complete();
  }

  private parseSocketMessage(message: IMessage): LivenessSocketResponse | null {
    try {
      return JSON.parse(message.body) as LivenessSocketResponse;
    } catch {
      this.connectionErrorSubject.next('Invalid liveness websocket response.');
      return null;
    }
  }

  private buildBrokerUrl(baseWsUrl: string): string {
    const trimmedUrl = baseWsUrl.trim().replace(/\/+$/, '');
    const websocketUrl = trimmedUrl
      .replace(/^https:\/\//i, 'wss://')
      .replace(/^http:\/\//i, 'ws://');

    return websocketUrl.endsWith('/wss') ? websocketUrl : `${websocketUrl}/wss`;
  }

  private buildSubscriptionDestination(livenessReference: string): string {
    return `/consent/liveness-responses/${encodeURIComponent(
      livenessReference,
    )}`;
  }
}
