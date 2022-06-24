import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAgent, getAgentIdentifier } from '../agent.model';

export type EntityResponseType = HttpResponse<IAgent>;
export type EntityArrayResponseType = HttpResponse<IAgent[]>;

@Injectable({ providedIn: 'root' })
export class AgentService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/agents');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(agent: IAgent): Observable<EntityResponseType> {
    return this.http.post<IAgent>(this.resourceUrl, agent, { observe: 'response' });
  }

  update(agent: IAgent): Observable<EntityResponseType> {
    return this.http.put<IAgent>(`${this.resourceUrl}/${getAgentIdentifier(agent) as number}`, agent, { observe: 'response' });
  }

  partialUpdate(agent: IAgent): Observable<EntityResponseType> {
    return this.http.patch<IAgent>(`${this.resourceUrl}/${getAgentIdentifier(agent) as number}`, agent, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAgent>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAgent[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAgentToCollectionIfMissing(agentCollection: IAgent[], ...agentsToCheck: (IAgent | null | undefined)[]): IAgent[] {
    const agents: IAgent[] = agentsToCheck.filter(isPresent);
    if (agents.length > 0) {
      const agentCollectionIdentifiers = agentCollection.map(agentItem => getAgentIdentifier(agentItem)!);
      const agentsToAdd = agents.filter(agentItem => {
        const agentIdentifier = getAgentIdentifier(agentItem);
        if (agentIdentifier == null || agentCollectionIdentifiers.includes(agentIdentifier)) {
          return false;
        }
        agentCollectionIdentifiers.push(agentIdentifier);
        return true;
      });
      return [...agentsToAdd, ...agentCollection];
    }
    return agentCollection;
  }
}
