export class EncryptedDoc {
  id: number;
  document?: string;
  livraison?: string;
  constructor(id: number, document: string, livraison: string) {
    this.id = id;
    this.document = document;
    this.livraison = livraison;
  }
}
