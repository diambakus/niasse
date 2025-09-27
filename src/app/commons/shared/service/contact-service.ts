import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, shareReplay, tap } from "rxjs";
import { environment } from "../../../../environments/environment.dev";
import { EntityType } from "../../util-type";
import { Contact } from "../common-topics";
import { BaseService } from "./base-service";


@Injectable({
    providedIn: 'root'
})
export class ContactService extends BaseService {
    private contactCache = new Map<string, Observable<Contact[]>>();
    private readonly baseUrl = environment.gatewayBaseUrl;
    private servitusAssetsUrl = '/servitus';

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) {
        super('ContactService');
    }

    public getContactsByEntity(id: number, entityType: EntityType): Observable<Contact[]> {
        const key = `${entityType}-${id}`;

        if (!this.contactCache.has(key)) {
            const fullEndpoint = `${this.baseUrl}${this.servitusAssetsUrl}/${entityType}/contact/${id}`;
            const request$ = this.http.get<Contact[]>(fullEndpoint).pipe(
                tap(() => this.log(`Fetched contacts for ${entityType} ${id}`)),
                catchError(this.handleError<Contact[]>('getContactsByEntity', [])),
                shareReplay(1) // cache latest result
            );
            this.contactCache.set(key, request$);
        }

        return this.contactCache.get(key)!;
    }

    public createContactsForEntity(
        id: number,
        entityType: EntityType,
        contacts: Contact[]
    ): Observable<Contact[]> {
        const fullEndpoint = `${this.baseUrl}${this.servitusAssetsUrl}/${entityType}/contact/${id}`;
        return this.http.post<Contact[]>(fullEndpoint, contacts).pipe(
            tap(() => this.log(`Created ${contacts.length} contact(s) for ${entityType} ${id}`)),
            catchError(this.handleError<Contact[]>('createContactsForEntity', []))
        );
    }


    public updateContact(
        id: number,
        fields: Record<string, any>,
        entityType: EntityType
    ): Observable<Contact> {
        const fullEndpoint = `${this.baseUrl}${this.servitusAssetsUrl}/${entityType}/contact/${id}`;

        console.log(fullEndpoint, JSON.stringify(fields));

        return this.http.patch<Contact>(fullEndpoint, fields).pipe(
            tap(() =>
                this.log(
                    `Updated contact ${id} with fields: ${Object.keys(fields).join(', ')}`
                )
            ),
            catchError(this.handleError<Contact>('updateContact'))
        );
    }
}