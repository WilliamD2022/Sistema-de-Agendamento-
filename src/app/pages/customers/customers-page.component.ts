import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomersApiService } from '../../api/customers-api.service';
import {
  AppointmentStatus,
  AppointmentSummary,
  AppointmentUpsertRequest,
  CustomerCreateRequest,
  CustomerResponse
} from '../../api/models';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule
  ],
  template: `
    <div class="page-shell">
      <div class="container">
        <section class="header">
          <div>
            <div class="pill">Desenvolvido por: - William Domingues Barbosa</div>
            <h1>Sistema de agendamento e cadastro</h1>
            <p class="muted">Cadastre novos clientes, edite dados e mantenha sua agenda organizada.</p>
          </div>
          <button mat-flat-button color="primary" class="cta" (click)="openCreate()">
            <mat-icon>person_add</mat-icon>
            Novo Cliente
          </button>
        </section>

        <div class="card">
          <mat-progress-bar *ngIf="loading()" mode="indeterminate"></mat-progress-bar>
          <div class="table-wrap">
            <table mat-table [dataSource]="customers()" class="full-width">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nome</th>
                <td mat-cell *matCellDef="let customer">{{ customer.name }}</td>
              </ng-container>

              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>Telefone</th>
                <td mat-cell *matCellDef="let customer">{{ customer.phone || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let customer">{{ customer.email || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="appointment">
                <th mat-header-cell *matHeaderCellDef>Agendamento</th>
                <td mat-cell *matCellDef="let customer">
                  {{ customer.appointment?.startsAt ? (customer.appointment?.startsAt | date: 'dd/MM/yyyy HH:mm') : '-' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let customer">
                  <span
                    *ngIf="customer.appointment; else noStatus"
                    class="status-pill"
                    [class.status-late]="isAppointmentLate(customer.appointment)"
                  >
                    {{ appointmentStatusLabel(customer.appointment.status) }}
                  </span>
                  <ng-template #noStatus>-</ng-template>
                </td>
              </ng-container>

              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Criado em</th>
                <td mat-cell *matCellDef="let customer">{{ customer.createdAt | date: 'dd/MM/yyyy HH:mm' }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acoes</th>
                <td mat-cell *matCellDef="let customer">
                  <button mat-icon-button color="primary" (click)="openEdit(customer)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="confirmDelete(customer)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          </div>

          <div class="empty" *ngIf="!loading() && customers().length === 0">
            <mat-icon>event_busy</mat-icon>
            <p>Nenhum cliente cadastrado ainda.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 24px;
        margin-bottom: 24px;
      }
      h1 {
        margin: 12px 0 8px;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 32px;
      }
      .cta {
        height: 48px;
        padding: 0 20px;
        font-weight: 600;
      }
      .full-width {
        width: 100%;
      }
      th.mat-mdc-header-cell {
        font-weight: 600;
      }
      .status-pill {
        display: inline-flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        background: rgba(17, 24, 39, 0.08);
        color: #1f2937;
      }
      .status-late {
        background: rgba(220, 38, 38, 0.12);
        color: #b42318;
      }
      .empty {
        padding: 40px 24px 56px;
        text-align: center;
        color: var(--muted);
        display: grid;
        gap: 12px;
      }
      .empty mat-icon {
        font-size: 40px;
      }
      @media (max-width: 860px) {
        .header {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `
  ]
})
export class CustomersPageComponent {
  private readonly api = inject(CustomersApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly customers = signal<CustomerResponse[]>([]);
  readonly loading = signal(false);
  readonly displayedColumns = ['name', 'phone', 'email', 'appointment', 'status', 'createdAt', 'actions'];
  readonly statusLabels: Record<AppointmentStatus, string> = {
    SCHEDULED: 'Agendado',
    COMPLETED: 'Concluido',
    NO_SHOW: 'Nao compareceu'
  };

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.api.list().subscribe({
      next: data => this.customers.set(data),
      error: () => this.snackBar.open('Erro ao carregar clientes', 'Fechar', { duration: 3000 }),
      complete: () => this.loading.set(false)
    });
  }

  openCreate() {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      data: {
        title: 'Novo cliente',
        submitLabel: 'Salvar'
      }
    });

    dialogRef.afterClosed().subscribe((payload?: CustomerCreateRequest) => {
      if (!payload) return;
      this.api.create(payload).subscribe({
        next: () => {
          this.snackBar.open('Cliente criado com sucesso', 'Fechar', { duration: 3000 });
          this.load();
        },
        error: () => this.snackBar.open('Erro ao criar cliente', 'Fechar', { duration: 3000 })
      });
    });
  }

  openEdit(customer: CustomerResponse) {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      data: {
        title: 'Editar cliente',
        submitLabel: 'Atualizar',
        customer
      }
    });

    dialogRef.afterClosed().subscribe((payload?: CustomerCreateRequest) => {
      if (!payload) return;
      this.api.update(customer.id, payload).subscribe({
        next: () => {
          this.snackBar.open('Cliente atualizado', 'Fechar', { duration: 3000 });
          this.load();
        },
        error: () => this.snackBar.open('Erro ao atualizar cliente', 'Fechar', { duration: 3000 })
      });
    });
  }

  confirmDelete(customer: CustomerResponse) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir cliente',
        message: `Deseja excluir ${customer.name}?`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed?: boolean) => {
      if (!confirmed) return;
      this.api.delete(customer.id).subscribe({
        next: () => {
          this.snackBar.open('Cliente removido', 'Fechar', { duration: 3000 });
          this.load();
        },
        error: () => this.snackBar.open('Erro ao remover cliente', 'Fechar', { duration: 3000 })
      });
    });
  }

  appointmentStatusLabel(status?: AppointmentStatus | null) {
    return status ? this.statusLabels[status] : '-';
  }

  isAppointmentLate(appointment?: AppointmentSummary | null) {
    if (!appointment) return false;
    if (appointment.status === 'NO_SHOW') return true;
    if (appointment.status !== 'SCHEDULED') return false;
    const startsAt = new Date(appointment.startsAt).getTime();
    return Number.isFinite(startsAt) && startsAt < Date.now();
  }
}

interface CustomerDialogData {
  title: string;
  submitLabel: string;
  customer?: CustomerResponse;
}

@Component({
  selector: 'app-customer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content class="dialog-body">
        <mat-form-field appearance="outline">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="name" placeholder="Nome completo" />
          <mat-error *ngIf="form.get('name')?.hasError('required')">Informe o nome</mat-error>
          <mat-error *ngIf="form.get('name')?.hasError('maxlength')">Maximo de 120 caracteres</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Telefone</mat-label>
          <input matInput formControlName="phone" placeholder="(00) 00000-0000" />
          <mat-error *ngIf="form.get('phone')?.hasError('maxlength')">Maximo de 30 caracteres</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" placeholder="email@exemplo.com" />
          <mat-error *ngIf="form.get('email')?.hasError('email')">Email invalido</mat-error>
          <mat-error *ngIf="form.get('email')?.hasError('maxlength')">Maximo de 160 caracteres</mat-error>
        </mat-form-field>

        <div class="section-title">Agendamento</div>

        <mat-form-field appearance="outline">
          <mat-label>Data e hora</mat-label>
          <input matInput type="text" formControlName="appointmentStartsAt" placeholder="dd/MM/yyyy HH:mm" />
          <mat-error *ngIf="form.get('appointmentStartsAt')?.hasError('required')">Informe data e hora</mat-error>
          <mat-error *ngIf="form.get('appointmentStartsAt')?.hasError('invalidFormat')">Formato invalido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="appointmentStatus">
            <mat-option [value]="null">Sem status</mat-option>
            <mat-option value="SCHEDULED">Agendado</mat-option>
            <mat-option value="COMPLETED">Concluido</mat-option>
            <mat-option value="NO_SHOW">Nao compareceu</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Observacoes</mat-label>
          <textarea matInput rows="3" formControlName="appointmentNotes" placeholder="Detalhes do agendamento"></textarea>
          <mat-error *ngIf="form.get('appointmentNotes')?.hasError('maxlength')">Maximo de 500 caracteres</mat-error>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-flat-button color="primary" type="submit">{{ data.submitLabel }}</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [
    `
      .dialog-body {
        display: grid;
        gap: 16px;
        min-width: 320px;
      }
      .section-title {
        font-weight: 600;
        margin-top: 8px;
        color: #1f2937;
      }
      mat-form-field {
        width: 100%;
      }
    `
  ]
})
class CustomerDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CustomerDialogComponent>);
  readonly form = inject(FormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    phone: ['', [Validators.maxLength(30)]],
    email: ['', [Validators.email, Validators.maxLength(160)]],
    appointmentStartsAt: [''],
    appointmentStatus: [null as AppointmentStatus | null],
    appointmentNotes: ['', [Validators.maxLength(500)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: CustomerDialogData) {
    if (data.customer) {
      this.form.patchValue({
        name: data.customer.name,
        phone: data.customer.phone ?? '',
        email: data.customer.email ?? '',
        appointmentStartsAt: this.toDisplayDateTime(data.customer.appointment?.startsAt),
        appointmentStatus: data.customer.appointment?.status ?? null,
        appointmentNotes: data.customer.appointment?.notes ?? ''
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const appointmentStartsAtRaw = this.form.value.appointmentStartsAt?.trim() || '';
    const appointmentStatus = this.form.value.appointmentStatus ?? null;
    const appointmentNotes = this.form.value.appointmentNotes?.trim() || '';

    let appointment: AppointmentUpsertRequest | null = null;
    if (appointmentStartsAtRaw) {
      const normalizedStartsAt = this.normalizeDateTimeLocal(appointmentStartsAtRaw);
      if (!this.isValidDateTimeLocal(normalizedStartsAt)) {
        this.form.get('appointmentStartsAt')?.setErrors({ invalidFormat: true });
        this.form.markAllAsTouched();
        return;
      }
      appointment = {
        startsAt: normalizedStartsAt,
        status: appointmentStatus ?? 'SCHEDULED',
        notes: appointmentNotes || null
      };
    } else if (appointmentStatus || appointmentNotes) {
      this.form.get('appointmentStartsAt')?.setErrors({ required: true });
      this.form.markAllAsTouched();
      return;
    }

    const payload: CustomerCreateRequest = {
      name: this.form.value.name?.trim() || '',
      phone: this.form.value.phone?.trim() || null,
      email: this.form.value.email?.trim() || null,
      appointment
    };

    this.dialogRef.close(payload);
  }

  private toDisplayDateTime(value?: string | null) {
    if (!value) return '';
    const [datePart, timePart] = value.split('T');
    if (!datePart || !timePart) return value;
    const [year, month, day] = datePart.split('-');
    if (!year || !month || !day) return value;
    const hhmm = timePart.slice(0, 5);
    return `${day}/${month}/${year} ${hhmm}`;
  }

  private normalizeDateTimeLocal(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return trimmed;
    if (trimmed.includes('T')) {
      return trimmed.length === 16 ? `${trimmed}:00` : trimmed;
    }
    const match = trimmed.match(
      /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/
    );
    if (!match) return trimmed;
    const [, day, month, year, hours, minutes, seconds] = match;
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds ?? '00'}`;
  }

  private isValidDateTimeLocal(value: string) {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value);
  }
}

interface ConfirmDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content class="confirm-body">
      <mat-icon color="warn">warning</mat-icon>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Cancelar</button>
      <button mat-flat-button color="warn" (click)="dialogRef.close(true)">Excluir</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .confirm-body {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 280px;
      }
      p {
        margin: 0;
      }
    `
  ]
})
class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {}
}
