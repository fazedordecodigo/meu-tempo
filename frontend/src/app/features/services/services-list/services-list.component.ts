import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ServicesService } from '../../../core/services/services.service';
import { ServiceFormComponent } from '../service-form/service-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-services-list',
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
    MatSlideToggleModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslateModule,
    RouterModule
  ],
  template: `
    <div class="services-container">
      <div class="header">
        <h1>{{ 'SERVICES.TITLE' | translate }}</h1>
        <button mat-raised-button color="primary" (click)="openServiceForm()">
          <mat-icon>add</mat-icon>
          {{ 'SERVICES.NEW' | translate }}
        </button>
      </div>

      <div class="loading-shade" *ngIf="isLoading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div class="table-container mat-elevation-z2">
        <table mat-table [dataSource]="dataSource" matSort>
          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'SERVICES.NAME' | translate }}</th>
            <td mat-cell *matCellDef="let service">{{ service.name }}</td>
          </ng-container>

          <!-- Duration Column -->
          <ng-container matColumnDef="duration">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'SERVICES.DURATION' | translate }}</th>
            <td mat-cell *matCellDef="let service">{{ service.duration }} min</td>
          </ng-container>

          <!-- Price Column -->
          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'SERVICES.PRICE' | translate }}</th>
            <td mat-cell *matCellDef="let service">{{ service.price | currency:'BRL' }}</td>
          </ng-container>

          <!-- Active Column -->
          <ng-container matColumnDef="active">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'SERVICES.ACTIVE' | translate }}</th>
            <td mat-cell *matCellDef="let service">
              <mat-slide-toggle
                [checked]="service.active"
                (change)="toggleServiceStatus(service)"
                color="primary">
              </mat-slide-toggle>
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>{{ 'GENERAL.ACTIONS' | translate }}</th>
            <td mat-cell *matCellDef="let service">
              <button mat-icon-button [matMenuTriggerFor]="actionsMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #actionsMenu="matMenu">
                <button mat-menu-item (click)="editService(service)">
                  <mat-icon>edit</mat-icon>
                  <span>{{ 'GENERAL.EDIT' | translate }}</span>
                </button>
                <button mat-menu-item (click)="deleteService(service)">
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
            <td class="mat-cell" colspan="5">{{ 'SERVICES.NO_DATA' | translate }}</td>
          </tr>
        </table>

        <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .services-container {
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
    
    .table-container {
      overflow-x: auto;
      position: relative;
    }
    
    table {
      width: 100%;
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
export class ServicesListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'duration', 'price', 'active', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private servicesService: ServicesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadServices(): void {
    this.isLoading = true;
    this.servicesService.getServices()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data || response;
        },
        error: (error) => {
          console.error('Erro ao carregar serviços', error);
          this.snackBar.open(
            this.translate.instant('ERRORS.DEFAULT'), 
            this.translate.instant('GENERAL.CLOSE'), 
            { duration: 3000 }
          );
        }
      });
  }

  openServiceForm(service?: any): void {
    const dialogRef = this.dialog.open(ServiceFormComponent, {
      width: '500px',
      data: { service }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadServices();
      }
    });
  }

  editService(service: any): void {
    this.openServiceForm(service);
  }

  toggleServiceStatus(service: any): void {
    this.servicesService.toggleServiceStatus(service.id, service.active)
      .subscribe({
        next: () => {
          this.snackBar.open(
            this.translate.instant('SERVICES.STATUS_UPDATED'), 
            this.translate.instant('GENERAL.CLOSE'), 
            { duration: 3000 }
          );
        },
        error: (error) => {
          console.error('Erro ao alterar status do serviço', error);
          // Reverter a alteração na UI
          service.active = !service.active;
          this.snackBar.open(
            this.translate.instant('ERRORS.DEFAULT'), 
            this.translate.instant('GENERAL.CLOSE'), 
            { duration: 3000 }
          );
        }
      });
  }

  deleteService(service: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { 
        title: this.translate.instant('SERVICES.CONFIRM_DELETE_TITLE'),
        message: this.translate.instant('SERVICES.CONFIRM_DELETE'),
        confirmButtonText: this.translate.instant('GENERAL.DELETE'),
        cancelButtonText: this.translate.instant('GENERAL.CANCEL'),
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.servicesService.deleteService(service.id)
          .subscribe({
            next: () => {
              this.snackBar.open(
                this.translate.instant('SERVICES.DELETE_SUCCESS'), 
                this.translate.instant('GENERAL.CLOSE'), 
                { duration: 3000 }
              );
              this.loadServices();
            },
            error: (error) => {
              console.error('Erro ao excluir serviço', error);
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