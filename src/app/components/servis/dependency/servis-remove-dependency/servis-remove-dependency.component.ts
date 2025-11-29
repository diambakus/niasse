import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { Dependency } from '../dependency';
import { TranslateService } from '@ngx-translate/core';
import { ServisService } from '../../servis.service';
import { AsyncPipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-servis-remove-dependency',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    AsyncPipe,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './servis-remove-dependency.component.html',
  styleUrl: './servis-remove-dependency.component.scss'
})
export class ServisRemoveDependencyComponent {
  @Input() servisId!: number;
  dependencies$!: Observable<Dependency[]>;
  public translate = inject(TranslateService);
  private servisService = inject(ServisService);
  dependenciesChosenIds = new FormControl();
  private snackBar = inject(MatSnackBar);

  constructor(private formBuilder: FormBuilder) {
  }

  async ngOnInit() {
    this.dependencies$ = this.servisService.getDependencies(this.servisId);
  }

  displayDependencyTitle(dependency?: Dependency): string {
    return dependency ? dependency.title : '';
  }

  cancel(): void {
  }

  async save() {
    /*if (this.servisForm.invalid) {
      this.servisForm.markAllAsTouched();
      return;
    }

    const servis: Servis = this.servisForm.getRawValue();
    try {
      const savedServis = await firstValueFrom(this.servisService.addServis(servis));
      snackBar.open('Chosen dependencies removed', '', {duration: 5000});
      this.router.navigate(['/services', savedServis.id]);
    } catch (error) {
      console.error('Failed to save servis!', error);
    }*/
  }
}
