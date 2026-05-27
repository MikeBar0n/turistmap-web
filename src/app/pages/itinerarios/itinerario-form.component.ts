import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ItinerarioService } from '../../core/services/itinerario.service';

@Component({
  selector: 'app-itinerario-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <div class="container">
      <div class="header">
        <button mat-icon-button routerLink="/itinerarios">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ esEdicion ? 'Editar' : 'Nuevo' }} Itinerario</h1>
      </div>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="guardar()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Título</mat-label>
              <input matInput formControlName="titulo" placeholder="Ej: Viaje a Cartagena">
              <mat-error *ngIf="form.get('titulo')?.hasError('required')">El título es obligatorio</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descripción</mat-label>
              <textarea matInput formControlName="descripcion" rows="3" placeholder="Describe tu viaje..."></textarea>
            </mat-form-field>

            <div class="fecha-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Fecha de inicio</mat-label>
                <input matInput [matDatepicker]="pickerInicio" formControlName="fechaInicio">
                <mat-datepicker-toggle matSuffix [for]="pickerInicio"></mat-datepicker-toggle>
                <mat-datepicker #pickerInicio></mat-datepicker>
                <mat-error *ngIf="form.get('fechaInicio')?.hasError('required')">La fecha de inicio es obligatoria</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Fecha de fin</mat-label>
                <input matInput [matDatepicker]="pickerFin" formControlName="fechaFin">
                <mat-datepicker-toggle matSuffix [for]="pickerFin"></mat-datepicker-toggle>
                <mat-datepicker #pickerFin></mat-datepicker>
                <mat-error *ngIf="form.get('fechaFin')?.hasError('required')">La fecha de fin es obligatoria</mat-error>
              </mat-form-field>
            </div>

            <div class="actions">
              <button mat-button type="button" routerLink="/itinerarios">Cancelar</button>
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
    .fecha-row { display: flex; gap: 16px; }
    .half-width { flex: 1; margin-bottom: 16px; }
    .actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
  `]
})
export class ItinerarioFormComponent implements OnInit {
  form: FormGroup;
  esEdicion = false;
  cargando = false;
  itinerarioId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private itinerarioService: ItinerarioService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.itinerarioId = this.route.snapshot.paramMap.get('id');
    if (this.itinerarioId) {
      this.esEdicion = true;
      this.itinerarioService.getItinerario(this.itinerarioId).subscribe({
        next: (res) => this.form.patchValue(res.itinerario),
        error: () => this.snackBar.open('Error al cargar itinerario', 'Cerrar', { duration: 3000 })
      });
    }
  }

  guardar() {
    if (this.form.invalid) return;
    this.cargando = true;

    const datos = this.form.value;

    if (this.esEdicion && this.itinerarioId) {
      this.itinerarioService.actualizarItinerario(this.itinerarioId, datos).subscribe({
        next: () => {
          this.snackBar.open('Itinerario actualizado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/itinerarios']);
        },
        error: () => {
          this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 });
          this.cargando = false;
        }
      });
    } else {
      this.itinerarioService.crearItinerario(datos).subscribe({
        next: () => {
          this.snackBar.open('Itinerario creado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/itinerarios']);
        },
        error: () => {
          this.snackBar.open('Error al crear', 'Cerrar', { duration: 3000 });
          this.cargando = false;
        }
      });
    }
  }
}