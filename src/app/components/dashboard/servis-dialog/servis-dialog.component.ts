import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ServisData } from '../../../commons/shared/servis';
import { noSpecialChars } from '../../../commons/form-utils';
import { UnitSimplifiedView } from '../../../commons/shared/unit';

@Component({
  selector: 'app-servis-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './servis-dialog.component.html',
  styleUrl: './servis-dialog.component.scss'
})
export class ServisDialogComponent {
  private dialogRef = inject(MatDialogRef<ServisDialogComponent>);
  private data = inject(MAT_DIALOG_DATA) as ServisData;
  servisForm!: FormGroup;
  simplifiedUnits!:  UnitSimplifiedView[];

  constructor(private formBuilder: FormBuilder) {
    this.servisForm = this.formBuilder.group({
      name: [this.data.name, [Validators.required, Validators.minLength(1), noSpecialChars]],
      description: [this.data.description, [Validators.required, Validators.minLength(10)]],
      price: [this.data.price, [Validators.required, Validators.pattern(/^\s?\d{1,3}(?:\.\d{3})*(?:,\d{2})?\s?$/gm)]],
      units: [this.data.units, [Validators.required]]
    });
    this.simplifiedUnits = this.provideSimplifiedUnits();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  save() {
    if(this.servisForm.invalid) {
      this.servisForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      ...this.data,
      ...this.servisForm.value
    } as ServisData);
  }

  provideSimplifiedUnits(): UnitSimplifiedView[] {
    return [
      {id: 1, name: 'Unit A'},
      {id: 2, name: 'Unit B'},
      {id: 3, name: 'Unit M'},
      {id: 4, name: 'Unit J'},
      {id: 5, name: 'Unit P'}
    ]
  }
}
