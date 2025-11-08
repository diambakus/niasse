import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatError, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ServisAddDependencyComponent } from '../dependency/servis-add-dependency/servis-add-dependency.component';
import { ServisRemoveDependencyComponent } from '../dependency/servis-remove-dependency/servis-remove-dependency.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-servis-dependency',
  imports: [
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    RouterModule,
    CommonModule,
    MatButtonModule,
    TranslateModule,
    MatProgressSpinnerModule,
    MatError,
    MatListModule,
    ServisAddDependencyComponent,
    ServisRemoveDependencyComponent,
    MatSlideToggleModule,
    FormsModule
  ],
  templateUrl: './servis-dependency.component.html',
  styleUrl: './servis-dependency.component.scss'
})
export class ServisDependencyComponent {
  public addDependenciesVisible: boolean = false;
  public removeDependenciesVisible: boolean = false;
  private route = inject(ActivatedRoute);

  readonly servisId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter((id): id is string => !!id),
      map(id => Number(id))
    ),
    { initialValue: 0 }
  );

  onAddToggleChange(checked: boolean): void {
    this.addDependenciesVisible = checked;

    if (checked) {
      // turn the other one off
      this.removeDependenciesVisible = false;
    }
  }

  onRemoveToggleChange(checked: boolean): void {
    this.removeDependenciesVisible = checked;

    if (checked) {
      // turn the other one off
      this.addDependenciesVisible = false;
    }
  }
}
