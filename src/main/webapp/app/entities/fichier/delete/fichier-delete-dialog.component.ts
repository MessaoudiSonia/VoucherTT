import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFichier } from '../fichier.model';
import { FichierService } from '../service/fichier.service';

@Component({
  templateUrl: './fichier-delete-dialog.component.html',
})
export class FichierDeleteDialogComponent {
  fichier?: IFichier;

  constructor(protected fichierService: FichierService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fichierService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
