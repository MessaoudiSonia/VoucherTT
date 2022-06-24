import { IUser } from 'app/entities/user/user.model';

export interface IAgent {
  id?: number;
  matricule?: string;
  activationKey?: string;
  internalUser?: IUser;
}

export class Agent implements IAgent {
  constructor(public id?: number, public matricule?: string, public activationKey?: string, public internalUser?: IUser) {}
}

export function getAgentIdentifier(agent: IAgent): number | undefined {
  return agent.id;
}
