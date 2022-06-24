import { EncryptedDoc } from 'app/shared/encryptedDoc';
import { Imprimante } from 'app/layouts/print/impression/imprimante';

export class Livraison {
  documents: EncryptedDoc[] | undefined;
  key!: string | null;
  nomImprimante: any;
  nombreDocument: any;
  typeLot: any;
  indexDocument!: number;
  enycryptedDocs!: EncryptedDoc[];
  idDocument!: number;
  isDouble: string | undefined;
  avancement!: number;
  codeDistributeur!: any;
  droitTimbre!: any;
  //_electronService!: ElectronService;
}
