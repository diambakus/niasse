import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, shareReplay, tap } from 'rxjs';
import { Servis } from './servis';
import { BaseService } from '../../commons/shared/service/base-service';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class ServisService extends BaseService {

  private readonly resourceUrl = `${environment.gatewayBaseUrl}/servitus/servis`
  private httpClient = inject(HttpClient);
  private servisCache$?: Observable<Servis[]>;
  private servisCacheMap = new Map<number, Observable<Servis>>;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor() {
    super('ServisService');
  }

  getAll(forceRefresh = false): Observable<Servis[]> {
    console.debug('...');
    if (!this.servisCache$ || forceRefresh) {
      this.servisCache$ = this.httpClient.get<Servis[]>(this.resourceUrl).pipe(
        tap(() => this.log('Fetched all services')),
        catchError(this.handleError<Servis[]>('getAll', [])),
        shareReplay(1)
      );
    } else {
      this.log('Fetched all servis (from cache)');
    }
    return this.servisCache$;
  }

  getByUnit(unitId: number, forceRefresh = false): Observable<Servis[]> {
    if (!this.servisCache$ || forceRefresh) {
      this.servisCache$ = this.httpClient.get<Servis[]>(`${this.resourceUrl}/${unitId}`).pipe(
        tap(() => this.log(`Fetched all services by unit(${unitId})`)),
        catchError(this.handleError<Servis[]>('getByUnit', [])),
        shareReplay(1)
      );
    } else {
      this.log('Fetched all servis (from cache)');
    }
    return this.servisCache$;
  }

  get(id: number, forceRefresh = false): Observable<Servis> {
    if (forceRefresh || !this.servisCacheMap.has(id)) {
      const request$ = this.httpClient.get<Servis>(`${this.resourceUrl}/${id}`)
        .pipe(
          tap(_ => this.log(`Fetched servis id=${id}`)),
          catchError(this.handleError<Servis>(`get id=${id}`)),
          shareReplay(1)
        );
      this.servisCacheMap.set(id, request$);
    } else {
      this.log(`Fetched servis id=${id} (from cache)`);
    }

    return this.servisCacheMap.get(id)!;
  }

  addServis(servis: Servis): Observable<Servis> {
    return this.httpClient.post<Servis>(this.resourceUrl, servis, this.httpOptions)
      .pipe(
        tap((servis: Servis) => {
          this.log(`added servis w/ id=${servis.id}`);
          this.clearCache();
        }),
        catchError(this.handleError<Servis>('addServis'))
      );
  }

  private clearCache(): void {
    this.servisCache$ = undefined;
    this.servisCacheMap.clear();
    this.log('Cache cleared');
  }
}
