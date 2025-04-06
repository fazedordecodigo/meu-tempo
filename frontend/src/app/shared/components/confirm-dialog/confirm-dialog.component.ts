import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>
        {{ data.cancelButtonText || 'Cancelar' }}
      </button>
      <button mat-raised-button [color]="data.color || 'primary'" [mat-dialog-close]="true">
        {{ data.confirmButtonText || 'Confirmar' }}
      </button>
    </div>
  `,
  styles: [`
    h2 {
      margin-top: 0;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      message: string;
      confirmButtonText?: string;
      cancelButtonText?: string;
      color?: 'primary' | 'accent' | 'warn';
    }
  ) {}
} 