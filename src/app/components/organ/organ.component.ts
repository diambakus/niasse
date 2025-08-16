import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { type ColDef } from 'ag-grid-community';
import { ActionCellComponent } from '../../commons/action-cell/action-cell.component';
import { DataKey, DataService } from '../../commons/shared/data.service';
import { Organ } from './organ';
import { OrganService } from './organ.service';
import { GridOptionsService } from '../../commons/shared/grid-options.service';



@Component({
  selector: 'app-organ',
  imports: [
    RouterModule,
    MatCardModule,
    MatIconModule,
    TranslateModule,
    MatTableModule,
    MatTooltipModule,
    AgGridAngular,
    MatButtonModule
  ],
  templateUrl: './organ.component.html',
  styleUrl: './organ.component.scss'
})
export class OrganComponent implements OnInit {

  organs: Organ[] = [];
  public rowData!: Organ[];
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
      floatingFilter: true,
    },
    {
      field: "viewDetails",
      cellRenderer: ActionCellComponent,
      cellRendererParams: {
        entityType: 'organ'
      }
    },
  ];

  constructor(
    private organService: OrganService,
    private dataService: DataService,
    public translate: TranslateService,
    private gridOptionsService: GridOptionsService
  ) { }

  ngOnInit(): void {
    this.rowData = this.getOrgans();
  }

  getOrgans(): Organ[] {
    this.organService.getOrgans().subscribe(
      organs => this.organs = organs
    );

    return this.organs;
  }

  setOrgan(selectedOrgan: Organ) {
    if (!selectedOrgan.id) {
      return;
    }

    this.dataService.setData(DataKey.activeOrgan, selectedOrgan.name);
  }
}
