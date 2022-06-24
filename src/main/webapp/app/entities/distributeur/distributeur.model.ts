import { IUser } from 'app/entities/user/user.model';

export interface IDistributeur {
  id?: number;
  nom?: string;
  code?: string;
  codeReimpression?: string;
  activationKey?: string;
  internalUser?: IUser | null;
}

export class Distributeur implements IDistributeur {
  constructor(
    public id?: number,
    public nom?: string,
    public code?: string,
    public codeReimpression?: string,
    public internalUser?: IUser | null,
    public activationKey?: string
  ) {}
}

export function getDistributeurIdentifier(distributeur: IDistributeur): number | undefined {
  return distributeur.id;
}
