import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ServisType, ServisTypeTranslation } from './servis';

@Pipe({
  name: 'servisTypeTranslate',
  standalone: true
})
export class ServisTypeTranslatePipe implements PipeTransform {
  private translate = inject(TranslateService);
  constructor() {}

  transform(value: ServisType): string {
    const key = ServisTypeTranslation[value];
    return this.translate.instant(key);
  }
}
