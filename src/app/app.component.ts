import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './security/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <div class="brand">
        <mat-icon>event_available</mat-icon>
        <span>Agenda Online</span>
      </div>

      <span class="spacer"></span>

      <button mat-button routerLink="/customers" *ngIf="authed()">Clientes</button>

      <button mat-button routerLink="/login" *ngIf="!authed()">Entrar</button>

      <button mat-stroked-button (click)="logout()" *ngIf="authed()">Sair</button>

      <button mat-button class="toolbar-chip" disabled>William Domingues</button>
    </mat-toolbar>

    <router-outlet />
  `,
  styles: [
    `
      .toolbar {
        position: sticky;
        top: 0;
        z-index: 10;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 18px;
        letter-spacing: 0.5px;
      }
      .spacer {
        flex: 1;
      }
      .toolbar-chip {
        opacity: 0.9;
      }
    `
  ]
})
export class AppComponent {
  authed = computed(() => this.auth.isAuthenticated());

  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
