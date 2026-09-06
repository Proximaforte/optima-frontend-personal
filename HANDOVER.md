# Optima Frontend Handover

This document is a practical handover note for a developer picking up the Optima Angular frontend. It focuses on code architecture, feature setup, application flow, and areas to inspect before making changes.

## Project Overview

Optima is an Angular 16 frontend for an agent-facing beneficiary onboarding portal. The main user is an agent who logs in, views dashboard statistics, starts or continues beneficiary onboarding, captures consent and biometrics, and manages completed or incomplete beneficiary records.

Core stack:

- Angular 16
- Angular Material
- Tailwind CSS
- RxJS
- `ngx-webcam` for camera capture
- `ngx-otp-input` for OTP entry
- `ngx-pagination` for pagination
- `crypto-js` for AES encryption/decryption helpers

## Useful Commands

```bash
npm install
npm start
npm run build
npm test
```

The dev server runs through Angular CLI and is normally available at:

```text
http://localhost:4200/
```

## Top-Level Boot Flow

Application startup begins in:

- `src/main.ts`
- `src/app/app.module.ts`
- `src/app/app.component.html`

`main.ts` bootstraps `AppModule`. `AppComponent` only renders:

```html
<router-outlet></router-outlet>
```

Because the root component is only a router outlet, the application is almost entirely route-driven.

## Root Routing

Root routes live in:

- `src/app/app-routing.module.ts`

Current root route behavior:

- `/` redirects to `/auth/login`
- `/auth` lazy-loads `AuthModule`
- `/home` lazy-loads `HomeModule` and is protected by `othersGuard`
- `/utilities` lazy-loads `UtilitiesModule` and is protected by `othersGuard`
- unknown routes redirect to `/home`

The `/home` route is the protected shell for logged-in users.

## Authentication

Main files:

- `src/app/auth/auth.module.ts`
- `src/app/auth/auth-routing.module.ts`
- `src/app/auth/auth.component.ts`
- `src/app/services/authentication/auth.service.ts`
- `src/app/services/authentication/interceptor/jwt-interceptor.service.ts`
- `src/app/securities/auth/auth.guard.ts`
- `src/app/securities/others/others.guard.ts`

Auth routes:

- `/auth/login`
- `/auth/change-passwords`
- `/auth/forgot-passwords`
- `/auth/input-otp`
- `/auth/input-new-password`
- `/auth/otp-identifier`

Login flow:

1. User submits email and password in `AuthComponent`.
2. `AuthService.login(email, password)` posts to the login endpoint.
3. On success, `response.token` is saved to `localStorage` under `user`.
4. The app navigates to `/home/dashboard`.
5. The page reloads.

Auth state is currently simple: `AuthService.agentIsLoggedIn()` checks whether `localStorage.getItem('user')` exists.

Logout clears all `localStorage` and navigates back to `/auth/login`.

Important note: `JwtInterceptorService` implements `HttpInterceptor`, but confirm that it is registered with Angular using `HTTP_INTERCEPTORS` before relying on it globally. Many service calls manually pass headers from the interceptor service.

## Protected Home Shell

Main files:

- `src/app/home/home.module.ts`
- `src/app/home/home-routing.module.ts`
- `src/app/home/home.component.html`

`HomeComponent` provides the logged-in layout:

- `app-header`
- child `router-outlet`
- `app-navigation`

Child features are lazy-loaded below `/home`.

Primary protected routes:

- `/home/dashboard`
- `/home/beneficiary`
- `/home/all-beneficiary`
- `/home/beneficiary-details`
- `/home/setup-biometrics`
- `/home/capture-biometrics`
- `/home/biometric-validation-request`
- `/home/profile`

## Feature Modules

### Dashboard

Main files:

- `src/app/dashboard/dashboard.module.ts`
- `src/app/dashboard/dashboard-routing.module.ts`
- `src/app/dashboard/dashboard.component.ts`
- `src/app/dashboard/dashboard.component.html`
- `src/app/dashboard/beneficiary-table/`

Dashboard responsibilities:

- Fetch dashboard statistics by report range.
- Display completed and incomplete onboarding counts.
- Display agent center metadata.
- Provide entry points for:
  - consent capture
  - beneficiary onboarding
  - biometric capture
  - support link

Primary API call:

- `BeneficiaryService.getDashboardStats(reportRange)`

Routing caveat: `DashboardRoutingModule` currently redirects empty path to `dashboard`, then also declares an empty component path. This should be reviewed if `/home/dashboard` has navigation issues.

### Beneficiary Onboarding

Main files:

- `src/app/beneficiary/beneficiary.module.ts`
- `src/app/beneficiary/beneficiary-routing.module.ts`
- `src/app/beneficiary/beneficiary.component.ts`
- `src/app/beneficiary/beneficiary.component.html`
- `src/app/services/beneficiary/beneficiary.service.ts`

This is the main onboarding workflow. The container component does not use nested child routes for each form section. Instead, it swaps form components based on a string emitted through `BeneficiaryService.setRouteToDisplay(...)`.

The intended onboarding sequence is:

1. Verify beneficiary NIN
2. Personal details
3. OTP verification
4. Setup biometrics
5. Residential details
6. Marital info
7. Education
8. Health
9. Financial
10. Next of kin
11. Employment
12. Occupation
13. Other details
14. Submit beneficiary onboarding

Key onboarding components:

- `verify-nin/verify-nin.component.ts`
- `personal-details/personal-details.component.ts`
- `verify-nin/verification-code/verification-code.component.ts`
- `verify-nin/setup-biometrics/setup-biometrics.component.ts`
- `residential-details/residential-details.component.ts`
- `marital-info/marital-info.component.ts`
- `education/education.component.ts`
- `education/educationSecond.component.ts`
- `health/health.component.ts`
- `disability-status/disability-status.component.ts`
- `financial/financial.component.ts`
- `next-of-kin/next-of-kin.component.ts`
- `employment/employment.component.ts`
- `occupation/occupation.component.ts`
- `other-details/other-details.component.ts`

Important note: `VerifyNINComponent.getFormValues()` currently calls `submit()` during form setup. This means navigating to `/home/beneficiary` can move the UI to personal details before a valid NIN has been entered. Review this before changing the NIN verification flow.

### Biometrics

Biometric-related files are under:

- `src/app/beneficiary/verify-nin/setup-biometrics/`
- `src/app/beneficiary/verify-nin/face-capturing/`
- `src/app/beneficiary/verify-nin/finger-capturing/`
- `src/app/beneficiary/verify-nin/finger-capturing-procedure/`
- `src/app/beneficiary/verify-nin/capture-complete/`
- `src/app/beneficiary/verify-nin/finger-capture-complete/`
- `src/app/all-beneficiary/capture-biometric/`
- `src/app/all-beneficiary/biometric-validation-request/`

The app uses browser camera capture through `ngx-webcam` and also integrates with an external biometric app URL configured in the production environment.

`SetupBiometricsComponent.proceed()` posts a biometric verification payload through:

- `BeneficiaryService.Verification(...)`

Local storage keys used around biometrics include:

- `face_capture`
- `faceCapture_skipThumbPrints`
- `isFingerprintOk`
- `biometrics`

### All Beneficiaries

Main files:

- `src/app/all-beneficiary/all-beneficiary.module.ts`
- `src/app/all-beneficiary/all-beneficiary-routing.module.ts`
- `src/app/all-beneficiary/all-beneficiary.component.ts`
- `src/app/all-beneficiary/beneficiary-detailspage/`
- `src/app/all-beneficiary/capture-biometric/`
- `src/app/all-beneficiary/biometric-validation-request/`

Responsibilities:

- List incomplete beneficiaries.
- List completed beneficiaries.
- Filter beneficiary records.
- View beneficiary details.
- Continue incomplete onboarding.
- Submit final onboarding when a record is ready.
- Route eligible records into biometric capture or manual validation flows.

Resume logic is handled in `AllBeneficiaryComponent.continueOnboarding(...)`. It maps backend `formStage` values to frontend steps:

- `VERIFICATION` -> verify beneficiary NIN
- `NIN_VERIFICATION` -> personal details
- `OTP_VERIFICATION` -> setup biometrics
- `PERSONAL_DETAILS` -> OTP verification
- `BIO_VERIFICATION` / `VERIFIED` -> residential details
- `ADDRESS_DETAILS` -> marital info
- `MARITAL_DETAILS` -> education
- `EDUCATION_DETAILS` -> health
- `HEALTH_DETAILS` -> financial
- `FINANCIAL_DETAILS` -> next of kin
- `NEXT_OF_KIN` -> employment
- `EMPLOYMENT_DETAILS` -> occupation
- `OCCUPATION_DETAILS` -> other details

### Profile

Main files:

- `src/app/profile/profile.module.ts`
- `src/app/profile/profile-routing.module.ts`
- `src/app/profile/profile.component.ts`
- `src/app/services/profile/profile.service.ts`

The profile feature is loaded under `/home/profile`.

### Utilities

Main files:

- `src/app/utilities/utilities.module.ts`
- `src/app/utilities/header/`
- `src/app/utilities/navigation/`
- `src/app/utilities/filter-box/`
- `src/app/utilities/pagination/`
- `src/app/utilities/otp-input/`
- `src/app/utilities/toasts/`
- `src/app/utilities/modals/`

`UtilitiesModule` is a shared feature-style module containing common UI components, dialogs, filters, pagination, toasts, OTP input, and the shell header/navigation.

## Services and API Layer

Main services:

- `src/app/services/authentication/auth.service.ts`
- `src/app/services/beneficiary/beneficiary.service.ts`
- `src/app/services/dashboard/dashboard.service.ts`
- `src/app/services/profile/profile.service.ts`
- `src/app/services/alert/toasts.service.ts`
- `src/app/state.service.ts`

API endpoint constants are centralized in:

- `src/app/models/APIs/endpoints.ts`

Environment config:

- `src/app/environments/environment.ts`
- `src/app/environments/environment.prod.ts`

Important: `main.ts` imports `environment.prod` directly. That means even local runs may use the production environment object unless this is changed.

`BeneficiaryService` is the largest service and handles:

- NIN verification
- NIN or phone lookup
- consent submission
- OTP generation and verification
- each onboarding form section submission
- beneficiary listing and filtering
- beneficiary profile fetching
- dashboard stats
- enum/dropdown data
- fingerprint skip
- biometric validation request
- AES encrypt/decrypt helper methods

## State and Storage

The code uses a mix of:

- `localStorage`
- `sessionStorage`
- RxJS `ReplaySubject`
- in-memory service fields

Common `localStorage` keys:

- `user`
- `userDetails`
- `beneficiaryPhoneNumber`
- `NINDetails`
- `biometrics`
- `incomplete`
- `verification`
- `nin`
- `face_capture`
- `faceCapture_skipThumbPrints`
- `isFingerprintOk`
- `userAddress`

`BeneficiaryService` stores one beneficiary object in `sessionStorage` under:

- `beneficiaryData`

Be careful when changing flow logic. Several components depend on these storage keys being present before they initialize.

## Guards

Guard files:

- `src/app/securities/auth/auth.guard.ts`
- `src/app/securities/others/others.guard.ts`

Both guards rely on `AuthService.agentIsLoggedIn()`. If the token is missing, the user is sent to `/auth/login`.

## Styling and Assets

Global styles:

- `src/styles.scss`
- `tailwind.config.js`

Static assets:

- `src/assets/images/`
- `src/assets/icons/`
- `src/assets/Euclid-CircularA-Custom-Fonts/`

The UI uses Angular Material components, Tailwind utility classes, and local SVG/PNG assets.

## Development Caveats

Review these before making large changes:

- The app imports `environment.prod` directly in several places, including `main.ts` and services. Confirm whether this is intentional.
- `JwtInterceptorService` may not be globally registered as an Angular interceptor.
- `DashboardRoutingModule` has a suspicious redirect/component route setup.
- The NIN verification step currently advances immediately during form setup.
- Several service methods manually build query strings. Watch for encoding issues if adding filters.
- Some API methods pass headers as the request body for `post` calls. Confirm backend expectations before refactoring.
- Many components rely on `localStorage` side effects. Removing or renaming keys can break resume, biometric, and onboarding flows.
- Some modules provide Angular Material modules in `providers`; these generally belong in `imports`, not `providers`.
- Existing generated specs are present, but meaningful test coverage appears limited.

## Suggested First Tasks for a New Developer

1. Run `npm install` and `npm start`.
2. Confirm which backend environment should be used locally.
3. Verify login and token storage.
4. Walk through `/home/dashboard`.
5. Walk through a new beneficiary onboarding from NIN to final submit.
6. Walk through continuing an incomplete beneficiary from `/home/all-beneficiary`.
7. Check whether biometrics require a native/external app setup.
8. Review interceptor registration and route caveats before changing auth or routing.

## Mental Model

Think of the app as four layers:

1. Root Angular shell: bootstraps the app and sends everything through routing.
2. Auth layer: logs agents in and stores a token in browser storage.
3. Protected home shell: wraps logged-in pages with header/navigation.
4. Feature workflows: dashboard, onboarding, biometrics, beneficiary lists, profile.

The onboarding workflow is not a strict route-per-step wizard. It is a state-driven component switcher backed by API calls and browser storage.
