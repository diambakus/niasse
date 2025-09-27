import { Injectable } from "@angular/core";
import { BaseService } from "./base-service";
import { catchError, Observable, shareReplay, tap } from "rxjs";
import { Address } from "../common-topics";
import { environment } from "../../../../environments/environment.dev";
import { HttpClient } from "@angular/common/http";
import { EntityType } from "../../util-type";

@Injectable({
  providedIn: 'root'
})
export class AddressService extends BaseService {
  private addressCache = new Map<string, Observable<Address[]>>();
  private readonly baseUrl = environment.gatewayBaseUrl;
  private servitusAssetsUrl = '/servitus';

  constructor(private http: HttpClient) {
    super('AddressService');
  }

  public getAddressesByEntity(id: number, entityType: EntityType): Observable<Address[]> {
    const key = `${entityType}-${id}`;

    if (!this.addressCache.has(key)) {
      const fullEndpoint = `${this.baseUrl}${this.servitusAssetsUrl}/${entityType}/address/${id}`;
      const request$ = this.http.get<Address[]>(fullEndpoint).pipe(
        tap(() => this.log(`Fetched Addresses for ${entityType} ${id}`)),
        catchError(this.handleError<Address[]>('getAddressesByEntity', [])),
        shareReplay(1) // cache latest result
      );
      this.addressCache.set(key, request$);
    }

    return this.addressCache.get(key)!;
  }

  public createAddressForEntity(
    id: number,
    entityType: EntityType,
    address: Address[]
  ): Observable<Address[]> {
    const fullEndpoint = `${this.baseUrl}${this.servitusAssetsUrl}/${entityType}/address/${id}`;
    return this.http.post<Address[]>(fullEndpoint, address).pipe(
      tap(() => this.log(`Created ${address.length} Address(s) for ${entityType} ${id}`)),
      catchError(this.handleError<Address[]>('createAddressForEntity', []))
    );
  }


  public updateAddress(
    id: number,
    fields: Record<string, any>,
    entityType: EntityType
  ): Observable<Address> {
    const fullEndpoint = `${this.baseUrl}${this.servitusAssetsUrl}/${entityType}/address/${id}`;

    console.log(fullEndpoint, JSON.stringify(fields));

    return this.http.patch<Address>(fullEndpoint, fields).pipe(
      tap(() =>
        this.log(
          `Updated Address ${id} with fields: ${Object.keys(fields).join(', ')}`
        )
      ),
      catchError(this.handleError<Address>('updateAddress'))
    );
  }
}