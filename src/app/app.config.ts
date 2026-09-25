import {
  ApplicationConfig,
  provideZoneChangeDetection,
  LOCALE_ID,
} from "@angular/core";
import { provideRouter } from "@angular/router";

// IMPORTS OBLIGATORIOS PARA SOLUCIONAR EL ERROR DE IDIOMA "ES"
import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
import { routes } from "./app.routes";

// Registramos los datos en el motor de Angular
registerLocaleData(localeEs, "es");

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Establecemos que toda la aplicación hable español por defecto
    { provide: LOCALE_ID, useValue: "es" },
  ],
};
