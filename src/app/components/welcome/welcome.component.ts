import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-welcome',
    imports: [
        TranslateModule
    ],
    templateUrl: './welcome.component.html',
    styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  
  constructor(public translate: TranslateService) {
  }

}
