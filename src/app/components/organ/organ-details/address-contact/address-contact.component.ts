import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-address-contact',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule
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

  constructor() { }

  ngOnInit(): void {
    this.addressForm = this.addressFb.group({
      street: [null, Validators.required],
      addressNumber: [],
      city: [null, Validators.required],
      postalCode: [
        null
      ]
    });

    this.contactForm = this.contactFb.group({
      email: ['', Validators.required],
      phone: ['', Validators.required],
      contactType: [''],
      name: ['', Validators.required]
    });
  }

  onSubmit() {
  }

  saveAddress() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched
      return;
    }

    this.addressForm.value
  }

  saveContact() {

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched
      return;
    }

    this.contactForm.value

  }


}
