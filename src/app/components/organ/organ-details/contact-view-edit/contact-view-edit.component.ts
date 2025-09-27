import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Contact } from '../../../../commons/shared/common-topics';
import { ContactService } from '../../../../commons/shared/service/contact-service';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';

@Component({
  selector: 'app-contact-view-edit',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    ContactDialogComponent
  ],
  templateUrl: './contact-view-edit.component.html',
  styleUrl: './contact-view-edit.component.scss'
})
export class ContactViewEditComponent {
  private contactService = inject(ContactService);
  private dialog = inject(MatDialog);
  @Input() editable = true;

  @Input() set organId(id: number) {
    this._organId.set(id);
  }

  @Input() set newContact(contact: Contact | null) {
    if (contact) {
      this.contacts.update((list) => [...list, contact]);
    }
  }

  private _organId = signal<number | null>(null);
  readonly contacts = signal<Contact[]>([]);

  constructor() {
    effect(() => {
      const id = this._organId();
      if (id === null) return;

      this.contactService.getContactsByEntity(id, 'organ')
        .subscribe(data => this.contacts.set(data));
    });
  }

  openContactDialog(contact: Contact) {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      data: { contact }
    });

    dialogRef.afterClosed().subscribe((changes: Record<string, any> | undefined) => {
      if (changes && Object.keys(changes).length > 0 && contact.id) {
        this.contactService.updateContact(contact.id, changes, 'organ').subscribe({
          next: (updated) => {
            this.contacts.update(list =>
              list.map(c => c.id === contact.id ? { ...c, ...updated } : c)
            );
          },
          error: (err) => {
            console.error('Failed to update contact:', err);
          }
        });
      }
    });
  }
}