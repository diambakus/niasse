import { Provider } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

export function getPaginatorIntl(translate: TranslateService): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();

  const translateLabels = () => {
    paginatorIntl.itemsPerPageLabel = translate.instant('PAGINATOR.ITEMS_PER_PAGE');
    paginatorIntl.nextPageLabel = translate.instant('PAGINATOR.NEXT_PAGE');
    paginatorIntl.previousPageLabel = translate.instant('PAGINATOR.PREVIOUS_PAGE');
    paginatorIntl.firstPageLabel = translate.instant('PAGINATOR.FIRST_PAGE');
    paginatorIntl.lastPageLabel = translate.instant('PAGINATOR.LAST_PAGE');
    paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return translate.instant('PAGINATOR.RANGE_LABEL_ZERO', { length });
      }
      const startIndex = page * pageSize;
      const endIndex = Math.min(startIndex + pageSize, length);
      return translate.instant('PAGINATOR.RANGE_LABEL', {
        start: startIndex + 1,
        end: endIndex,
        length
      });
    };
  };

  translate.onLangChange.subscribe(() => {
    translateLabels();
    paginatorIntl.changes.next();
  });

  translateLabels();
  return paginatorIntl;
}

export const GetPaginatorIntlProvider: Provider =
{
  provide: MatPaginatorIntl,
  useFactory: getPaginatorIntl,
  deps: [TranslateService]
};
