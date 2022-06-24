import { IUser } from 'app/entities/user/user.model';
import { IDistributeur } from 'app/entities/distributeur/distributeur.model';

export interface IPoste {
  id?: number;
  nom?: string;
  code?: string;
  activationKey?: string;
  privateKey?: string | null;
  publicKey?: string | null;
  internalUser?: IUser | null;
  distributeur?: IDistributeur;
}

export class Poste implements IPoste {
  constructor(
    public id?: number,
    public nom?: string,
    public code?: string,
    public activationKey?: string,
    public privateKey?: string | null,
    public publicKey?: string | null,
    public internalUser?: IUser | null,
    public distributeur?: IDistributeur
  ) {}
}

export function getPosteIdentifier(poste: IPoste): number | undefined {
  return poste.id;
}
