import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Organ } from '../organ';
import { noSpecialChars } from '../../../commons/form-utils';

@Component({
  selector: 'app-create-organization',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './create-organization.component.html',
  styleUrl: './create-organization.component.scss'
})
export class CreateOrganizationComponent {
  organForm!: FormGroup;
  organ!: Organ;

  constructor(private formBuilder: FormBuilder) {
    this.organForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), noSpecialChars]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  save() {
    if (this.organForm.invalid) {
      this.organForm.markAllAsTouched
      return;
    }
  }
}
