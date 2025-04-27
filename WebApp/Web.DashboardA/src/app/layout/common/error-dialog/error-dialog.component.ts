import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  imports: [MatIconModule],
})
export class ErrorDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string; }
  ) {}

  redirect(): void {
    this.dialogRef.close();
  }
}