import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../auth/auth.service';
import { CartService } from '../../commons/shared/cart.service';


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
    MatSidenavModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() titleInBar?: string;
  applicationsInTheCart: number = 0;
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

  ngOnInit() {
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
