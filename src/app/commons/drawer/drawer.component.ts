import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UI_BASE_URL } from '../endpoints/enpoints-dev';

@Component({
  selector: 'app-drawer',
  imports: [
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    TopbarComponent,
    DashboardComponent,
    RouterModule,
    MatTooltipModule,
  ],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss'
})
export class DrawerComponent implements OnInit {
  @Input() isOpened!: boolean;
  @Output() toggleMenu = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public routeLinks = [
    { id: 1, link: `/services`, name: "Services", icon: "assignment" },
    { id: 2, link: `/units`, name: "Units", icon: "home" },
    { id: 3, link: `/organs`, name: "Organizations", icon: "home_work" },
    { id: 4, link: '#', name: "Audit", icon: "content_paste_search"}
  ];
}