import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeycloakAvailabilityService {
  private isKeycloakAvailableSubject = new BehaviorSubject<boolean>(true);
  isKeycloakAvailable$ = this.isKeycloakAvailableSubject.asObservable();

  setKeycloakAvailable(isAvailable: boolean): void {
    this.isKeycloakAvailableSubject.next(isAvailable);
  }

  getKeycloakAvailable(): boolean {
    return this.isKeycloakAvailableSubject.value;
  }
}