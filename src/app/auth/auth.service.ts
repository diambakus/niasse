import {
  Injectable,
  inject,
  signal,
  computed,
  effect
} from '@angular/core';

import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  ReadyArgs,
  typeEventArgs
} from 'keycloak-angular';

import Keycloak from 'keycloak-js';

import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, of, map, catchError, startWith } from 'rxjs';
import { UserProfile } from '../commons/shared/user-profile';
import { UserProfileService } from '../components/user-profile/user-profile.service';


interface CurrentUserState {
  data: UserProfile | null;
  loading: boolean;
  error: unknown | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  // ------------------------
  // Dependencies
  // ------------------------

  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  private readonly userProfileService = inject(UserProfileService);

  // ------------------------
  // Authentication State
  // ------------------------

  private readonly _authenticated = signal(false);
  readonly authenticated = computed(() => this._authenticated());

  readonly tokenParsed = computed(() =>
    this.keycloak.tokenParsed ?? null
  );

  readonly userId = computed(() =>
    this.tokenParsed()?.sub ?? null
  );

  // ------------------------
  // Current User Reactive State
  // ------------------------

  private readonly currentUserState = toSignal(
    toObservable(this.userId).pipe(
      switchMap(userId => {
        if (!userId) {
          return of<CurrentUserState>({
            data: null,
            loading: false,
            error: null
          });
        }

        return this.userProfileService.getCurrentUserProfile(userId).pipe(
          map(user => ({
            data: user,
            loading: false,
            error: null
          })),
          startWith({
            data: null,
            loading: true,
            error: null
          }),
          catchError(error =>
            of({
              data: null,
              loading: false,
              error
            })
          )
        );
      })
    ),
    {
      initialValue: {
        data: null,
        loading: false,
        error: null
      }
    }
  );

  // ------------------------
  // Public Derived Signals
  // ------------------------

  readonly currentUser = computed(() =>
    this.currentUserState().data
  );

  readonly currentUserLoading = computed(() =>
    this.currentUserState().loading
  );

  readonly currentUserError = computed(() =>
    this.currentUserState().error
  );

  // ------------------------
  // Role-Based Signals
  // ------------------------

  readonly role = computed(() =>
    this.currentUser()?.role ?? ''
  );

  readonly isAdmin = computed(() =>
    this.role().includes('ADMIN')
  );

  readonly isOrganAdmin = computed(() =>
    this.role().includes('ORGAN_ADMIN')
  );

  readonly isUser = computed(() =>
    this.role().includes('USER')
  );

  readonly hasAnyRole = (roles: string[]) =>
    computed(() =>
      roles.some(role => this.role().includes(role))
    );

  // ------------------------
  // Constructor
  // ------------------------

  constructor() {
    effect(() => {
      const event = this.keycloakSignal();

      if (event.type === KeycloakEventType.Ready) {
        this._authenticated.set(
          typeEventArgs<ReadyArgs>(event.args)
        );
      }

      if (event.type === KeycloakEventType.AuthLogout) {
        this._authenticated.set(false);
      }
    });
  }

  // ------------------------
  // Public API
  // ------------------------

  login(): void {
    const redirectUri = window.location.origin + '/dashboard';
    this.keycloak.login({ redirectUri });
  }

  logout(): void {
    this.keycloak.logout();
  }

}