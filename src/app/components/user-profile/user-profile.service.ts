import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.dev';
import { BaseService } from '../../commons/shared/service/base-service';
import { UserProfile } from '../../commons/shared/user-profile';


@Injectable({
  providedIn: 'root'
})
export class UserProfileService extends BaseService {

  private readonly resourceUrl = `${environment.gatewayBaseUrl}/stoa/v1/user-profile`
  private httpClient = inject(HttpClient);

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor() {
    super('UserProfileService');
  }

  getCurrentUserProfile(userId: string): Observable<UserProfile> {
    return this.httpClient.get<UserProfile>(`${this.resourceUrl}/${userId}`).pipe(
      tap(() => this.log('Fetching specified user profile')),
      catchError(this.handleError<UserProfile>('getUserProfile'))
    );
  }
}