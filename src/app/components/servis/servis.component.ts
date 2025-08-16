import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { Servis } from './servis';
import { ColDef } from 'ag-grid-community';
import { ActionCellComponent } from '../../commons/action-cell/action-cell.component';
import { ServisService } from './servis.service';
import { GridOptionsService } from '../../commons/shared/grid-options.service';

@Component({
  selector: 'app-servis',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatIconModule,
    TranslateModule,
    MatTableModule,
    RouterModule,
    MatTooltipModule,
    AgGridAngular,
    MatButtonModule
  ],
  templateUrl: './servis.component.html',
  styleUrl: './servis.component.scss'
})
export class ServisComponent implements OnInit {
  public rowData!: Servis[];
  gridOptions = this.gridOptionsService.defaultGridOptions;

  colDefs: ColDef[] = [
    {
      field: "id",
      headerName: "Number"
    },
    {
      field: "title",
      headerName: "Name",
      flex: 3,
      filter: true,
      floatingFilter: true
    },
    {
      field: "price",
    },
    {
      field: "viewDetails",
      cellRenderer: ActionCellComponent,
      cellRendererParams: {
        entityType: 'servis'
      }
    },
  ];

  constructor(
    private servisService: ServisService,
    public translate: TranslateService,
    private gridOptionsService: GridOptionsService
  ) { }

  ngOnInit(): void {
    /*this.servisService.getAll().subscribe(result => {
      this.rowData = result;
    });*/
    this.rowData = [
      { id: 1, unitId: 1, title: "Cleaning service 1", price: 2.3, description: "ladi ladi da", steps: [] },
      { id: 2, unitId: 1, title: "Cleaning service 2", price: 4.1, description: "ladi ladi da", steps: [] },
      { id: 3, unitId: 1, title: "Cleaning service 3", price: 2.1, description: "ladi ladi da", steps: [] },
      { id: 4, unitId: 1, title: "Cleaning service 4", price: 3.5, description: "ladi ladi da...", steps: [] },
      { id: 5, unitId: 1, title: "Cleaning service 21", price: 7.1, description: "ladi ladi da", steps: [] },
      { id: 6, unitId: 1, title: "Cleaning service 34", price: 6.2, description: "ladi ladi da", steps: [] },
      { id: 7, unitId: 1, title: "Cleaning service 42", price: 3.33, description: "ladi ladi da...", steps: [] },
    ]
  }
}
