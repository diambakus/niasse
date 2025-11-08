import { AsyncPipe, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import { ServisService } from '../servis.service';
import { Router } from '@angular/router';
import { Unit } from '../../units/unit';
import { noSpecialChars } from '../../../commons/form-utils';
import { firstValueFrom, Observable } from 'rxjs';
import { UnitService } from '../../units/unit.service';
import { Servis, ServisType } from '../servis';
import { enumToArray } from '../../../commons/shared/converter-utils';

@Component({
  selector: 'app-create-servis',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatAutocompleteModule,
    AsyncPipe
  ],
  templateUrl: './create-servis.component.html',
  styleUrl: './create-servis.component.scss'
})
export class CreateServisComponent implements OnInit {
  servisForm!: FormGroup;
  private router = inject(Router);
  units$!: Observable<Unit[]>;
  public translate = inject(TranslateService);
  private servisService = inject(ServisService);
  private location = inject(Location);
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

  cancel() {
    this.location.back();
  }

  async save() {
    if (this.servisForm.invalid) {
      this.servisForm.markAllAsTouched();
      return;
    }

    const servis: Servis = this.servisForm.getRawValue();
    try {
      const savedServis = await firstValueFrom(this.servisService.addServis(servis));
      this.router.navigate(['/services', savedServis.id]);
    } catch (error) {
      console.error('Failed to save servis!', error);
    }
  }

}
