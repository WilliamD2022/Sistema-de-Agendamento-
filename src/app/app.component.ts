import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <div class="brand">
        <mat-icon>event_available</mat-icon>
        <span>Agenda Online</span>
      </div>
      <span class="spacer"></span>
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
export class AppComponent {}
