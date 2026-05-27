import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  estaLogueado = false;
  nombreUsuario = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.verificarSesion();
    this.router.events.subscribe(() => this.verificarSesion());
  }

  verificarSesion() {
    const token = localStorage.getItem('token');
    const nombre = localStorage.getItem('nombre');
    this.estaLogueado = !!token;
    this.nombreUsuario = nombre || '';
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
    this.router.navigate(['/login']);
  }
}
