import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActividadService } from '../../core/services/actividad.service';
import { Actividad } from '../../core/models/interfaces';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AgregarItinerarioDialogComponent } from '../../shared/agregar-itinerario-dialog/agregar-itinerario-dialog.component';
import { filter } from 'rxjs';

@Component({
    selector: 'app-actividades',
    standalone: true,
    imports: [
        CommonModule, RouterModule, MatCardModule,
        MatButtonModule, MatIconModule, MatSnackBarModule,
    ],
    templateUrl: './actividades.component.html',
    styleUrl: './actividades.component.css'
})
export class ActividadesComponent implements OnInit {
    actividades: Actividad[] = [];
    esAdmin = false;
    constructor(
        private actividadService: ActividadService,
        private snackBar: MatSnackBar,
        private router: Router,
        private dialog: MatDialog
    ) { }
    ngOnInit() {
        this.esAdmin = localStorage.getItem('rol') === 'administrador';
        this.cargarActividades();

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.cargarActividades();
        });
    }
    cargarActividades() {
        this.actividadService.getActividades().subscribe({
            next: (res) => this.actividades = res.actividades,
            error: () => this.snackBar.open('Error al cargar actividades', 'Cerrar', { duration: 3000 })
        });
    }
    eliminar(id: string) {
        if (confirm('Deseas eliminar esta actividad?')) {
            this.actividadService.eliminarActividad(id).subscribe({
                next: () => {
                    this.snackBar.open('Actividad eliminada', 'Cerrar', { duration: 3000 });
                    this.cargarActividades();
                },
                error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
            });
        }
    }
    getEstaLogueado(): boolean {
        return !!localStorage.getItem('token');
    }
    agregarAItinerario(actividad: Actividad) {
        this.dialog.open(AgregarItinerarioDialogComponent, {
            data: { nombre: actividad.nombre, id: actividad._id, tipo: 'actividad' }
        });
    }
}