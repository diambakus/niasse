import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EMPTY_ORGAN } from '../../commons/shared/organ';
import { EMPTY_UNIT } from '../../commons/shared/unit';
import { OrganDialogComponent } from './organ-dialog/organ-dialog.component';
import { UnitDialogComponent } from './unit-dialog/unit-dialog.component';
import { EMPTY_SERVIS } from '../../commons/shared/servis';
import { ServisDialogComponent } from './servis-dialog/servis-dialog.component';
import { Application, ApplicationStatus } from '../../commons/shared/application';
import { ApplicationViewComponent } from './application-view/application-view.component';


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

  constructor(
    public translate: TranslateService
  ) { }

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

  dialogCreateOrganization(enterAnimationDuration: string, exitAnimationDuration: string): void {
    let dialogRef = this.dialog.open(OrganDialogComponent, {
      data: EMPTY_ORGAN,
      width: '30rem',
      enterAnimationDuration,
      exitAnimationDuration
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.debug(JSON.stringify(result));
      }
    })
  }

  dialogCreateUnit(enterAnimationDuration: string, exitAnimationDuration: string): void {
    let dialogRef = this.dialog.open(UnitDialogComponent, {
      data: EMPTY_UNIT,
      width: '30rem',
      enterAnimationDuration,
      exitAnimationDuration
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.debug(JSON.stringify(result));
      }
    })
  }

  dialogCreateServis(enterAnimationDuration: string, exitAnimationDuration: string): void {
    let dialogRef = this.dialog.open(ServisDialogComponent, {
      data: EMPTY_SERVIS,
      width: '40rem',
      enterAnimationDuration,
      exitAnimationDuration
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.debug(JSON.stringify(result));
      }
    })
  }
}
