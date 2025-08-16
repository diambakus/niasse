import { Injectable } from '@angular/core';
import { GridOptions } from 'ag-grid-community';

@Injectable({
  providedIn: 'root'
})
export class GridOptionsService {
  readonly defaultGridOptions: GridOptions = {
    defaultColDef: {
      flex: 1,
      resizable: true,
    },
    pagination: true,
    paginationPageSize: 5,
    paginationPageSizeSelector: [5, 10, 20],
    rowHeight: 31,
    headerHeight: 39,
    rowStyle: {
      fontSize: '0.75rem'
    }
  };
  constructor() { }
}