import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment.dev";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, of, shareReplay, tap } from "rxjs";
import { Contact, KeyValuePair } from "../common-topics";
import { EntityType } from "../../util-type";


@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private contactCache = new Map<string, Observable<Contact[]>>();
    private readonly baseUrl = environment.gatewayBaseUrl;
    private servitusAssetsUrl = '/servitus';

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) { }

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
        fields: Record<string, any>
    ): Observable<Contact> {
        const fullEndpoint = `${this.baseUrl}${this.servitusAssetsUrl}/contact/${id}`;
        return this.http.patch<Contact>(fullEndpoint, fields).pipe(
            tap(() =>
                this.log(
                    `Updated contact ${id} with fields: ${Object.keys(fields).join(', ')}`
                )
            ),
            catchError(this.handleError<Contact>('updateContact'))
        );
    }

    log(message: string) {
        console.debug(message); // TODO: change to MessageService instead
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}