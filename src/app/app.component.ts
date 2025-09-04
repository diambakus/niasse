import { MediaMatcher } from '@angular/cdk/layout';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { LangChangeEvent, TranslateModule, TranslateService } from "@ngx-translate/core";
import {
  AllCommunityModule,
  ModuleRegistry,
} from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { DrawerComponent } from './commons/drawer/drawer.component';
import { CartItem } from './commons/shared/common-topics';
import { TopbarComponent } from './components/topbar/topbar.component';
import { FooterComponent } from './components/footer/footer.component';

ModuleRegistry.registerModules([
    AllCommunityModule,
]);

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TopbarComponent,
    TranslateModule,
    DrawerComponent,
    MatSidenavModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title?: string = 'Niasse';
  globalContainer: WritableSignal<CartItem[]> = signal([]);

  private langChangeSubscription!: Subscription;
  private readonly TITLE_KEY = 'TITLE';
  protected readonly isMobile = signal(true);
  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;
  public isSideNavOpened: boolean = false;

  constructor(
    public auth: AuthService,
    private translate: TranslateService,
    private titleService: Title
  ) {
    const media = inject(MediaMatcher);

    this._mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () => this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.updatePageTitle();

    this.langChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updatePageTitle();
    });
  }

  private updatePageTitle(): void {
    this.translate.get(this.TITLE_KEY).subscribe((translatedTitle: string) => {
      this.titleService.setTitle(`${this.title} - ${translatedTitle}`);
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  public toggleMenu() {
    this.isSideNavOpened = !this.isSideNavOpened;
  }
}
