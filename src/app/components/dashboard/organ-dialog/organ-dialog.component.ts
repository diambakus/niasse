import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { noSpecialChars } from '../../../commons/form-utils';
import { Organ } from '../../organ/organ';

@Component({
  selector: 'app-organ-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './organ-dialog.component.html',
  styleUrl: './organ-dialog.component.scss',
})
export class OrganDialogComponent {
  readonly dialogRef = inject(MatDialogRef<OrganDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA) as Organ;
  organForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.organForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), noSpecialChars]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.organForm.invalid) {
      this.organForm.markAllAsTouched
      return;
    }

    this.dialogRef.close({
      ...this.data,
      ...this.organForm.value
    } as Organ);
  }
}