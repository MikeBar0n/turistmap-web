import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { DestinoService } from '../../core/services/destino.service';
import { Destino } from '../../core/models/interfaces';
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
    constructor(
        private destinoService: DestinoService,
        private snackBar: MatSnackBar
    ) { }
    ngOnInit() {
        this.esAdmin = localStorage.getItem('rol') === 'administrador';
        this.cargarDestinos();
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
}