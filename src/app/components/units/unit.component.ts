import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { ActionCellComponent } from '../../commons/action-cell/action-cell.component';
import { GridOptionsService } from '../../commons/shared/grid-options.service';
import { UnitData } from '../../commons/shared/unit';
import { Unit } from './unit';
import { UnitService } from './unit.service';

@Component({
  selector: 'app-units',
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
  templateUrl: './unit.component.html',
  styleUrl: './unit.component.scss'
})
export class UnitComponent implements OnInit {
  public rowData!: UnitData[];
  private unitService = inject(UnitService);
  public translate = inject(TranslateService);
  private gridOptionsService = inject(GridOptionsService);
  gridOptions = this.gridOptionsService.defaultGridOptions;

  colDefs: ColDef[] = [
    {
      field: "id",
      headerName: "Number"
    },
    {
      field: "name",
      flex: 3,
      filter: true,
      floatingFilter: true
    },
    {
      headerName: "Organisation",
      valueGetter: params => params.data?.organDto?.name,
      flex: 2
    },
    {
      field: "viewDetails",
      cellRenderer: ActionCellComponent,
      cellRendererParams: {
        entityType: 'unit'
      }
    },
  ];

  constructor() { }

  ngOnInit(): void {
    this.unitService.getUnits().subscribe(result => {
      this.rowData = result;
    });
  }
}
