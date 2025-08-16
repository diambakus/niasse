import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PublicRoutesService {
  private publicRoutes: string[] = [];

  constructor(private router: Router) {
    this.collectPublicRoutes(this.router.config);
  }

  private collectPublicRoutes(routes: any[], parentPath = '') {
    routes.forEach(route => {
      const fullPath = parentPath ? `${parentPath}/${route.path}` : `/${route.path}`;
      if (route.data?.public) {
        this.publicRoutes.push(fullPath);
      }
      if (route.children) {
        this.collectPublicRoutes(route.children, fullPath);
      }
    });
  }

  isPublicRoute(url: string): boolean {
    return this.publicRoutes.includes(url);
  }

  getPublicRoutes(): string[] {
    return this.publicRoutes;
  }
}