import { Injectable, OnInit } from '@angular/core';
import { Organ } from './organ';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganService implements OnInit {

  private assetsUrl = 'api/organs';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  organs: Organ[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.organs = [];
    throw new Error('Method not implemented.');
  }

  getOrgans(): Observable<Organ[]> {
    let organs: Organ[] = [
      {id: 1, name: 'Organization I', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'},
      {id: 2, name: 'Organization II', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'},
      {id: 3, name: 'Organization III', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'},
      {id: 4, name: 'Organization IV', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'},
      {id: 5, name: 'Organization V', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'},
      {id: 6, name: 'Organization VI', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'}

    ];

    return of (organs);

    /*return this.http.get<Organ[]>(this.assetsUrl)
      .pipe(
        tap(_ => this.log('fetched organisations')),
        catchError(this.handleError<Organ[]>('getOrgans', []))
      );*/
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
