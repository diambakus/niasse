import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Unit } from './unit';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  unitsUrl: string = "api/units";
  httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
      //'Authorization': `Bearer ${keycloak.token}`
    })
  };

  constructor(private http: HttpClient) { }

  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.unitsUrl).pipe(
      tap(_ => this.log('Fetched units')),
      catchError(this.handleError<Unit[]>('getUnits', []))
    );
  }

  getUnit(id: number): Observable<Unit> {
    const unitByIdUrl = `${this.unitsUrl}/${id}`;
    return this.http.get<Unit>(unitByIdUrl)
      .pipe(
        tap(_ => this.log(`Fetched unit id=${id}`)),
        catchError(this.handleError<Unit>(`getUnit id=${id}`))
      );
  }

  getUnitsByOrgan(organId: number): Observable<Unit[]> {
    const url = `${this.unitsUrl}?organId=${organId}`;
    const units = this.http.get<Unit[]>(url).pipe(
      tap(data => {
        this.log(`Fetched units with organId=${organId}`)
      }),
      catchError(this.handleError<Unit[]>(`getUnitsByOrgan id=${organId}`))
    );

    return units;
  }

  addUnitForOrgan(unit: Unit, organId: number): Observable<any> {
    const url: string = `api/organ/${organId}`;
    return this.http.post<Unit>(url, unit, this.httpOptions)
      .pipe(
        tap((unit: Unit) => this.log(`added Unit w/ id=${unit.id}`)),
        catchError(this.handleError<Unit>('addUnit'))
      );
  }

  private log(message: string) {
    console.debug(`unitService: ${message}`);
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
