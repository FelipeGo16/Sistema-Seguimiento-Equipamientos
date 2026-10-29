import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const usuario = authService.usuarioActual;

  if (!usuario) {
    router.navigate(['/login']);
    return false;
  }

  // Validación opcional de roles específicos por ruta mediante data en el routing
  const rolesEsperados = route.data['roles'] as Array<string>;
  if (rolesEsperados && !rolesEsperados.includes(usuario.rol)) {
    alert('Acceso denegado: Su perfil no cuenta con privilegios para esta sección.');
    router.navigate(['/']);
    return false;
  }

  return true;
};
