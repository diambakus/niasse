import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { Unit } from './unit';
import { ColDef } from 'ag-grid-community';
import { ActionCellComponent } from '../../commons/action-cell/action-cell.component';
import { UnitService } from './unit.service';
import { UnitData } from '../../commons/shared/unit';
import { GridOptionsService } from '../../commons/shared/grid-options.service';

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
      field: "viewDetails",
      cellRenderer: ActionCellComponent,
      cellRendererParams: {
        entityType: 'unit'
      }
    },
  ];

  constructor(
    private unitService: UnitService,
    public translate: TranslateService,
    private gridOptionsService: GridOptionsService
  ) { }

  ngOnInit(): void {
    this.unitService.getUnits().subscribe(result => {
      this.rowData = this.toUnitsData(result);
    });
  }

  toUnitsData(units: Unit[]): UnitData[] {
    return [];
  }
}
