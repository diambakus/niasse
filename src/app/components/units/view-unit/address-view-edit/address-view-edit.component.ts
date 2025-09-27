import { Component, effect, inject, Input, signal } from '@angular/core';
import { AddressService } from '../../../../commons/shared/service/address-service';
import { MatDialog } from '@angular/material/dialog';
import { Address } from '../../../../commons/shared/common-topics';
import { AddressDialogComponent } from './address-dialog/address-dialog.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-address-view-edit',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    AddressDialogComponent
  ],
  templateUrl: './address-view-edit.component.html',
  styleUrl: './address-view-edit.component.scss'
})
export class AddressViewEditComponent {
  private addressService = inject(AddressService);
  private dialog = inject(MatDialog);
  @Input() editable = true;
  private _unitId = signal<number | null>(null);

  @Input() set unitId(id: number) {
    this._unitId.set(id);
  }

  @Input() set newAddress(address: Address | null) {
    if (address) {
      this.addresses.update((list) => [...list, address]);
    }
  }

  readonly addresses = signal<Address[]>([]);

  constructor() {
    effect(() => {
      const id = this._unitId();
      if (id === null) return;

      this.addressService.getAddressesByEntity(id, 'unit')
        .subscribe(data => this.addresses.set(data));
    });
  }

  openAddressDialog(address: Address) {
    const dialogRef = this.dialog.open(AddressDialogComponent, {
      data: { address }
    });

    dialogRef.afterClosed().subscribe((changes: Record<string, any> | undefined) => {
      if (changes && Object.keys(changes).length > 0 && address.id) {
        this.addressService.updateAddress(address.id, changes, 'unit').subscribe({
          next: (updated) => {
            this.addresses.update(list =>
              list.map(c => c.id === address.id ? { ...c, ...updated } : c)
            );
          },
          error: (err) => {
            console.error('Failed to update address:', err);
          }
        });
      }
    });
  }
}
