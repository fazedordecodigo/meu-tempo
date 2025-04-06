import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule, MatChipOption, MatChipListbox } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AppointmentsService } from '../../../core/services/appointments.service';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatChipListbox,
    MatChipOption,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslateModule,
    RouterModule
  ],
  template: `
    <div class="appointments-container">
      <div class="header">
        <h1>{{ 'APPOINTMENTS.TITLE' | translate }}</h1>
        <button mat-raised-button color="primary" (click)="openAppointmentForm()">
          <mat-icon>add</mat-icon>
          {{ 'APPOINTMENTS.NEW' | translate }}
        </button>
      </div>

      <div class="filter-container">
        <mat-chip-listbox>
          <mat-chip-option
            (click)="filterByStatus('all')"
            [selected]="currentFilter === 'all'">
            {{ 'APPOINTMENTS.ALL' | translate }}
          </mat-chip-option>
          <mat-chip-option
            (click)="filterByStatus('confirmed')"
            [selected]="currentFilter === 'confirmed'">
            {{ 'APPOINTMENTS.CONFIRMED' | translate }}
          </mat-chip-option>
          <mat-chip-option
            (click)="filterByStatus('pending')"
            [selected]="currentFilter === 'pending'">
            {{ 'APPOINTMENTS.PENDING' | translate }}
          </mat-chip-option>
          <mat-chip-option
            (click)="filterByStatus('cancelled')"
            [selected]="currentFilter === 'cancelled'">
            {{ 'APPOINTMENTS.CANCELLED' | translate }}
          </mat-chip-option>
        </mat-chip-listbox>
      </div>

      <div class="loading-shade" *ngIf="isLoading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div class="table-container mat-elevation-z2">
        <table mat-table [dataSource]="dataSource" matSort>
          <!-- Date Column -->
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'APPOINTMENTS.DATE' | translate }}</th>
            <td mat-cell *matCellDef="let appointment">{{ appointment.date | date:'dd/MM/yyyy HH:mm' }}</td>
          </ng-container>

          <!-- Client Column -->
          <ng-container matColumnDef="client">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'APPOINTMENTS.CLIENT' | translate }}</th>
            <td mat-cell *matCellDef="let appointment">{{ appointment.clientName }}</td>
          </ng-container>

          <!-- Service Column -->
          <ng-container matColumnDef="service">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'APPOINTMENTS.SERVICE' | translate }}</th>
            <td mat-cell *matCellDef="let appointment">{{ appointment.serviceName }}</td>
          </ng-container>

          <!-- Duration Column -->
          <ng-container matColumnDef="duration">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'APPOINTMENTS.DURATION' | translate }}</th>
            <td mat-cell *matCellDef="let appointment">{{ appointment.duration }} min</td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'APPOINTMENTS.STATUS' | translate }}</th>
            <td mat-cell *matCellDef="let appointment">
              <span class="status-chip" [ngClass]="appointment.status">
                {{ 'STATUS.' + appointment.status.toUpperCase() | translate }}
              </span>
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>{{ 'GENERAL.ACTIONS' | translate }}</th>
            <td mat-cell *matCellDef="let appointment">
              <button mat-icon-button [matMenuTriggerFor]="actionsMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #actionsMenu="matMenu">
                <button mat-menu-item (click)="viewDetails(appointment)">
                  <mat-icon>visibility</mat-icon>
                  <span>{{ 'GENERAL.VIEW' | translate }}</span>
                </button>
                <button mat-menu-item (click)="editAppointment(appointment)">
                  <mat-icon>edit</mat-icon>
                  <span>{{ 'GENERAL.EDIT' | translate }}</span>
                </button>
                <button mat-menu-item (click)="cancelAppointment(appointment)" *ngIf="appointment.status !== 'cancelled'">
                  <mat-icon>cancel</mat-icon>
                  <span>{{ 'GENERAL.CANCEL' | translate }}</span>
                </button>
                <button mat-menu-item (click)="deleteAppointment(appointment)">
                  <mat-icon>delete</mat-icon>
                  <span>{{ 'GENERAL.DELETE' | translate }}</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

          <!-- Row shown when there is no matching data. -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="6">{{ 'APPOINTMENTS.NO_DATA' | translate }}</td>
          </tr>
        </table>

        <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .appointments-container {
      padding: 16px;
      position: relative;
      min-height: 200px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .filter-container {
      margin-bottom: 16px;
    }

    .table-container {
      overflow-x: auto;
      position: relative;
    }

    table {
      width: 100%;
    }

    .status-chip {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      text-transform: uppercase;
    }

    .confirmed {
      background-color: #e6f7ed;
      color: #0e6027;
    }

    .pending {
      background-color: #fff8e6;
      color: #805b10;
    }

    .cancelled {
      background-color: #fbe9e7;
      color: #c62828;
    }

    .loading-shade {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.15);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class AppointmentsListComponent implements OnInit {
  displayedColumns: string[] = ['date', 'client', 'service', 'duration', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  currentFilter = 'all';
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private appointmentsService: AppointmentsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.appointmentsService.getAppointments()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data || response;
          this.applyFilter();
        },
        error: (error) => {
          console.error('Erro ao carregar agendamentos', error);
          this.snackBar.open(
            this.translate.instant('ERRORS.DEFAULT'),
            this.translate.instant('GENERAL.CLOSE'),
            { duration: 3000 }
          );
        }
      });
  }

  openAppointmentForm(appointment?: any): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '600px',
      data: { appointment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAppointments();
      }
    });
  }

  filterByStatus(status: string): void {
    this.currentFilter = status;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.currentFilter === 'all') {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return data.status === filter;
      };
      this.dataSource.filter = this.currentFilter;
    }
  }

  viewDetails(appointment: any): void {
    this.dialog.open(AppointmentFormComponent, {
      width: '600px',
      data: {
        appointment,
        readOnly: true
      }
    });
  }

  editAppointment(appointment: any): void {
    this.openAppointmentForm(appointment);
  }

  cancelAppointment(appointment: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('APPOINTMENTS.CONFIRM_CANCEL_TITLE'),
        message: this.translate.instant('APPOINTMENTS.CONFIRM_CANCEL'),
        confirmButtonText: this.translate.instant('GENERAL.CANCEL'),
        cancelButtonText: this.translate.instant('GENERAL.BACK'),
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentsService.cancelAppointment(appointment.id)
          .subscribe({
            next: () => {
              this.snackBar.open(
                this.translate.instant('APPOINTMENTS.CANCEL_SUCCESS'),
                this.translate.instant('GENERAL.CLOSE'),
                { duration: 3000 }
              );
              this.loadAppointments();
            },
            error: (error) => {
              console.error('Erro ao cancelar agendamento', error);
              this.snackBar.open(
                this.translate.instant('ERRORS.DEFAULT'),
                this.translate.instant('GENERAL.CLOSE'),
                { duration: 3000 }
              );
            }
          });
      }
    });
  }

  deleteAppointment(appointment: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('APPOINTMENTS.CONFIRM_DELETE_TITLE'),
        message: this.translate.instant('APPOINTMENTS.CONFIRM_DELETE'),
        confirmButtonText: this.translate.instant('GENERAL.DELETE'),
        cancelButtonText: this.translate.instant('GENERAL.CANCEL'),
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentsService.deleteAppointment(appointment.id)
          .subscribe({
            next: () => {
              this.snackBar.open(
                this.translate.instant('APPOINTMENTS.DELETE_SUCCESS'),
                this.translate.instant('GENERAL.CLOSE'),
                { duration: 3000 }
              );
              this.loadAppointments();
            },
            error: (error) => {
              console.error('Erro ao excluir agendamento', error);
              this.snackBar.open(
                this.translate.instant('ERRORS.DEFAULT'),
                this.translate.instant('GENERAL.CLOSE'),
                { duration: 3000 }
              );
            }
          });
      }
    });
  }
}
