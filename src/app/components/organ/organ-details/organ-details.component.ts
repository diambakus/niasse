import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Unit } from '../../units/unit';
import { Organ } from '../organ';
import { OrganService } from '../organ.service';
import { AddressContactComponent } from './address-contact/address-contact.component';
import { AddressViewEditComponent } from './address-view-edit/address-view-edit.component';
import { ContactViewEditComponent } from './contact-view-edit/contact-view-edit.component';


const organs: Organ[] = [];


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
    TranslateModule,
    AddressContactComponent,
    AddressViewEditComponent,
    ContactViewEditComponent
  ],
  templateUrl: './organ-details.component.html',
  styleUrl: './organ-details.component.scss'
})
export class OrganDetailsComponent implements OnInit {

  units: Unit[] = [];
  selectedOrgan!: Organ;

  constructor(
    private organService: OrganService,
    private route: ActivatedRoute,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.organService.get(id).subscribe(
      {
        next: (organ: Organ) => {
          this.selectedOrgan = organ;
        }, error: (err: any) => {

        }
      }
    );
  }
}
