import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-application-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './application-dialog.component.html',
  styleUrl: './application-dialog.component.scss'
})
export class ApplicationDialogComponent {
  private dialogRef = inject(MatDialogRef<ApplicationDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA) as string;
  applicationForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  updateStatus() { }
}
