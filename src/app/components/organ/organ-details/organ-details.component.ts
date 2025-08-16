import { Component, OnInit } from '@angular/core';
import { Unit } from '../../units/unit';
import { UnitService } from '../../units/unit.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataKey, DataService } from '../../../commons/shared/data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Organ } from '../organ';


const organs: Organ[] = [
  {
    id: 1,
    name: 'Ministry of Health',
    description: 'Oversees national healthcare and hospital systems',
  },
  {
    id: 2,
    name: 'Ministry of Education',
    description: 'Manages public education, universities, and research programs',
  },
  {
    id: 3,
    name: 'Ministry of Agriculture',
    description: 'Responsible for farming policies, food security, and agricultural development',
  }
];


const units: Unit[] = [
  { id: 1, organId: 1, name: 'Public Health Department' },
  { id: 2, organId: 1, name: 'Hospital Administration Unit' },
  { id: 3, organId: 2, name: 'Primary Education Division' },
  { id: 4, organId: 2, name: 'Higher Education and Research Unit' },
  { id: 5, organId: 3, name: 'Crop Production Department' },
  { id: 6, organId: 3, name: 'Animal Husbandry Unit' },
  { id: 7, organId: 3, name: 'Agricultural Research Division' }
]


@Component({
  selector: 'app-organ-details',
  imports: [
    MatIconModule,
    MatCardModule,
    RouterModule,
    CommonModule,
    MatDividerModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './organ-details.component.html',
  styleUrl: './organ-details.component.scss'
})
export class OrganDetailsComponent implements OnInit {

  units: Unit[] = [];
  selectedOrgan: any;

  constructor(
    private unitService: UnitService,
    private route: ActivatedRoute,
    private dataService: DataService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getUnitByOrgan(id);

    this.dataService.getData(DataKey.activeOrgan)?.subscribe((data) => {
      this.selectedOrgan = data;
    });
  }

  getUnitByOrgan(organId: number): Unit[] {
    this.unitService.getUnitsByOrgan(organId).subscribe(
      {
        next: (units) => {
          this.units = units;
        },
        error: (error) => {
          console.log('Error fetching units', error);
        }
      }
    );

    return this.units;
  }

  setUnit(selectedUnit: Unit) {
    if (!selectedUnit.id) {
      return;
    }

    this.dataService.setData(DataKey.activeUnit, selectedUnit.name);
  }
}
