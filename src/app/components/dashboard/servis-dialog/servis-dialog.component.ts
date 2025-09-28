import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { noSpecialChars } from '../../../commons/form-utils';
import { enumToArray } from '../../../commons/shared/converter-utils';
import { Servis, ServisType } from '../../servis/servis';
import { Unit } from '../../units/unit';
import { UnitService } from '../../units/unit.service';

@Component({
  selector: 'app-servis-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe
  ],
  templateUrl: './servis-dialog.component.html',
  styleUrl: './servis-dialog.component.scss'
})
export class ServisDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<ServisDialogComponent>);
  private data = inject(MAT_DIALOG_DATA) as Servis;
  servisForm!: FormGroup;
  units$!: Observable<Unit[]>;
  public translate = inject(TranslateService);
  private unitService = inject(UnitService);
  public servisTypes!: { key: string; value: ServisType }[];

  constructor(private formBuilder: FormBuilder) {
    this.servisForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), noSpecialChars]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      servisType: ['', [Validators.required]],
      price: [null, [Validators.required]],
      unitsDto: [null, []]
    });
  }

  ngOnInit(): void {
    this.units$ = this.unitService.getUnits();
    this.servisTypes = enumToArray<ServisType>(ServisType);
  }

  displayUnitName(unit?: Unit): string {
    return unit ? unit.name : '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.servisForm.invalid) {
      this.servisForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      ...this.data,
      ...this.servisForm.value
    } as Servis);
  }
}