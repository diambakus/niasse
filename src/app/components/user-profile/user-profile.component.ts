import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../auth/auth.service';
import { UserProvisioningService } from '../user-management/user-provisioning.service';
import { UserProfileService } from './user-profile.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  private auth = inject(AuthService);
  private userProvisioningSvc = inject(UserProvisioningService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  isUpdating = signal(false);

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword')?.value;
    const confirm = control.get('confirmPassword')?.value;

    return password === confirm ? null : { passwordMismatch: true };
  }

  currentUser = this.auth.currentUser;
  loading = this.auth.currentUserLoading;
  error = this.auth.currentUserError;
  userId = this.auth.userId() ?? '';

  passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: [
      '',
      [
        Validators.required, Validators.pattern(
          /^(?=(?:.*[A-Z]){2,})(?=(?:.*[a-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[\W_]){2,}).{12,}$/
        )
      ]
    ],
    confirmPassword: ['', Validators.required]
  },
    {
      validators: this.passwordMatchValidator
    }
  );

  constructor() { }

  updatePassword() {

    if (this.passwordForm.invalid) {
      return;
    }

    this.isUpdating.set(true);
    const { currentPassword, newPassword } =
      this.passwordForm.getRawValue();

    this.userProvisioningSvc
      .updatePassword(this.userId, { currentPassword, newPassword })
      .subscribe({

        next: () => {

          this.snackBar.open(
            'Password updated successfully',
            'Close',
            { duration: 4000 }
          );

          this.passwordForm.reset();
          this.isUpdating.set(false);
        },

        error: () => {
          this.snackBar.open(
            'Failed to update password',
            'Close',
            { duration: 4000 }
          );
          this.isUpdating.set(false);
        }
      });
  }

}
