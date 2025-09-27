import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { UnitService } from '../unit.service';
import { noSpecialChars } from '../../../commons/form-utils';
import { AsyncPipe, Location } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OrganService } from '../../organ/organ.service';
import { firstValueFrom, Observable } from 'rxjs';
import { Organ } from '../../organ/organ';
import { Unit } from '../unit';

@Component({
  selector: 'app-create-unit',
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
  templateUrl: './create-unit.component.html',
  styleUrl: './create-unit.component.scss'
})
export class CreateUnitComponent implements OnInit {

  unitForm!: FormGroup;
  private router = inject(Router);
  private localtion = inject(Location);
  private unitService = inject(UnitService);
  private organService = inject(OrganService);
  organs$!: Observable<Organ[]>;

  constructor(private formBuilder: FormBuilder) {
    this.unitForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), noSpecialChars]],
      organDto: [null, Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.organs$ = this.organService.getOrgans();
  }

  displayOrganName(organ?: Organ): string {
    return organ ? organ.name : '';
  }


  async save() {
    if (this.unitForm.invalid) {
      this.unitForm.markAllAsTouched();
      return;
    }

    const unit: Unit = this.unitForm.getRawValue();
    try {
      const savedUnit = await firstValueFrom(this.unitService.addUnitForOrgan(unit));
      this.router.navigate(['/units', savedUnit.id]);
    } catch (err) {
      console.error('Failed to save unit!', err);
    }
  }

  cancel() {
    this.localtion.back();
  }
}
