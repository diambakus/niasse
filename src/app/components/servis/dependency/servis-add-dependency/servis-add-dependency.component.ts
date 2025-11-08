import { AsyncPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Dependency } from '../dependency';
import { firstValueFrom, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ServisService } from '../../servis.service';
import { DependencyService } from '../dependency.service';

@Component({
  selector: 'app-servis-add-dependency',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    AsyncPipe,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './servis-add-dependency.component.html',
  styleUrl: './servis-add-dependency.component.scss'
})
export class ServisAddDependencyComponent {
  @Input() servisId!: number;
  dependencies$!: Observable<Dependency[]>;
  public translate = inject(TranslateService);
  private servisService = inject(ServisService);
  private dependencyService = inject(DependencyService);
  dependenciesChosenIds = new FormControl();

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.dependencies$ = this.dependencyService.getDependenciesToAddByServisId(this.servisId);
  }

  cancel(): void {
    this.dependenciesChosenIds.reset();
    this.dependenciesChosenIds.markAsPristine();
    this.dependenciesChosenIds.markAsUntouched();
    this.dependenciesChosenIds.updateValueAndValidity();
  }

  async save() {
    if (this.dependenciesChosenIds.invalid) {
      this.dependenciesChosenIds.markAllAsTouched();
      return;
    }

    const chosenDependenciesId: number[]  = this.dependenciesChosenIds.getRawValue();
    try {
      this.servisService.addDependencies(this.servisId, chosenDependenciesId);
      // add snackbar
    } catch (error) {
      console.error('Failed to save servis!', error);
    }
  }
}
