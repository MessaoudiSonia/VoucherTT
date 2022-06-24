import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDocument } from '../document.model';
import { DocumentService } from '../service/document.service';

@Component({
  templateUrl: './document-delete-dialog.component.html',
})
export class DocumentDeleteDialogComponent {
  document?: IDocument;

  constructor(protected documentService: DocumentService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.documentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
