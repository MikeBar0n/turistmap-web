import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { ActividadService } from '../../core/services/actividad.service';
import { DestinoService } from '../../core/services/destino.service';
import { Destino } from '../../core/models/interfaces';

@Component({
  selector: 'app-actividad-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCardModule,
  ],
  template: `
    <div class="container">
      <div class="header">
        <button mat-icon-button routerLink="/actividades">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ esEdicion ? 'Editar' : 'Nueva' }} Actividad</h1>
      </div>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="guardar()">

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre de la actividad</mat-label>
              <input matInput formControlName="nombre" placeholder="Ej: Tour por las murallas">
              <mat-error *ngIf="form.get('nombre')?.hasError('required')">El nombre es obligatorio</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descripción</mat-label>
              <textarea matInput formControlName="descripcion" rows="3" placeholder="Describe la actividad..."></textarea>
              <mat-error *ngIf="form.get('descripcion')?.hasError('required')">La descripción es obligatoria</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Destino</mat-label>
              <mat-select formControlName="destino">
                <mat-option *ngFor="let d of destinos" [value]="d._id">{{ d.nombre }}</mat-option>
              </mat-select>
              <mat-error *ngIf="form.get('destino')?.hasError('required')">El destino es obligatorio</mat-error>
            </mat-form-field>

            <div class="row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Tipo</mat-label>
                <mat-select formControlName="tipo">
                  <mat-option value="deportiva">Deportiva</mat-option>
                  <mat-option value="cultural">Cultural</mat-option>
                  <mat-option value="gastronomica">Gastronómica</mat-option>
                  <mat-option value="recreativa">Recreativa</mat-option>
                  <mat-option value="educativa">Educativa</mat-option>
                  <mat-option value="otro">Otro</mat-option>
                </mat-select>
                <mat-error *ngIf="form.get('tipo')?.hasError('required')">El tipo es obligatorio</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Precio (COP)</mat-label>
                <input matInput type="number" formControlName="precio" min="0">
              </mat-form-field>
            </div>

            <div class="row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Duración (horas)</mat-label>
                <input matInput type="number" formControlName="duracionHoras" min="1">
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Cupo máximo</mat-label>
                <input matInput type="number" formControlName="cupoMaximo" min="1">
              </mat-form-field>
            </div>

            <div class="actions">
              <button mat-button type="button" routerLink="/actividades">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || cargando">
                {{ cargando ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 24px; max-width: 700px; margin: 0 auto; }
    .header { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
    .header h1 { margin: 0; color: #3f51b5; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .row { display: flex; gap: 16px; }
    .half-width { flex: 1; margin-bottom: 16px; }
    .actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
  `]
})
export class ActividadFormComponent implements OnInit {
  form: FormGroup;
  esEdicion = false;
  cargando = false;
  actividadId: string | null = null;
  destinos: Destino[] = [];

  constructor(
    private fb: FormBuilder,
    private actividadService: ActividadService,
    private destinoService: DestinoService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      destino: ['', Validators.required],
      tipo: ['', Validators.required],
      precio: [0],
      duracionHoras: [1],
      cupoMaximo: [20],
    });
  }

  ngOnInit() {
    this.cargarDestinos();
    this.actividadId = this.route.snapshot.paramMap.get('id');
    if (this.actividadId) {
      this.esEdicion = true;
      this.actividadService.getActividad(this.actividadId).subscribe({
        next: (res) => {
          const a = res.actividad;
          this.form.patchValue({
            nombre: a.nombre,
            descripcion: a.descripcion,
            destino: a.destino?._id || a.destino,
            tipo: a.tipo,
            precio: a.precio,
            duracionHoras: a.duracion?.horas || 1,
            cupoMaximo: a.cupoMaximo,
          });
        },
        error: () => this.snackBar.open('Error al cargar actividad', 'Cerrar', { duration: 3000 })
      });
    }
  }

  cargarDestinos() {
    this.destinoService.getDestinos().subscribe({
      next: (res) => this.destinos = res.destinos,
      error: () => this.snackBar.open('Error al cargar destinos', 'Cerrar', { duration: 3000 })
    });
  }

  guardar() {
    if (this.form.invalid) return;
    this.cargando = true;

    const v = this.form.value;
    const datos = {
      nombre: v.nombre,
      descripcion: v.descripcion,
      destino: v.destino,
      tipo: v.tipo,
      precio: v.precio,
      cupoMaximo: v.cupoMaximo,
      duracion: { horas: v.duracionHoras },
    };

    if (this.esEdicion && this.actividadId) {
      this.actividadService.actualizarActividad(this.actividadId, datos).subscribe({
        next: () => {
          this.snackBar.open('Actividad actualizada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/actividades']);
        },
        error: () => {
          this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 });
          this.cargando = false;
        }
      });
    } else {
      this.actividadService.crearActividad(datos).subscribe({
        next: () => {
          this.snackBar.open('Actividad creada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/actividades']);
        },
        error: () => {
          this.snackBar.open('Error al crear', 'Cerrar', { duration: 3000 });
          this.cargando = false;
        }
      });
    }
  }
}