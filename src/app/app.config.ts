import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // <-- Necesario para peticiones HTTP
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { routes } from './app.routes';

registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), // <-- Agrégalo aquí si no está
    { provide: LOCALE_ID, useValue: 'es' },
  ],
};
