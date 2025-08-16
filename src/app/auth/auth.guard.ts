import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';
import { environment } from '../../environments/environment.dev';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {

  if (!environment.useKeycloak) {
    return true;
  }

  const { authenticated, grantedRoles } = authData;
  const router = inject(Router)

  if (!authenticated) {
    return router.parseUrl('/welcome');
  }

  const requiredRoles: string[] = route.data['roles'] || [];
  if (requiredRoles.length === 0) {
    return true;
  }

  //const hasRequiredRole = (role: string): boolean =>
  //Object.values(grantedRoles.resourceRoles).some((roles) => roles.includes(role));
  //const hasRole = requiredRoles.some((requiredRole) => keycloak.isUser)

  console.debug(JSON.stringify(requiredRoles));

  /*if (authenticated && hasRequiredRole(requiredRole)) {
    return true;
  }*/

  return router.parseUrl('/forbidden');
};

export const canActivateAuthRole = createAuthGuard<CanActivateFn>(isAccessAllowed);
