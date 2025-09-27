import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ContactService } from '../../../../commons/shared/service/contact-service';
import { Address, Contact } from '../../../../commons/shared/common-topics';
import { AddressService } from '../../../../commons/shared/service/address-service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CountryService } from '../../../../commons/shared/service/CountryService';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-address-contact',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './address-contact.component.html',
  styleUrls: ['./address-contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressContactComponent implements OnInit {
  addressForm!: FormGroup;
  contactForm!: FormGroup;
  private addressFb = inject(FormBuilder);
  private contactFb = inject(FormBuilder);
  private contactService = inject(ContactService);
  private addressService = inject(AddressService);
  private countryService = inject(CountryService);
  newContact: Contact | null = null;
  newAddress: Address | null = null;
  public countriesByLang$!: Observable<string[]>;

  @Input() set organId(id: number) {
    this._organId.set(id);
  }
  @Output() contactCreated = new EventEmitter<Contact>();
  @Output() addressCreated = new EventEmitter<Address>();

  private _organId = signal<number | null>(null);

  constructor() { }

  ngOnInit(): void {
    this.contactForm = this.contactFb.group({
      email: ['', Validators.required],
      phone: ['', Validators.required],
      contactType: [''],
      name: ['', Validators.required]
    });

    this.addressForm = this.addressFb.group({
      street: [''],
      addressNumber: [''],
      city: [''],
      postalCode: [''],
      state: [''],
      addressType: [''],
      country: [''] // this is the formControl used in autocomplete
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

  onContactCreated(contact: Contact) {
    this.newContact = contact;
  }

  onAddressCreate(address: Address) {
    this.newAddress = address;
  }

  @ViewChild('addressPanel') addressPanel!: MatExpansionPanel;
  @ViewChild('contactPanel') contactPanel!: MatExpansionPanel;

  saveAddress() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched
      return;
    }

    const id = this._organId();
    if (id === null) return;

    const newAddress: Address = this.addressForm.getRawValue();

    this.addressService.createAddressForEntity(id, 'organ', [newAddress]).subscribe({
      next: (savedAddress) => {
        this.addressForm.reset();
        this.addressCreated.emit(savedAddress[0]);
      },
      error: (err) => console.debug('Failed to save address', err)
    });

    this.addressPanel.close();
  }

  saveContact(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const id = this._organId();
    if (id === null) return;

    const newContact: Contact = this.contactForm.getRawValue();

    this.contactService.createContactsForEntity(id, 'organ', [newContact]).subscribe({
      next: (savedContact) => {
        this.contactForm.reset();
        this.contactCreated.emit(savedContact[0]);
      },
      error: (err) => console.debug('Failed to save contact', err)
    });
    this.contactPanel.close();
  }

  cancel(addressOrContact: string): void {
    switch (addressOrContact) {
      case 'address': {
        this.addressForm.reset();
        this.addressPanel.close();
        break;
      }
      case 'contact': {
        this.contactForm.reset();
        this.contactPanel.close();
        break;
      }
      default: {
        console.debug('Nothing to cancel!');
        break;
      }
    }
  }
}
