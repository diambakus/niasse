import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment.dev';
import { Organ } from './organ';
import { BaseService } from '../../commons/shared/service/base-service';

@Injectable({
  providedIn: 'root',
})
export class OrganService extends BaseService {
  private readonly resourceUrl = `${environment.gatewayBaseUrl}/servitus/organ`;
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  private organsCache$?: Observable<Organ[]>;
  private organCache = new Map<number, Observable<Organ>>();

  constructor(private http: HttpClient) {
    super('OrganService');
  }

  getOrgans(forceRefresh = false): Observable<Organ[]> {
    if (!this.organsCache$ || forceRefresh) {
      this.organsCache$ = this.http.get<Organ[]>(this.resourceUrl).pipe(
        tap(() => this.log('Fetched organisations')),
        catchError(this.handleError<Organ[]>('getOrgans', [])),
        shareReplay(1)
      );
    } else {
      this.log('Fetched organisations (from cache)');
    }
    return this.organsCache$;
  }

  get(id: number, forceRefresh = false): Observable<Organ> {
    if (!this.organCache.has(id) || forceRefresh) {
      const request$ = this.http.get<Organ>(`${this.resourceUrl}/${id}`).pipe(
        tap(() => this.log(`Fetched organisation id=${id}`)),
        catchError(this.handleError<Organ>('getOrgan')),
        shareReplay(1)
      );
      this.organCache.set(id, request$);
    } else {
      this.log(`Fetched organisation id=${id} (from cache)`);
    }
    return this.organCache.get(id)!;
  }

  addOrgan(organ: Organ): Observable<Organ> {
    return this.http.post<Organ>(this.resourceUrl, organ, this.httpOptions).pipe(
      tap((freshOrgan) => {
        this.log(`Added organisation w/ id=${freshOrgan.id}`);
        this.clearCache();
      }),
      catchError(this.handleError<Organ>('addOrgan'))
    );
  }

  private clearCache(): void {
    this.organsCache$ = undefined;
    this.organCache.clear();
    this.log('Cache cleared');
  }
}
