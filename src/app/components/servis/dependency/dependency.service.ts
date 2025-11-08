import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';
import { BaseService } from '../../../commons/shared/service/base-service';
import { environment } from '../../../../environments/environment.dev';
import { Dependency } from './dependency';


@Injectable({
  providedIn: 'root'
})
export class DependencyService extends BaseService {
  private readonly resourceBase = `${environment.gatewayBaseUrl}/servitus/dependency`;
  private httpClient = inject(HttpClient);
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private cache = new Map<string, Observable<any>>();

  constructor() {
    super('DependencyService');
  }

  private key(url: string): string {
    return url;
  }


  private cachedGet<T>(url: string): Observable<T> {
    const k = this.key(url);
    if (this.cache.has(k)) {
      this.log(`Cache hit for ${k}`);
      return this.cache.get(k) as Observable<T>;
    }


    const req$ = this.httpClient.get<T>(url).pipe(
      tap(() => this.log(`HTTP GET ${url}`)),
      catchError(err => {
        this.log(`HTTP GET failed for ${url}, evicting cache entry`);
        this.cache.delete(k);
        return throwError(() => err);
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.cache.set(k, req$);
    return req$;
  }

  getAll(forceRefresh = false): Observable<Dependency[]> {
    const url = `${this.resourceBase}`;
    if (forceRefresh) {
      this.cache.delete(this.key(url));
      this.log('Force refresh requested for getAll()');
    }
    return this.cachedGet<Dependency[]>(url);
  }

  getByServis(servisId: number, forceRefresh = false): Observable<Dependency[]> {
    const url = `${this.resourceBase}/${servisId}`;
    if (forceRefresh) {
      this.cache.delete(this.key(url));
      this.log(`Force refresh requested for getByServisId(${servisId})`);
    }
    return this.cachedGet<Dependency[]>(url);
  }

  get(id: number, forceRefresh = false): Observable<Dependency> {
    const url = `${this.resourceBase}/${id}`;
    if (forceRefresh) {
      this.cache.delete(this.key(url));
      this.log(`Force refresh requested for get(${id})`);
    }
    return this.cachedGet<Dependency>(url);
  }

  getDependenciesToAddByServisId(servisId: number): Observable<Dependency[]> {
    const url = `${this.resourceBase}/servis/${servisId}`;
    return this.cachedGet<Dependency[]>(url);
  }

  addDependency(dep: Dependency): Observable<Dependency> {
    return this.httpClient.post<Dependency>(this.resourceBase, dep, this.httpOptions).pipe(
      tap(result => {
        this.log(`Added dependency "${result.title}"`);
        this.clearCache(); // clear all caches (simple approach)
      }),
      catchError(this.handleError<Dependency>('addDependency'))
    );
  }

  /** Update dependency and clear caches */
  updateDependency(id: number, dep: Dependency): Observable<Dependency> {
    const url = `${this.resourceBase}/${id}`;
    return this.httpClient.put<Dependency>(url, dep, this.httpOptions).pipe(
      tap(() => {
        this.log(`Updated dependency id=${id}`);
        // evict caches that might be affected (single id + collection)
        this.cache.delete(this.key(url));
        this.clearCollectionCaches();
      }),
      catchError(this.handleError<Dependency>('updateDependency'))
    );
  }

  /** Delete dependency and clear caches */
  deleteDependency(id: number): Observable<void> {
    const url = `${this.resourceBase}/${id}`;
    return this.httpClient.delete<void>(url, this.httpOptions).pipe(
      tap(() => {
        this.log(`Deleted dependency id=${id}`);
        this.cache.delete(this.key(url));
        this.clearCollectionCaches();
      }),
      catchError(this.handleError<void>('deleteDependency'))
    );
  }

  /** Clear all cached entries */
  clearCache(): void {
    this.cache.clear();
    this.log('All dependency caches cleared');
  }

  /** Clear only collection/list caches while retaining single-item caches (optional) */
  private clearCollectionCaches(): void {
    // If your single-item URLs are `${resourceBase}/{id}` and collections are either `${resourceBase}` or contain `?`
    for (const k of Array.from(this.cache.keys())) {
      if (k === this.resourceBase || k.includes(`${this.resourceBase}?`)) {
        this.cache.delete(k);
      }
    }
    this.log('Collection/list dependency caches cleared');
  }
}
