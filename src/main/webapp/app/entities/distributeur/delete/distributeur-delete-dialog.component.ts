import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDistributeur } from '../distributeur.model';
import { DistributeurService } from '../service/distributeur.service';

@Component({
  templateUrl: './distributeur-delete-dialog.component.html',
})
export class DistributeurDeleteDialogComponent {
  distributeur?: IDistributeur;

  constructor(protected distributeurService: DistributeurService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.distributeurService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
