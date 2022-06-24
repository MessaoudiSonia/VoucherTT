import * as dayjs from 'dayjs';
import { ILot } from 'app/entities/lot/lot.model';
import { IPoste } from 'app/entities/poste/poste.model';
import { PrintStatus } from 'app/entities/enumerations/print-status.model';
import { IDocument } from 'app/entities/document/document.model';

export interface IHistorique {
  id?: number;
  creation?: dayjs.Dayjs;
  impression?: dayjs.Dayjs | null;
  printer?: string | null;
  printStatus?: PrintStatus | null;
  document?: IDocument;
}

export class Historique implements IHistorique {
  constructor(
    public id?: number,
    public creation?: dayjs.Dayjs,
    public impression?: dayjs.Dayjs | null,
    public printer?: string | null,
    public printStatus?: PrintStatus | null,
    public livraison?: string,
    public document?: IDocument
  ) {}
}

export function getHistoriqueIdentifier(historique: IHistorique): number | undefined {
  return historique.id;
}
