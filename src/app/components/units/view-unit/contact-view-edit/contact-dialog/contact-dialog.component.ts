import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Contact } from '../../../../../commons/shared/common-topics';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-contact-dialog',
  imports: [
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './contact-dialog.component.html',
  styleUrl: './contact-dialog.component.scss'
})
export class ContactDialogComponent {
  contact: Contact;
  private originalContact: Contact;

  constructor(
    private dialogRef: MatDialogRef<ContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: { contact: Contact }
  ) {
    this.originalContact = { ...data.contact };
    this.contact = { ...data.contact };
  }

  save() {
    const changes: Record<string, any> = {};

    (Object.keys(this.contact) as (keyof Contact)[]).forEach((key) => {
      if (this.contact[key] !== this.originalContact[key]) {
        changes[key as string] = this.contact[key];
      }
    });

    this.dialogRef.close(changes);
  }
}
