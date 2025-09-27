import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Organ } from '../organ';
import { noSpecialChars } from '../../../commons/form-utils';
import { OrganService } from '../organ.service';
import { Router } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { Location } from '@angular/common';

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
  organService = inject(OrganService);
  private router = inject(Router);
  private localtion = inject(Location)


  constructor(private formBuilder: FormBuilder) {
    this.organForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), noSpecialChars]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  async save() {
    if (this.organForm.invalid) {
      this.organForm.markAllAsTouched();
      return;
    }

    const organ: Organ = this.organForm.getRawValue();

    try {
      const savedOrgan = await firstValueFrom(this.organService.addOrgan(organ));
      this.router.navigate(['/organs', savedOrgan.id]);
    } catch (err) {
      console.error('Failed to save organization', err);
    }
  }

  cancel() {
    this.localtion.back();
  }
}
