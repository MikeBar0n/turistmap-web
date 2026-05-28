import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { DestinoService } from '../../core/services/destino.service';
import { Destino } from '../../core/models/interfaces';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AgregarItinerarioDialogComponent } from '../../shared/agregar-itinerario-dialog/agregar-itinerario-dialog.component';
import { filter } from 'rxjs';

@Component({
    selector: 'app-destinos',
    standalone: true,
    imports: [
        CommonModule, RouterModule, MatCardModule,
        MatButtonModule, MatIconModule, MatSnackBarModule, MatChipsModule,
    ],
    templateUrl: './destinos.component.html',
    styleUrl: './destinos.component.css'
})
export class DestinosComponent implements OnInit {
    destinos: Destino[] = [];
    esAdmin = false;
    estaLogueado = false;

    constructor(
        private destinoService: DestinoService,
        private snackBar: MatSnackBar,
        private router: Router,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.esAdmin = localStorage.getItem('rol') === 'administrador';
        this.estaLogueado = !!localStorage.getItem('token');
        this.cargarDestinos();

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.cargarDestinos();
        });
    }

    agregarAItinerario(destino: Destino) {
        this.dialog.open(AgregarItinerarioDialogComponent, {
            data: { nombre: destino.nombre, id: destino._id, tipo: 'destino' }
        });
    }

    cargarDestinos() {
        this.destinoService.getDestinos().subscribe({
            next: (res) => this.destinos = res.destinos,
            error: () => this.snackBar.open('Error al cargar destinos', 'Cerrar', { duration: 3000 })
        });
    }

    eliminar(id: string) {
        if (confirm('Deseas eliminar este destino?')) {
            this.destinoService.eliminarDestino(id).subscribe({
                next: () => {
                    this.snackBar.open('Destino eliminado', 'Cerrar', { duration: 3000 });
                    this.cargarDestinos();
                },
                error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
            });
        }
    }

    getCalificacion(cal: number): string {
        return '*'.repeat(Math.round(cal || 0));
    }

    getEstaLogueado(): boolean {
        return !!localStorage.getItem('token');
    }
}