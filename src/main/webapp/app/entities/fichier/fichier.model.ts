import { IDistributeur } from 'app/entities/distributeur/distributeur.model';
import * as dayjs from 'dayjs';

export interface IFichier {
  id?: number;
  path?: string;
  count?: number;
  ouverture?: dayjs.Dayjs;
  rest?: number;
  password?: string;
  distributeur?: IDistributeur;
}

export class Fichier implements IFichier {
  constructor(
    public id?: number,
    public path?: string,
    public count?: number,
    public rest?: number,
    public ouverture?: dayjs.Dayjs,
    public password?: string,
    public distributeur?: IDistributeur
  ) {}
}

export function getFichierIdentifier(fichier: IFichier): number | undefined {
  return fichier.id;
}
