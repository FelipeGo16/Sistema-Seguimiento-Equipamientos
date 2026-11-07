import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

// Importación directa de los nuevos componentes Standalone segregados
import { LoginComponent } from './components/login/login.component';
import { EquipamientosComponent } from './components/equipamientos/equipamientos.component';
import { OcupacionComponent } from './components/ocupacion/ocupacion.component';

// CORRECCIÓN: Cambiamos 'CalendarioComponent' por 'CalendarComponent' para alinearlo con tu archivo
import { CalendarComponent } from './components/calendario/calendario.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    EquipamientosComponent,
    OcupacionComponent,
    CalendarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  activeModule: number = 1;

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
    this.activeModule = 1;
  }
}
