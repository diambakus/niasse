import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UnitData } from '../../../commons/shared/unit';
import { noSpecialChars } from '../../../commons/form-utils';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-unit-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './unit-dialog.component.html',
  styleUrl: './unit-dialog.component.scss'
})

export class UnitDialogComponent {
  private dialogRef = inject(MatDialogRef<UnitDialogComponent>);
  private data = inject(MAT_DIALOG_DATA) as UnitData;
  unitForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.unitForm = this.formBuilder.group({
      name: [this.data.name, [Validators.required, Validators.minLength(1), noSpecialChars]],
      organId: [this.data.organId, [Validators.required]],
      description: [this.data.description, [Validators.required, Validators.minLength(10)]]
    });
  }

  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];

  onCancel(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.unitForm.invalid) {
      this.unitForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      ...this.data,
      ...this.unitForm.value,
    } as UnitData);
  }
}
