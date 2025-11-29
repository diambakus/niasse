import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment.dev';
import { BaseService } from '../../commons/shared/service/base-service';
import { Dependency } from './dependency/dependency';
import { Servis } from './servis';

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

  private servisListCache = new Map<string, Observable<Servis[]>>();

  getAll(forceRefresh = false): Observable<Servis[]> {
    const url = this.resourceUrl;
    if (forceRefresh || !this.servisListCache.has(url)) {
      const request$ = this.httpClient.get<Servis[]>(url).pipe(
        tap(() => this.log('Fetched all services')),
        catchError(this.handleError<Servis[]>('getAll', [])),
        shareReplay({ bufferSize: 1, refCount: true })
      );
      this.servisListCache.set(url, request$);
    }
    return this.servisListCache.get(url)!;
  }

  getByUnit(unitId: number, forceRefresh = false): Observable<Servis[]> {
    const url = `${this.resourceUrl}/${unitId}`;
    if (forceRefresh || !this.servisListCache.has(url)) {
      const request$ = this.httpClient.get<Servis[]>(url).pipe(
        tap(() => this.log(`Fetched all services by unit(${unitId})`)),
        catchError(this.handleError<Servis[]>('getByUnit', [])),
        shareReplay({ bufferSize: 1, refCount: true })
      );
      this.servisListCache.set(url, request$);
    }
    return this.servisListCache.get(url)!;
  }

  get(id: number, forceRefresh = false): Observable<Servis> {
    if (forceRefresh || !this.servisCacheMap.has(id)) {
      const request$ = this.httpClient.get<Servis>(`${this.resourceUrl}/${id}`)
        .pipe(
          tap(_ => this.log(`Fetched servis id=${id}`)),
          catchError(this.handleError<Servis>(`get id=${id}`)),
          shareReplay({ bufferSize: 1, refCount: true })
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
          this.invalidateCaches();
        }),
        catchError(this.handleError<Servis>('addServis'))
      );
  }

  private dependencyCache = new Map<number, Observable<Dependency[]>>();

  getDependencies(servisId: number, forceRefresh = false): Observable<Dependency[]> {
    if (forceRefresh || !this.dependencyCache.has(servisId)) {
      const request$ = this.httpClient
        .get<Dependency[]>(`${this.resourceUrl}/${servisId}/dependencies`)
        .pipe(
          tap(() => this.log(`Fetched dependencies for service id=${servisId}`)),
          catchError(this.handleError<Dependency[]>(`getDependencies id=${servisId}`, [])),
          shareReplay({ bufferSize: 1, refCount: true })
        );
      this.dependencyCache.set(servisId, request$);
    } else {
      this.log(`Fetched dependencies for service id=${servisId} (from cache)`);
    }
    return this.dependencyCache.get(servisId)!;
  }

  addDependencies(servisId: number, chosenDependencies: Dependency[]) {
    const chosenDependenciesId = chosenDependencies.map(d => d.id);
    console.debug(JSON.stringify(chosenDependenciesId));
    this.httpClient.post<number[]>(`${this.resourceUrl}/${servisId}/dependencies/add`, chosenDependenciesId)
      .pipe(
        tap(() => this.log(`Dependencies has been added for ${servisId}`))
      )
      .subscribe();
  }

  private invalidateCaches(): void {
    this.servisListCache.clear();
    this.servisCacheMap.clear();
    this.log('All caches cleared after mutation');
  }
}