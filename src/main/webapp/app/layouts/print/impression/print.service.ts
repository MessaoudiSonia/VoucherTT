import { Injectable } from '@angular/core';
import { Livraison } from 'app/entities/print/print';
import { DocumentService } from 'app/entities/document/service/document.service';
import { ElectronService } from 'ngx-electron';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  printJobs: Livraison[];
  public printObservers: any[];

  constructor(private documentService: DocumentService, private _electronService: ElectronService, private toastr: ToastrService) {
    this.printObservers = new Array(0);
    try {
      this._electronService.ipcRenderer.on('statusPrint', (evt: any, message: any) => {
        console.log('return statusPrint :', message.status);
        console.log('printer :', message);
        console.log('return nomImprimante :', message.nomImprimante);
        console.log('return statusPrint :', this.printObservers[message.nomImprimante]);
        const observer = this.printObservers[message.nomImprimante]?.observer;
        console.log('observer :', observer);
        const livraison: Livraison = this.printObservers[message.nomImprimante]?.livraison;
        console.log('message:', message);
        console.log('message status :', message.status);
        if (message.status === 'ok') {
          console.log('message status is ok');
          this.updatedocumentidsucess(message.id, message.nomImprimante);
          console.log('observer next', observer);
          if (observer) {
            console.log('observer next');
            observer.next(((livraison.indexDocument + 1) * 100) / livraison.nombreDocument);
            this.printObservers[message.nomImprimante].livraison.indexDocument++;
            console.log('before :livraison.indexDocument <= livraison.nombreDocument', livraison.indexDocument, livraison.nombreDocument);
            if (livraison.indexDocument < livraison.nombreDocument) {
              console.log('index document < nombre document', livraison.indexDocument, livraison.nombreDocument);
              //console.log("livraison.indexDocument <= livraison.nombreDocument")
              this.printOne(livraison);
              console.log('print one avec succes');
            } else {
              console.log('else', message.nomImprimante);
              delete this.printObservers[message.nomImprimante];
              observer.complete();
            }
          }
        } else {
          this.updatedocumentidfailed(message.id, message.nomImprimante);
          // alert(offline);
          this.toastr.error(message.status, 'erreur');
          if (observer) {
            observer.error(new Error('failed document'));
            delete this.printObservers[message.nomImprimante];
            observer.complete();
          }
        }
      });
    } catch (e) {
      console.log('erreur from print service', e);
    }
    this.printJobs = new Array(0);
  }

  updatedocumentidsucess(id: number, nomImprimante: string): void {
    this.documentService.UpdateStatusSuccessOfDocumentById(id, nomImprimante).subscribe(res => {
      // this.startPrint();
      console.log('sucess: %', id.toString());
    });
  }

  updatedocumentidfailed(id: number, nomImprimante: string): void {
    this.documentService.UpdateStatusFailedOfDocumentById(id, nomImprimante).subscribe(res => {
      console.log('failed: %', id.toString());
    });
  }

  startPrint(livraison: Livraison): Observable<number> {
    console.log('will start printing:%', livraison);
    console.log('imprimante name:%', livraison.nomImprimante.name);
    livraison.nomImprimante.name = livraison.nomImprimante.name.replace('\r', '');
    return new Observable(observer => {
      if (!(livraison.nomImprimante in this.printObservers)) {
        this.printObservers[livraison.nomImprimante.name] = {
          observer,
          livraison,
        };
        console.log('observed in: %', this.printObservers);
        if (livraison.indexDocument < livraison.nombreDocument) {
          this.printOne(livraison);
        }
      }
    });
  }

  printOne(livraison: Livraison): void {
    console.log('print one msg', livraison.codeDistributeur);
    const arg: (string | number | null | undefined)[] = [];
    arg.push(livraison.key);

    arg.push(livraison.nomImprimante.name);
    console.log('index :: ', livraison.indexDocument);
    const idDocument = livraison.enycryptedDocs[livraison.indexDocument].id;
    arg.push(livraison.enycryptedDocs[livraison.indexDocument].document);
    const codeDistributeur = livraison.codeDistributeur;
    const droitTimbre = livraison.droitTimbre;
    arg.push(idDocument);
    arg.push(codeDistributeur);
    arg.push(droitTimbre);
    arg.push(livraison.nomImprimante.ip);
    console.log('arguments before print %', arg);
    this._electronService.ipcRenderer.send('print', arg);
    //  return idDocument;
  }
}
