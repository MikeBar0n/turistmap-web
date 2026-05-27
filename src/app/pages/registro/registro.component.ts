import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
@Component({
    selector: 'app-registro',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule, RouterModule,
        MatFormFieldModule, MatInputModule, MatButtonModule,
        MatIconModule, MatCardModule, MatSelectModule, MatSnackBarModule,
    ],
    templateUrl: './registro.component.html',
    styleUrl: './registro.component.css'
})
export class RegistroComponent {
    form: FormGroup;
    cargando = false;
    ocultarPassword = true;
    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.form = this.fb.group({
            nombre: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            rol: ['turista'],
        });
    }
    registrar() {
        if (this.form.invalid) return;
        this.cargando = true;
        this.authService.registro(this.form.value).subscribe({
            next: () => {
                this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
                this.router.navigate(['/destinos']);
            },
            error: (err) => {
                this.snackBar.open(err.error?.message || 'Error al registrar', 'Cerrar', { duration: 3000 });
                this.cargando = false;
            }
        });
    }
}