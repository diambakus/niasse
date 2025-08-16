import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ApplicationDialogComponent } from '../application-dialog/application-dialog.component';
import { Application } from '../../../commons/shared/application';
import { MatIconModule } from '@angular/material/icon';

const ELEMENT_DATA: Application[] = [
  { id: 1, title: 'Application I', assignedCode: 'XXI', price: 12, requestDate: new Date() },
  { id: 2, title: 'Application II', assignedCode: 'XXII', price: 1.2, requestDate: new Date() },
  { id: 1, title: 'Application III', assignedCode: 'XXIII', price: 0.12, requestDate: new Date() },
];

@Component({
  selector: 'app-application-view',
  imports: [
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './application-view.component.html',
  styleUrl: './application-view.component.scss'
})
export class ApplicationViewComponent {
  displayedColumns: string[] = ['title', 'assignedCode', 'view_details'];
  public dataSource = ELEMENT_DATA;
  clickedRows = new Set<Application>();
  readonly dialog = inject(MatDialog);

  dialogViewApplicationDetails(applicationId: number, enterAnimationDuration: string, exitAnimationDuration: string): void {
    let dialogRef = this.dialog.open(ApplicationDialogComponent, {
      data: applicationId,
      width: '40rem',
      enterAnimationDuration,
      exitAnimationDuration
    });

    dialogRef.afterClosed().subscribe(result => {
      console.debug(result);
    });
  }

}
