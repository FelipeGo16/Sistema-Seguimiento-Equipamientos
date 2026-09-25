import { bootstrapApplication } from "@angular/platform-browser";
import { provideHttpClient } from "@angular/common/http";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // <-- Esto reemplaza a HttpClientModule de forma limpia
  ],
}).catch((err) => console.error(err));
