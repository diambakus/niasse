import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EMPTY_UNIT } from '../../commons/shared/unit';
import { OrganDialogComponent } from './organ-dialog/organ-dialog.component';
import { UnitDialogComponent } from './unit-dialog/unit-dialog.component';
import { EMPTY_SERVIS } from '../../commons/shared/servis';
import { ServisDialogComponent } from './servis-dialog/servis-dialog.component';
import { Application, ApplicationStatus } from '../../commons/shared/application';
import { ApplicationViewComponent } from './application-view/application-view.component';
import { Organ } from '../organ/organ';
import { OrganService } from '../organ/organ.service';
import { catchError, EMPTY, filter, firstValueFrom, switchMap } from 'rxjs';
import { UnitService } from '../units/unit.service';
import { Unit } from '../units/unit';
import { ServisService } from '../servis/servis.service';
import { Servis } from '../servis/servis';


@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatListModule,
    TranslateModule,
    MatTooltip,
    ApplicationViewComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  applications: Application[] = [];
  readonly dialog = inject(MatDialog);
  private organService = inject(OrganService);
  private unitService = inject(UnitService);
  private servisService = inject(ServisService);
  public translate = inject(TranslateService);
  private router = inject(Router);


  constructor() { }

  ngOnInit(): void {
    this.applications = this.loadApplications();
  }

  // TODO
  loadApplications(): Application[] {
    return [
      { id: 1, assignedCode: 'DUIR', price: 10.25, requestDate: new Date(), title: 'Title B' },
      { id: 2, assignedCode: 'WSAR', price: 6.50, requestDate: new Date(), title: 'Title A' },
      { id: 3, assignedCode: 'NIDH', price: 2.74, requestDate: new Date(), title: 'Title RDF' },
    ]
  }

  // TODO
  getApplicationStatusById(applicationId: number | undefined): string {
    return ApplicationStatus.PROCESSING.toString();
  }

  dialogCreateOrganization(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(OrganDialogComponent, {
      width: '30rem',
      enterAnimationDuration,
      exitAnimationDuration
    })
      .afterClosed()
      .pipe(
        filter((resultOrgan: Organ | undefined): resultOrgan is Organ => !!resultOrgan),
        switchMap(resultOrgan =>
          this.organService.addOrgan(resultOrgan).pipe(
            catchError(err => {
              console.error('Failed to save organization', err);
              return EMPTY;
            })
          )
        )
      )
      .subscribe(savedOrgan => {
        this.router.navigate(['/organs', savedOrgan.id]);
      });
  }


  dialogCreateUnit(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(UnitDialogComponent, {
      width: '50rem',
      enterAnimationDuration,
      exitAnimationDuration
    })
      .afterClosed()
      .pipe(
        filter((resultUnit: Unit | undefined): resultUnit is Unit => !!resultUnit),
        switchMap(resultUnit =>
          this.unitService.addUnitForOrgan(resultUnit).pipe(
            catchError(err => {
              console.error('Failed to save unit', err);
              return EMPTY;
            })
          )
        )
      )
      .subscribe(savedUnit => {
        this.router.navigate(['/units', savedUnit.id]);
      });
  }

  dialogCreateServis(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(ServisDialogComponent, {
      width: '50rem',
      enterAnimationDuration,
      exitAnimationDuration
    })
      .afterClosed()
      .pipe(
        filter((resultServis: Servis | undefined): resultServis is Servis => !!resultServis),
        switchMap(resultServis =>
          this.servisService.addServis(resultServis).pipe(
            catchError(err => {
              console.error('Failed to save servis', err);
              return EMPTY;
            })
          )
        )
      )
      .subscribe(savedServis => {
        this.router.navigate(['/services', savedServis.id]);
      })
  }
}
