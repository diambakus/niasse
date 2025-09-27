import { Component, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ServisService } from '../servis.service';
import { catchError, filter, map, of, shareReplay, switchMap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-view-servis',
  imports: [
    MatIconModule,
    MatCardModule,
    RouterModule,
    CommonModule,
    MatDividerModule,
    MatButtonModule,
    TranslateModule,
    MatProgressSpinnerModule,
    MatError,
    MatListModule
  ],
  templateUrl: './view-servis.component.html',
  styleUrl: './view-servis.component.scss'
})
export class ViewServisComponent {
  private route = inject(ActivatedRoute);
  public translate = inject(TranslateService);
  private snackBar = inject(MatSnackBar);
  private servisService = inject(ServisService);

  readonly servisId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter((id): id is string => !!id),
      map(id => Number(id))
    ),
    { initialValue: 0 }
  );


  readonly targetServis$ = toObservable(this.servisId).pipe(
    filter((id): id is number => id !== undefined),
    switchMap(id => this.servisService.get(id)),
    catchError(err => {
      console.error(err);
      return of(undefined);
    }),
    shareReplay(1)
  );

  // signals instead of mutable properties
  readonly errorMessage = signal('');

  constructor() { }
}
