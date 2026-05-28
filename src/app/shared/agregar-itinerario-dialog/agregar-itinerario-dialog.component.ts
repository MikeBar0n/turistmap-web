import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ItinerarioService } from '../../core/services/itinerario.service';
import { Itinerario } from '../../core/models/interfaces';

@Component({
  selector: 'app-agregar-itinerario-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatButtonModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatIconModule, MatSnackBarModule, MatTabsModule,
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>bookmark_add</mat-icon>
      Agregar a itinerario
    </h2>

    <mat-dialog-content>
      <p class="destino-nombre">{{ data.nombre }}</p>

      <mat-tab-group>
        <mat-tab label="Itinerario existente">
          @if (itinerarios.length === 0) {
            <p class="sin-itinerarios">No tienes itinerarios creados aún.</p>
          } @else {
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Selecciona un itinerario</mat-label>
              <mat-select [(value)]="itinerarioSeleccionado">
                @for (it of itinerarios; track it._id) {
                  <mat-option [value]="it._id">{{ it.titulo }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <button mat-raised-button color="primary" class="full-width"
              [disabled]="!itinerarioSeleccionado || cargando"
              (click)="agregarAExistente()">
              {{ cargando ? 'Agregando...' : 'Agregar a este itinerario' }}
            </button>
          }
        </mat-tab>

        <mat-tab label="Nuevo itinerario">
          <form [formGroup]="form" (ngSubmit)="crearYAgregar()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Título del itinerario</mat-label>
              <input matInput formControlName="titulo" placeholder="Ej: Viaje a Cartagena">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Fecha de inicio</mat-label>
              <input matInput type="date" formControlName="fechaInicio">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Fecha de fin</mat-label>
              <input matInput type="date" formControlName="fechaFin">
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" class="full-width"
              [disabled]="form.invalid || cargando">
              {{ cargando ? 'Creando...' : 'Crear y agregar' }}
            </button>
          </form>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 { display: flex; align-items: center; gap: 8px; color: #3f51b5; }
    .destino-nombre { font-weight: 500; color: #333; margin-bottom: 16px; font-size: 15px; }
    .full-width { width: 100%; margin-bottom: 12px; margin-top: 16px; }
    .sin-itinerarios { color: #999; text-align: center; padding: 24px 0; }
    mat-tab-group { margin-top: 8px; }
    mat-dialog-content { min-width: 350px; }
  `]
})
export class AgregarItinerarioDialogComponent implements OnInit {
  itinerarios: Itinerario[] = [];
  itinerarioSeleccionado: string = '';
  cargando = false;
  form: FormGroup;

  constructor(
    private itinerarioService: ItinerarioService,
    private dialogRef: MatDialogRef<AgregarItinerarioDialogComponent>,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { nombre: string; id: string; tipo: 'destino' | 'actividad' }
  ) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.itinerarioService.getItinerarios().subscribe({
      next: (res) => this.itinerarios = res.itinerarios,
      error: () => {}
    });
  }

  agregarAExistente() {
    if (!this.itinerarioSeleccionado) return;
    this.cargando = true;

    const itinerario = this.itinerarios.find(i => i._id === this.itinerarioSeleccionado);
    if (!itinerario) return;

    const actividades = itinerario.actividades || [];
    if (this.data.tipo === 'actividad') {
      actividades.push({ actividad: this.data.id });
    }

    this.itinerarioService.actualizarItinerario(this.itinerarioSeleccionado, { actividades }).subscribe({
      next: () => {
        this.snackBar.open('Agregado al itinerario exitosamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Error al agregar', 'Cerrar', { duration: 3000 });
        this.cargando = false;
      }
    });
  }

  crearYAgregar() {
    if (this.form.invalid) return;
    this.cargando = true;

    const datos: any = {
      ...this.form.value,
      actividades: this.data.tipo === 'actividad' ? [{ actividad: this.data.id }] : [],
    };

    this.itinerarioService.crearItinerario(datos).subscribe({
      next: () => {
        this.snackBar.open('Itinerario creado y agregado exitosamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Error al crear itinerario', 'Cerrar', { duration: 3000 });
        this.cargando = false;
      }
    });
  }
}