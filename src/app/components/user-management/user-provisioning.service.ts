import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from '../../commons/shared/service/base-service';
import { Observable } from 'rxjs';
import { UserCreationDto } from './user-creation';
import { PasswordUpdateDto } from '../../commons/shared/PasswordUpdateDto';


@Injectable({
  providedIn: 'root'
})
export class UserProvisioningService extends BaseService {

  private readonly resourceUrl = `${environment.gatewayBaseUrl}/stoa/v1/user-provisioning`
  private httpClient = inject(HttpClient);

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor() {
    super('UserProvisioningService');
  }

  createUser(payload: UserCreationDto): Observable<any> {
    this.log('Create a user');
    return this.httpClient.post(`${this.resourceUrl}/create`, payload);
  }

  updatePassword(userId: string, passwords: PasswordUpdateDto): Observable<boolean> {
    this.log('Updating password...')
    return this.httpClient.patch<boolean>(`${this.resourceUrl}/update-password/${userId}`, passwords);
  }
}