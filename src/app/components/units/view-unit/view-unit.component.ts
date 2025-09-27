import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, filter, map, of, shareReplay, switchMap } from 'rxjs';
import { UnitService } from '../unit.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
import { AddressContactComponent } from './address-contact/address-contact.component';
import { AddressViewEditComponent } from './address-view-edit/address-view-edit.component';
import { ContactViewEditComponent } from './contact-view-edit/contact-view-edit.component';
import { Address, Contact } from '../../../commons/shared/common-topics';

@Component({
  selector: 'app-view-unit',
  imports: [
    MatIconModule,
    MatCardModule,
    RouterModule,
    CommonModule,
    MatDividerModule,
    MatButtonModule,
    TranslateModule,
    AddressContactComponent,
    AddressViewEditComponent,
    ContactViewEditComponent,
    MatProgressSpinnerModule,
    MatError
  ],
  templateUrl: './view-unit.component.html',
  styleUrl: './view-unit.component.scss'
})
export class ViewUnitComponent {
  private unitService = inject(UnitService);
  private route = inject(ActivatedRoute);
  public translate = inject(TranslateService);
  newContact: Contact | null = null;
  newAddress: Address | null = null;
  private snackBar = inject(MatSnackBar);

  readonly unitId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter((id): id is string => !!id),
      map(id => Number(id))
    ),
    { initialValue: 0 }
  );


  readonly targetUnit$ = toObservable(this.unitId).pipe(
    filter((id): id is number => id !== undefined),
    switchMap(id => this.unitService.getUnit(id)),
    catchError(err => {
      console.error(err);
      return of(undefined);
    }),
    shareReplay(1)
  );

  // signals instead of mutable properties
  readonly errorMessage = signal('');

  constructor() { }

  onContactCreated(contactEvent: Contact) {
    this.newContact = contactEvent;

    this.snackBar.open('Contact created successfully!', 'Close', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['snackbar-success']
    });
  }

  onAddressCreated(addressEvent: Address) {
    this.newAddress = addressEvent;
    this.snackBar.open('Address created successfully!', 'Close', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['snackbar-success']
    });
  }
}
