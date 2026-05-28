import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found">
      <mat-icon class="icon">explore_off</mat-icon>
      <h1>404</h1>
      <p>La pagina que buscas no existe.</p>
      <button mat-raised-button color="primary" routerLink="/destinos">
        <mat-icon>home</mat-icon> Volver al inicio
      </button>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      text-align: center;
      color: #666;
    }
    .icon { font-size: 80px; width: 80px; height: 80px; color: #ccc; margin-bottom: 16px; }
    h1 { font-size: 72px; color: #3f51b5; margin: 0; }
    p { font-size: 18px; margin: 16px 0 24px; }
  `]
})
export class NotFoundComponent {};