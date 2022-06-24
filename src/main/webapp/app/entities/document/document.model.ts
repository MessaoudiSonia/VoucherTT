import * as dayjs from 'dayjs';
import { ILot } from 'app/entities/lot/lot.model';
import { IPoste } from 'app/entities/poste/poste.model';
import { PrintStatus } from 'app/entities/enumerations/print-status.model';

export interface IDocument {
  id?: number;
  creation?: dayjs.Dayjs;
  impression?: dayjs.Dayjs | null;
  motif?: string | null;
  printer?: string | null;
  compteur?: number;
  printStatus?: PrintStatus | null;
  lot1?: ILot;
  lot2?: ILot | null;
  poste?: IPoste;
}

export class Document implements IDocument {
  constructor(
    public id?: number,
    public creation?: dayjs.Dayjs,
    public impression?: dayjs.Dayjs | null,
    public motif?: string | null,
    public printer?: string | null,
    public compteur?: number,
    public printStatus?: PrintStatus | null,
    public lot1?: ILot,
    public lot2?: ILot | null,
    public livraison?: string,
    public poste?: IPoste
  ) {}
}

export function getDocumentIdentifier(document: IDocument): number | undefined {
  return document.id;
}
