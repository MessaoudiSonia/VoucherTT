import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAgent } from '../agent.model';
import { AgentService } from '../service/agent.service';

@Component({
  templateUrl: './agent-delete-dialog.component.html',
})
export class AgentDeleteDialogComponent {
  agent?: IAgent;

  constructor(protected agentService: AgentService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.agentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
