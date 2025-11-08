import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DependencyService } from '../dependency.service';
import { noSpecialChars } from '../../../../commons/form-utils';
import { Location } from '@angular/common';
import { Dependency } from '../dependency';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-dependency',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './create-dependency.component.html',
  styleUrl: './create-dependency.component.scss'
})
export class CreateDependencyComponent implements OnInit {

  dependencyForm!: FormGroup;
  private router = inject(Router);
  public translate = inject(TranslateService);
  private dependencyService = inject(DependencyService);
  private snackBar = inject(MatSnackBar);

  constructor(private formBuilder: FormBuilder) {
    this.dependencyForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(1), noSpecialChars]],
      position: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  cancel() {
    this.snackBar.open('Requirement registration canceled!', '', {duration: 3000});
    this.dependencyForm.reset();
    this.dependencyForm.markAsPristine();
    this.dependencyForm.markAsUntouched();
    this.dependencyForm.updateValueAndValidity();
  }

  async save() {
    if (this.dependencyForm.invalid) {
      this.dependencyForm.markAllAsTouched();
      return;
    }

    const dependency: Dependency = this.dependencyForm.getRawValue();
    try {
      const savedDependency = await firstValueFrom(this.dependencyService.addDependency(dependency));
      this.router.navigate(['services/dependencies']);
      this.snackBar.open('Requirement dependency has been succefully saved!', '', {duration: 3000});
    } catch (error) {
      this.snackBar.open('Failed to save Requirement denpendency!', '', {duration: 3000});
      console.error('Failed to save Dependency!', error);
    }
  }

}
