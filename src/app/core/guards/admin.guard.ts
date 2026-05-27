import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  if (token && rol === 'administrador') {
    return true;
  }

  router.navigate(['/destinos']);
  return false;
};