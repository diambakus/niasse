import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Address } from '../../../../../commons/shared/common-topics';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { CountryService } from '../../../../../commons/shared/service/CountryService';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@Component({
  selector: 'app-address-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    AsyncPipe,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  templateUrl: './address-dialog.component.html',
  styleUrl: './address-dialog.component.scss'
})
export class AddressDialogComponent implements OnInit {
  addressForm!: FormGroup;
  countriesByLang$!: Observable<string[]>;

  private originalAddress: Address;

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private dialogRef: MatDialogRef<AddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { address: Address }
  ) {
    this.originalAddress = { ...data.address };
  }

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      street: [this.originalAddress.street || ''],
      addressNumber: [this.originalAddress.addressNumber || ''],
      city: [this.originalAddress.city || ''],
      state: [this.originalAddress.state || ''],
      postalCode: [this.originalAddress.postalCode || ''],
      addressType: [this.originalAddress.addressType || ''],
      country: [this.originalAddress.country || '']
    });

    const allCountries$ = this.countryService.getCountries('en');

    this.countriesByLang$ = combineLatest([
      this.addressForm.get('country')!.valueChanges.pipe(startWith('')),
      allCountries$
    ]).pipe(
      map(([input, countries]) => {
        const filterValue = (input || '').toLowerCase();
        return countries.filter(c =>
          c.toLowerCase().includes(filterValue)
        );
      })
    );
  }

  save(): void {
    if (this.addressForm.valid) {
      const updated: Address = {
        ...this.originalAddress,
        ...this.addressForm.value
      };

      const changes: Record<string, any> = {};
      (Object.keys(updated) as (keyof Address)[]).forEach((key) => {
        if (updated[key] !== this.originalAddress[key]) {
          changes[key as string] = updated[key];
        }
      });

      this.dialogRef.close(changes);
    }
  }
  
}
