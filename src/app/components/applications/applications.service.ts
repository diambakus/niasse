import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Application } from './application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService implements OnInit {

  private applicationsUrl = 'api/applications';
  applications: Application[] = [];

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.applications = [];
  }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.applicationsUrl)
      .pipe(
        tap(_ => this.log('fetched applications')),
        catchError(this.handleError<Application[]>('getApplications', []))
        /*tap(raw => console.log('RAW RESPONSE', raw)),
        map(raw => JSON.parse(raw as unknown as string)),
        catchError(this.handleError<Application[]>('getApplications', []))*/
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
