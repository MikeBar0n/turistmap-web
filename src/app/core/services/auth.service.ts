import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/interfaces';
const API = 'http://localhost:3000/api';
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}
  registro(datos: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API}/auth/registro`, datos).pipe(
      tap(res => this.guardarSesion(res))
    );
  }
  login(datos: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API}/auth/login`, datos).pipe(
      tap(res => this.guardarSesion(res))
    );
  }
  private guardarSesion(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('rol', res.usuario.rol);
    localStorage.setItem('nombre', res.usuario.nombre);
    localStorage.setItem('userId', res.usuario.id);
  }
  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
    localStorage.removeItem('userId');
  }
  estaLogueado(): boolean {
    return !!localStorage.getItem('token');
  }
  esAdmin(): boolean {
    return localStorage.getItem('rol') === 'administrador';
  }
}