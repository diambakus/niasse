import { Component, inject, OnInit } from '@angular/core';
import { CreateDependencyComponent } from './create-dependency/create-dependency.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, Location } from '@angular/common';
import { DependencyService } from './dependency.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridAngular } from 'ag-grid-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ColDef } from 'ag-grid-community';
//import { ActionCellComponent } from '../../commons/action-cell/action-cell.component';
import { Observable } from 'rxjs';
import { Dependency } from './dependency';
import { GridOptionsService } from '../../../commons/shared/grid-options.service';


@Component({
  selector: 'app-dependency',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    AsyncPipe,
    CreateDependencyComponent,
    MatTooltipModule,
    AgGridAngular,
  ],
  templateUrl: './dependency.component.html',
  styleUrl: './dependency.component.scss'
})
export class DependencyComponent implements OnInit {
  private dependencyService = inject(DependencyService);
  private location = inject(Location);
  public rowData!: Dependency[];
  public translate = inject(TranslateService);
  private gridOptionsService = inject(GridOptionsService);
  servis$!: Observable<Dependency[]>;
  gridOptions = this.gridOptionsService.defaultGridOptions;

  colDefs: ColDef[] = [
    {
      field: "position",
      headerName: "Position in the stepper"
    },
    {
      field: "title",
      headerName: "Name",
      flex: 3,
      filter: true,
      floatingFilter: true
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.dependencyService.getAll().subscribe(result => {
      this.rowData = result;
    });
  }
}
