import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../security/auth.service';

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule
    ],
    template: `
    <div class="wrap">
      <mat-card class="card">
        <h1>Entrar</h1>
        <p class="muted">Acesse para gerenciar seu sistema.</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="form">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" autocomplete="username" />
            <mat-error *ngIf="form.controls.email.invalid">Email inválido</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Senha</mat-label>
            <input matInput type="password" formControlName="password" autocomplete="current-password" />
            <mat-error *ngIf="form.controls.password.invalid">Senha obrigatória</mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
      </mat-card>
    </div>
  `,
    styles: [`
    .wrap { min-height: calc(100vh - 64px); display:flex; align-items:center; justify-content:center; padding: 24px; }
    .card { width: 100%; max-width: 420px; padding: 20px; border-radius: 16px; }
    h1 { margin: 0 0 6px; font-size: 28px; }
    .muted { margin: 0 0 16px; opacity: 0.75; }
    .form { display:flex; flex-direction:column; gap: 12px; }
  `]
})
export class LoginPageComponent {
    loading = false;

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router,
        private snack: MatSnackBar
    ) {}

    submit() {
        if (this.form.invalid) return;
        this.loading = true;

        const body = {
            email: this.form.value.email!,
            password: this.form.value.password!
        };

        this.auth.login(body).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigateByUrl('/customers');
            },
            error: (err) => {
                this.loading = false;
                const msg = err?.error?.message ?? 'Email ou senha inválidos';
                this.snack.open(msg, 'Fechar', { duration: 2500 });
            }
        });
    }
}
