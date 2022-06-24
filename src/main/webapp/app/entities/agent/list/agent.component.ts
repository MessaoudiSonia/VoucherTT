import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAgent } from '../agent.model';
import { AgentService } from '../service/agent.service';
import { AgentDeleteDialogComponent } from '../delete/agent-delete-dialog.component';

@Component({
  selector: 'inetum-agent',
  templateUrl: './agent.component.html',
})
export class AgentComponent implements OnInit {
  agents?: IAgent[];
  isLoading = false;
  searchedKeyword: string;
  p?: number = 1;

  constructor(protected agentService: AgentService, protected modalService: NgbModal) {
    this.searchedKeyword = '';
  }

  loadAll(): void {
    this.isLoading = true;

    this.agentService.query().subscribe(
      (res: HttpResponse<IAgent[]>) => {
        this.isLoading = false;
        this.agents = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAgent): number {
    return item.id!;
  }

  delete(agent: IAgent): void {
    const modalRef = this.modalService.open(AgentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.agent = agent;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
