import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Router, RouterLink } from '@angular/router';
import { EntityType } from './util-type';



@Component({
  selector: 'app-action-cell',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltip,
    RouterLink
  ],
  templateUrl: './action-cell.component.html',
  styleUrl: './action-cell.component.scss'
})
export class ActionCellComponent implements ICellRendererAngularComp {

  data: any;
  public reference!: number;
  private router = inject(Router);
  private entityType!: EntityType;

  agInit(params: ICellRendererParams & {entityType: EntityType}): void {
    this.data = params.data;
    this.reference = this.data?.id;
    this.entityType = params.entityType;
  }

  refresh(params: ICellRendererParams): boolean {
    this.reference = this.data?.id;
    return true;
  }

  onViewClick(): void {
    if (!this.reference) return;

    let routeBase = '';
    switch(this.entityType) {
      case 'organ':
        routeBase = 'organs';
        break;
      case 'unit':
        routeBase = 'units';
        break;
      case 'servis':
        routeBase = 'services';
        break;
      default:
        return;
    }

    this.router.navigate([`/${routeBase}`, this.reference]);
  }
}
