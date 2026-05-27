import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ItinerarioService } from '../../core/services/itinerario.service';
import { Itinerario } from '../../core/models/interfaces';

@Component({
  selector: 'app-itinerarios',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Mis Itinerarios</h1>
        <button mat-raised-button color="primary" routerLink="/itinerarios/nuevo">
          <mat-icon>add</mat-icon> Nuevo Itinerario
        </button>
      </div>

      <div class="empty" *ngIf="itinerarios.length === 0">
        <mat-icon>map</mat-icon>
        <p>No tienes itinerarios aún. ¡Crea tu primer viaje!</p>
        <button mat-raised-button color="primary" routerLink="/itinerarios/nuevo">
          Crear itinerario
        </button>
      </div>

      <div class="grid">
        <mat-card *ngFor="let item of itinerarios" class="card">
          <mat-card-header>
            <mat-card-title>{{ item.titulo }}</mat-card-title>
            <mat-card-subtitle>
              {{ item.fechaInicio | date:'mediumDate' }} — {{ item.fechaFin | date:'mediumDate' }}
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ item.descripcion }}</p>
            <p class="actividades-count">
              <mat-icon>event</mat-icon>
              {{ item.actividades?.length || 0 }} actividades agendadas
            </p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" [routerLink]="['/itinerarios/editar', item._id]">
              <mat-icon>edit</mat-icon> Editar
            </button>
            <button mat-button color="warn" (click)="eliminar(item._id!)">
              <mat-icon>delete</mat-icon> Eliminar
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .header h1 { margin: 0; color: #3f51b5; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    .card { border-radius: 12px; }
    .empty { text-align: center; padding: 60px 20px; color: #999; }
    .empty mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; }
    .actividades-count { display: flex; align-items: center; gap: 6px; color: #666; font-size: 14px; }
    mat-card-actions { padding: 8px 16px; }
  `]
})
export class ItinerariosComponent implements OnInit {
  itinerarios: Itinerario[] = [];

  constructor(
    private itinerarioService: ItinerarioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.cargarItinerarios();
  }

  cargarItinerarios() {
    this.itinerarioService.getItinerarios().subscribe({
      next: (res) => this.itinerarios = res.itinerarios,
      error: () => this.snackBar.open('Error al cargar itinerarios', 'Cerrar', { duration: 3000 })
    });
  }

  eliminar(id: string) {
    if (confirm('¿Estás seguro de eliminar este itinerario?')) {
      this.itinerarioService.eliminarItinerario(id).subscribe({
        next: () => {
          this.snackBar.open('Itinerario eliminado', 'Cerrar', { duration: 3000 });
          this.cargarItinerarios();
        },
        error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
      });
    }
  }
}