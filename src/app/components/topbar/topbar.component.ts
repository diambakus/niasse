import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { CartService } from '../../commons/shared/cart.service';
import { AuthService } from '../../auth/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { KeycloakProfile } from 'keycloak-js';
import { MatSidenavModule } from '@angular/material/sidenav';


@Component({
  selector: 'app-topbar',
  imports: [
    MatToolbarModule,
    MatMenuModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
    MatBadgeModule,
    MatTooltipModule,
    TranslateModule,
    MatSidenavModule
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() titleInBar?: string;
  applicationsInTheCart: number = 0;
  email?: string;
  @Output() toggleDrawerEvent = new EventEmitter<void>();

  constructor(
    private cartService: CartService,
    public auth: AuthService,
    public translate: TranslateService
  ) { }

  hasRequestApplication(): boolean {
    this.cartService.shoppingCart$.subscribe(items => {
      this.applicationsInTheCart = items.reduce((acc, item) => acc + item.quantity, 0)
    })

    return this.applicationsInTheCart !== 0;
  }

  async ngOnInit() {
    if (this.auth.isAuthenticated()) {
      const profile: KeycloakProfile | null = await this.auth.getUserProfile();
      this.email = profile?.email;
    }
    console.debug(`Numbers of items in the cart: ${this.applicationsInTheCart}`)
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
  }

  setApplicationsNumber() {
    console.debug(`Numbers of items in the cart: ${this.applicationsInTheCart}`)
  }

  useLanguage(language: string): void {
    console.log('TopbarComponent: Mudando idioma para:', language);
    this.translate.use(language).subscribe({
      next: () => {
        console.log(`Idioma "${language}" carregado com sucesso pelo TopbarComponent.`);
        localStorage.setItem('preferredLang', language);
      },
      error: err => console.error(`Erro ao carregar idioma "${language}" no TopbarComponent:`, err)
    });
  }

  toggleDrawer() {
    this.toggleDrawerEvent.emit();
  }
}
