import { IFichier } from 'app/entities/fichier/fichier.model';

export interface ILot {
  id?: number;
  offset?: number;
  fichier?: IFichier;
}

export class Lot implements ILot {
  constructor(public id?: number, public offset?: number, public fichier?: IFichier) {}
}

export function getLotIdentifier(lot: ILot): number | undefined {
  return lot.id;
}
