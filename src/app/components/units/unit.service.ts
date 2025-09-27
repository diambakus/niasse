import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, shareReplay, tap } from 'rxjs';
import { Unit } from './unit';
import { BaseService } from '../../commons/shared/service/base-service';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class UnitService extends BaseService {

  private readonly resourceUrl = `${environment.gatewayBaseUrl}/servitus/unit`
  private httpClient = inject(HttpClient);
  private unitsCache$?: Observable<Unit[]>;
  private unitCacheMap = new Map<number, Observable<Unit>>;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //'Authorization': `Bearer ${keycloak.token}`
    })
  };

  constructor() {
    super('UnitService');
  }

  getUnits(forceRefresh = false): Observable<Unit[]> {

    if (!this.unitsCache$ || forceRefresh) {
      this.unitsCache$ = this.httpClient.get<Unit[]>(this.resourceUrl).pipe(
        tap(() => this.log('Fetched units')),
        catchError(this.handleError<Unit[]>('getUnits', [])),
        shareReplay(1)
      );
    } else {
      this.log('Fetched units (from cache)');
    }
    return this.unitsCache$;
  }

  getUnitsByOrgan(organId: number, forceRefresh = false): Observable<Unit[]> {
    let params: HttpParams = new HttpParams();
    params.append("organId", organId);

    if (!this.unitsCache$ || forceRefresh) {
      this.unitsCache$ = this.httpClient.get<Unit[]>(this.resourceUrl, { params }).pipe(
        tap(data => {
          this.log(`Fetched units with organId=${organId}`)
        }),
        catchError(this.handleError<Unit[]>(`getUnitsByOrgan id=${organId}`)),
        shareReplay(1)
      );
    } else {
      this.log(`Fetched units by unit ${organId} (from cache)`);
    }

    return this.unitsCache$;
  }

  getUnit(id: number, forceRefresh = false): Observable<Unit> {
    if (forceRefresh || !this.unitCacheMap.has(id)) {
      const request$ = this.httpClient.get<Unit>(`${this.resourceUrl}/${id}`)
        .pipe(
          tap(_ => this.log(`Fetched unit id=${id}`)),
          catchError(this.handleError<Unit>(`getUnit id=${id}`)),
          shareReplay(1)
        );
      this.unitCacheMap.set(id, request$);
    } else {
      this.log(`Fetched unit id=${id} (from cache)`);
    }

    return this.unitCacheMap.get(id)!;
  }

  addUnitForOrgan(unit: Unit): Observable<Unit> {
    return this.httpClient.post<Unit>(this.resourceUrl, unit, this.httpOptions)
      .pipe(
        tap((unit: Unit) => {
          this.log(`added Unit w/ id=${unit.id}`);
          this.clearCache();
        }),
        catchError(this.handleError<Unit>('addUnit'))
      );
  }

  private clearCache(): void {
    this.unitsCache$ = undefined;
    this.unitCacheMap.clear();
    this.log('Cache cleared');
  }
}
