import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Application } from './application';
import { environment } from '../../../environments/environment.dev';
import { BaseService } from '../../commons/shared/service/base-service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService extends BaseService implements OnInit {

  applications: Application[] = [];

  private readonly resourceUrl = `${environment.gatewayBaseUrl}/rogator/application`;
  private httpClient = inject(HttpClient);


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor() {
    super('ApplicationService');
  }

  ngOnInit(): void {
    this.applications = [];
  }

  getApplications(): Observable<Application[]> {
    return this.httpClient.get<Application[]>(this.resourceUrl)
      .pipe(
        tap(_ => this.log('fetched applications')),
        catchError(this.handleError<Application[]>('getApplications', []))
      );
  }

  getUnfilteredApplicationsForEmployeeDashboard(employeeId: string): Observable<Application[]> {
    return this.httpClient.get<Application[]>(`${this.resourceUrl}/display-after-login/${employeeId}`)
      .pipe(
        tap(() => this.log('Fetching relevant applications to build employee dashboard.')),
        catchError(this.handleError<Application[]>('getUnfilteredApplicationsForEmployeeDashboard', []))
      )
  }

}
