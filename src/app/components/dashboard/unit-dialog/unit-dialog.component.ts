import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { noSpecialChars } from '../../../commons/form-utils';
import { Organ } from '../../organ/organ';
import { OrganService } from '../../organ/organ.service';
import { Unit } from '../../units/unit';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-unit-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatAutocompleteModule
  ],
  templateUrl: './unit-dialog.component.html',
  styleUrl: './unit-dialog.component.scss'
})

export class UnitDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<UnitDialogComponent>);
  private data = inject(MAT_DIALOG_DATA) as Unit;
  unitForm!: FormGroup;
  private organService = inject(OrganService);
  public translate = inject(TranslateService);
  organs$!: Observable<Organ[]>;

  constructor(private formBuilder: FormBuilder) {
    this.unitForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), noSpecialChars]],
      organDto: [null, [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.organs$ = this.organService.getOrgans();
  }

  displayOrganName(organ?: Organ): string {
    return organ ? organ.name: '';
  }

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
    } as Unit);
  }
}