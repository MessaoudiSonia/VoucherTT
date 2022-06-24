import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILot } from '../lot.model';
import { LotService } from '../service/lot.service';

@Component({
  templateUrl: './lot-delete-dialog.component.html',
})
export class LotDeleteDialogComponent {
  lot?: ILot;

  constructor(protected lotService: LotService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.lotService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
