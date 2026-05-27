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
import { DestinoService } from '../../core/services/destino.service';

@Component({
  selector: 'app-destino-form',
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
        <button mat-icon-button routerLink="/destinos">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ esEdicion ? 'Editar' : 'Nuevo' }} Destino</h1>
      </div>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="guardar()">

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre del destino</mat-label>
              <input matInput formControlName="nombre" placeholder="Ej: Ciudad Amurallada">
              <mat-error *ngIf="form.get('nombre')?.hasError('required')">El nombre es obligatorio</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descripción</mat-label>
              <textarea matInput formControlName="descripcion" rows="3" placeholder="Describe el destino..."></textarea>
              <mat-error *ngIf="form.get('descripcion')?.hasError('required')">La descripción es obligatoria</mat-error>
            </mat-form-field>

            <div formGroupName="ubicacion" class="ubicacion-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Ciudad</mat-label>
                <input matInput formControlName="ciudad" placeholder="Ej: Cartagena">
                <mat-error *ngIf="form.get('ubicacion.ciudad')?.hasError('required')">La ciudad es obligatoria</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Departamento</mat-label>
                <input matInput formControlName="departamento" placeholder="Ej: Bolívar">
                <mat-error *ngIf="form.get('ubicacion.departamento')?.hasError('required')">El departamento es obligatorio</mat-error>
              </mat-form-field>
            </div>

            <div class="categoria-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Categoría</mat-label>
                <mat-select formControlName="categoria">
                  <mat-option value="playa">Playa</mat-option>
                  <mat-option value="montaña">Montaña</mat-option>
                  <mat-option value="ciudad">Ciudad</mat-option>
                  <mat-option value="ecoturismo">Ecoturismo</mat-option>
                  <mat-option value="cultural">Cultural</mat-option>
                  <mat-option value="aventura">Aventura</mat-option>
                  <mat-option value="otro">Otro</mat-option>
                </mat-select>
                <mat-error *ngIf="form.get('categoria')?.hasError('required')">La categoría es obligatoria</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Calificación (0-5)</mat-label>
                <input matInput type="number" formControlName="calificacion" min="0" max="5">
              </mat-form-field>
            </div>

            <div class="actions">
              <button mat-button type="button" routerLink="/destinos">Cancelar</button>
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
    .ubicacion-row { display: flex; gap: 16px; }
    .categoria-row { display: flex; gap: 16px; }
    .half-width { flex: 1; margin-bottom: 16px; }
    .actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
  `]
})
export class DestinoFormComponent implements OnInit {
  form: FormGroup;
  esEdicion = false;
  cargando = false;
  destinoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private destinoService: DestinoService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      ubicacion: this.fb.group({
        ciudad: ['', Validators.required],
        departamento: ['', Validators.required],
      }),
      categoria: ['', Validators.required],
      calificacion: [0],
    });
  }

  ngOnInit() {
    this.destinoId = this.route.snapshot.paramMap.get('id');
    if (this.destinoId) {
      this.esEdicion = true;
      this.destinoService.getDestino(this.destinoId).subscribe({
        next: (res) => this.form.patchValue(res.destino),
        error: () => this.snackBar.open('Error al cargar destino', 'Cerrar', { duration: 3000 })
      });
    }
  }

  guardar() {
    if (this.form.invalid) return;
    this.cargando = true;

    const datos = this.form.value;

    if (this.esEdicion && this.destinoId) {
      this.destinoService.actualizarDestino(this.destinoId, datos).subscribe({
        next: () => {
          this.snackBar.open('Destino actualizado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/destinos']);
        },
        error: () => {
          this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 });
          this.cargando = false;
        }
      });
    } else {
      this.destinoService.crearDestino(datos).subscribe({
        next: () => {
          this.snackBar.open('Destino creado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/destinos']);
        },
        error: () => {
          this.snackBar.open('Error al crear', 'Cerrar', { duration: 3000 });
          this.cargando = false;
        }
      });
    }
  }
}