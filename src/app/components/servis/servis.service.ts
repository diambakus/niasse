import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Servis } from './servis';

@Injectable({
  providedIn: 'root'
})
export class ServisService {

  private servisUrl: string = "api/servis";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAll(): Observable<Servis[]> {
    return this.http.get<Servis[]>(this.servisUrl).pipe(
      tap(_ => this.log('Fetched servis')),
      catchError(this.handleError<Servis[]>('', []))
    );
  }

  get(id: number): Observable<Servis> {
    const url = `${this.servisUrl}/${id}`;
    const fetchedServis = this.http.get<Servis>(url).pipe(
      tap(_ => {
        this.log(`Fetched servis id=${id}`)
      }),
      catchError(this.handleError<Servis>(`get id=${id}`))
    );
    return fetchedServis;
  }

  getByUnit(unitId: number): Observable<Servis[]> {
    const url = `${this.servisUrl}?unitId=${unitId}`;
    const items = this.http.get<Servis[]>(url).pipe(
      tap(data => {
        this.log(`Fetched items with unitId=${unitId}`);
        console.debug(JSON.stringify(data)); // Logs the actual data after the request resolves
      }),
      catchError(this.handleError<Servis[]>(`getByUnit id=${unitId}`))
    );

    return items;
  }

  addForUnit(servis: Servis, unitId: number): Observable<any> {
    const url: string = `api/unit/${unitId}`;
    return this.http.post<Servis>(url, servis, this.httpOptions)
      .pipe(
        tap((unit: Servis) => this.log(`added servis w/ id=${unit.id}`)),
        catchError(this.handleError<Servis>('addForUnit'))
      );
  }

  private log(message: string) {
    console.debug(`ServisService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
