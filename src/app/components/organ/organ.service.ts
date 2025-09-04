import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.dev';
import { Organ } from './organ';

@Injectable({
  providedIn: 'root'
})
export class OrganService {

  private readonly baseUrl = environment.gatewayBaseUrl;
  private assetsUrl = '/servitus/organ';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getOrgans(): Observable<Organ[]> {
    return this.http.get<Organ[]>(`${this.baseUrl}${this.assetsUrl}`)
      .pipe(
        tap(_ => this.log('fetched organisations')),
        catchError(this.handleError<Organ[]>('getOrgans', []))
      );
  }

  get(id: number): Observable<Organ> {
    return this.http.get<Organ>(`${this.baseUrl}${this.assetsUrl}/${id}`,)
      .pipe(
        tap(_ => this.log('fetched organisation')),
        catchError(this.handleError<Organ>('getOrgan'))
      );
  }

  addOrgan(organ: Organ): Observable<Organ> {
    return this.http.post<Organ>(this.assetsUrl, organ, this.httpOptions).pipe(
      tap((freshOrgan: Organ) => this.log(`added new Organisation w/ id=${freshOrgan.id}`)),
      catchError(this.handleError<Organ>('addOrgan'))
    );
  }

  log(message: string) {
    console.debug(message); // TODO: change to MessageService instead
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
