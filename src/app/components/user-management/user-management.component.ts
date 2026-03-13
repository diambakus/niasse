import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import { OrganService } from '../organ/organ.service';
import { Unit } from '../units/unit';
import { UnitService } from '../units/unit.service';
import { UserProvisioningService } from './user-provisioning.service';
import { UserCreationDto } from './user-creation';


@Component({
  selector: 'app-user-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userProviosingService = inject(UserProvisioningService);
  private organService = inject(OrganService);
  private unitService = inject(UnitService);
  public translate = inject(TranslateService);
  selectedOrganizationId = signal<number | null>(null);
  organizations = toSignal(
    this.organService.getOrgans(),
    { initialValue: [] }
  );
  units = signal<Unit[]>([]);

  loading = signal(false);
  success = signal(false);

  roles = ['ADMIN', 'USER', 'MANAGER']; // Later load from backend

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    displayName: ['', Validators.required],
    rawPassword: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', Validators.required],
    unitsId: [[] as number[]]
  });

  ngOnInit(): void {
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);

    const userDto: UserCreationDto = this.form.getRawValue();

    this.userProviosingService.createUser(userDto).subscribe({
      next: () => {
        this.success.set(true);
        this.form.reset();

      },
      error: err => {
        console.error(err);
      },
      complete: () => this.loading.set(false)
    });
  }

  onOrganizationChange(orgId: number) {
    this.selectedOrganizationId.set(orgId);

    // reset selected units
    this.form.controls.unitsId.setValue([]);

    // fetch units for that organization
    this.unitService.getUnitsByOrgan(orgId).subscribe(units => {
      this.units.set(units);
    }
    )
  }

}
