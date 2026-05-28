import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
export const routes: Routes = [
  { path: '', redirectTo: 'destinos', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.component').then(m => m.RegistroComponent)
  },
  {
    path: 'destinos',
    loadComponent: () => import('./pages/destinos/destinos.component').then(m => m.DestinosComponent)
  },
  {
    path: 'destinos/nuevo',
    loadComponent: () => import('./pages/destinos/destino-form.component').then(m => m.DestinoFormComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'destinos/editar/:id',
    loadComponent: () => import('./pages/destinos/destino-form.component').then(m => m.DestinoFormComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'actividades',
    loadComponent: () => import('./pages/actividades/actividades.component').then(m => m.ActividadesComponent)
  },
  {
    path: 'actividades/nuevo',
    loadComponent: () => import('./pages/actividades/actividad-form.component').then(m => m.ActividadFormComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'actividades/editar/:id',
    loadComponent: () => import('./pages/actividades/actividad-form.component').then(m => m.ActividadFormComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'itinerarios',
    loadComponent: () => import('./pages/itinerarios/itinerarios.component').then(m => m.ItinerariosComponent),
    canActivate: [authGuard]
  },
  {
    path: 'itinerarios/nuevo',
    loadComponent: () => import('./pages/itinerarios/itinerario-form.component').then(m => m.ItinerarioFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'itinerarios/editar/:id',
    loadComponent: () => import('./pages/itinerarios/itinerario-form.component').then(m => m.ItinerarioFormComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];