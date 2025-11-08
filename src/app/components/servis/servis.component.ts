import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { Servis, ServisType } from './servis';
import { ColDef } from 'ag-grid-community';
import { ActionCellComponent } from '../../commons/action-cell/action-cell.component';
import { ServisService } from './servis.service';
import { GridOptionsService } from '../../commons/shared/grid-options.service';
import { Observable } from 'rxjs';


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
    MatButtonModule,
  ],
  templateUrl: './servis.component.html',
  styleUrl: './servis.component.scss'
})
export class ServisComponent implements OnInit {
  public rowData!: Servis[];
  private servisService = inject(ServisService);
  public translate = inject(TranslateService);
  private gridOptionsService = inject(GridOptionsService);
  servis$!: Observable<Servis[]>;
  gridOptions = this.gridOptionsService.defaultGridOptions;
  servisTypes = Object.values(ServisType).filter(v => typeof v === 'number') as ServisType[];

  colDefs: ColDef[] = [
    {
      field: "id",
      headerName: "Number"
    },
    {
      field: "name",
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

  constructor() { }

  ngOnInit(): void {
    this.servisService.getAll().subscribe(result => {
      this.rowData = result;
    });
  }
}