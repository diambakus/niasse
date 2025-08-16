import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataKey, DataService } from '../../../commons/shared/data.service';

@Component({
    selector: 'app-unit-details',
    imports: [
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        RouterModule,
        MatTooltipModule,
    ],
    templateUrl: './unit-details.component.html',
    styleUrl: './unit-details.component.scss'
})
export class UnitDetailsComponent implements OnInit {

  selectedUnit!: string;
  selectedOrgan!: string;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.dataService.getData(DataKey.activeOrgan)?.subscribe((data) => {
      this.selectedOrgan = data;
    });
    this.dataService.getData(DataKey.activeUnit)?.subscribe((data) => {
      this.selectedUnit = data;
    });

    const unitId = Number(this.route.snapshot.paramMap.get('id'))
  }
}
