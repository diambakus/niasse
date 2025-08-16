import { effect, inject, Injectable } from '@angular/core';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, ReadyArgs, typeEventArgs } from 'keycloak-angular';
import Keycloak, { KeycloakLoginOptions, KeycloakProfile } from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authenticated = false;
  keycloakStatus: string | undefined;
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  constructor() {
    effect(() => {
      const keycloakEvent = this.keycloakSignal();
      this.keycloakStatus = keycloakEvent.type;

      if (keycloakEvent.type === KeycloakEventType.Ready) {
        this.authenticated = typeEventArgs<ReadyArgs>(keycloakEvent.args);
      }

      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        this.authenticated = false;
      }
    });
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  login(): void {
    const redirectUri = window.location.origin + '/dashboard';
    const options: KeycloakLoginOptions = {
      redirectUri: redirectUri
    }
    this.keycloak.login(options).then(
      () => {
        console.debug('Login initiated, redirecting to Keycloak');
      })
      .catch(err => {
        console.error('Login failed', err);
      });
  }

  logout() {
    this.keycloak.logout();
    console.debug('Logout succefully');
  }


  async getUserProfile(): Promise<KeycloakProfile> {
    let userProfile: KeycloakProfile | null = null;
    if (!userProfile) {
      userProfile = await this.keycloak.loadUserProfile();
    }
    return userProfile;
  }


  async getToken(): Promise<String> {
    return await this.keycloak.token || '';
  }
}