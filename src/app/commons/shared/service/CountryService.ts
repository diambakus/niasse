import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { COUNTRIES } from '../country';


@Injectable({ providedIn: 'root' })
export class CountryService {
    getCountries(lang: 'pt' | 'es' | 'en' | 'fr'): Observable<string[]> {
        return of(COUNTRIES.map(c => c[lang]));
    }
}
