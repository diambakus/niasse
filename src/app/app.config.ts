import { HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import {
  AutoRefreshTokenService,
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  includeBearerTokenInterceptor,
  provideKeycloak,
  UserActivityService,
  withAutoRefreshToken
} from 'keycloak-angular';
import { routes } from './app.routes';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment.dev';
import { GetPaginatorIntlProvider, I18nInitializerProvider } from './i18n';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const provideKeycloakAngular = () =>
  provideKeycloak({
    config: {
      url: environment.keycloak.server,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    },
    features: [
      withAutoRefreshToken({
        onInactivityTimeout: 'logout',
        sessionTimeout: 1000
      })
    ],
    providers: [AutoRefreshTokenService, UserActivityService]
  });

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

const gatewayCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: environment.production ? /\/(servitus|rogator|stoa)\/.*/i : /^(http:\/\/localhost:8094\/(servitus|rogator|stoa)\/.*)$/i,
  bearerPrefix: 'Bearer'
});

const adminApiCondition = createInterceptorCondition({
  urlPattern: /^https:\/\/admin-api\.company\.com\/.*/i,
  bearerPrefix: 'Bearer'
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideKeycloakAngular(),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [gatewayCondition]
    },
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([includeBearerTokenInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        subscriptSizing: 'dynamic'
      }
    },
    GetPaginatorIntlProvider,
    I18nInitializerProvider,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ]
};
