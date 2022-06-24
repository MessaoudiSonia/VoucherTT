import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAgent } from '../agent.model';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { IPoste } from 'app/entities/poste/poste.model';
import { finalize } from 'rxjs/operators';
import { PosteService } from 'app/entities/poste/service/poste.service';
import { AgentService } from 'app/entities/agent/service/agent.service';

@Component({
  selector: 'inetum-agent-detail',
  templateUrl: './agent-detail.component.html',
})
export class AgentDetailComponent implements OnInit {
  agent: IAgent | undefined;
  isSaving = false;

  constructor(protected activatedRoute: ActivatedRoute, protected agentService: AgentService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ agent }) => {
      this.agent = agent;
    });
  }

  save(): void {
    this.isSaving = true;
    const agent = this.agent;
    if (agent !== undefined) {
      this.subscribeToSaveResponse(this.agentService.update(agent));
    }
  }
  previousState(): void {
    window.history.back();
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAgent>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }
  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
