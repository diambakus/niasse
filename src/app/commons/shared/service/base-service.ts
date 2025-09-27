import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export abstract class BaseService {
  protected logPrefix = '[BaseService]';

  constructor(private serviceName: string) {
    this.logPrefix = `[${serviceName}]`;
  }

  /** Generic logger (can be swapped for Angular Logger or external service) */
  protected log(message: string): void {
    console.log(`${this.logPrefix} ${message}`);
  }

  /** Centralized error handling */
  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${this.logPrefix} ${operation} failed:`, error);

      // Example: handle 401/403 in one place
      if (error.status === 401 || error.status === 403) {
        // e.g. redirect to login
      }

      // Example: handle network down
      if (error.status === 0) {
        this.log('Network error: server unreachable');
      }

      // Let app keep running by returning safe result
      return of(result as T);
    };
  }
}