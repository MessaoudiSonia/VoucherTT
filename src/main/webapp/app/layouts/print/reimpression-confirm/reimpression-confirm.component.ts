import { Component, Input, NgZone, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { Document, IDocument } from 'app/entities/document/document.model';
import { Livraison } from 'app/entities/print/print';
import { PrintService } from 'app/layouts/print/impression/print.service';
import { DocumentService } from 'app/entities/document/service/document.service';
import { EncryptedDoc } from 'app/shared/encryptedDoc';
import { ToastrService } from 'ngx-toastr';
import { ElectronService } from 'ngx-electron';
import { DistributeurService, EntityResponseType } from 'app/entities/distributeur/service/distributeur.service';
import { doc } from 'prettier';
import { toNumbers } from '@angular/compiler-cli/src/diagnostics/typescript_version';
import { Imprimante } from 'app/layouts/print/impression/imprimante';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

@Component({
  selector: 'inetum-reimpression-confirm',
  templateUrl: './reimpression-confirm.component.html',
  styleUrls: ['./reimpression-confirm.component.scss'],
})
export class ReimpressionConfirmComponent implements OnInit {
  document?: IDocument;
  documentToUpdate?: any;
  nombreCompteur = 0;
  documentTest?: any;
  nombreTest = 0;
  length?: any;
  documents?: IDocument[];
  docsForPrint: EncryptedDoc[] = [];
  printableDocs: EncryptedDoc[] = [];
  listeTest?: EncryptedDoc[];
  imprimantes?: string[];
  isSaving?: any;
  imprimantesFiltred?: string[];
  // printJobs!: Livraison[];
  isDisabled?: boolean;
  codeReimpression?: any;
  droitTimbre?: string;
  codeDistributeur: any;
  listeImprimante?: Imprimante[] = [];
  codeLivraison: string | undefined;
  reimprimeForm = this.fb.group({
    password: [],
    printChoise: ['1', [Validators.required]],
    nbrPagesEnCours: [{ value: 0, disabled: true }],
    nbrPages: [{ value: '0', disabled: true }],
    imprimante: [],
    motif: ['', [Validators.required]],
  });
  documentRestant?: number;
  documentSuivantId?: number;
  documentSuivantIndex?: number;
  disabledList = true;
  totalPages?: number;
  documentId?: number;
  docRestant?: number;
  documentEncours = -1;
  activeTab?: number;
  isPrinting = false;
  docsLenght = 0;
  btnDisabled?: boolean;
  isDisabledHL?: boolean;
  isDisabledEL?: boolean;
  statusMessage?: string;
  imprimante?: Imprimante;
  checkBusy?: boolean;

  constructor(
    private ngZone: NgZone,
    public activeModal: NgbActiveModal,
    private documentService: DocumentService,
    protected fb: FormBuilder,
    public printService: PrintService,
    private toastr: ToastrService,
    private _electronService: ElectronService
  ) {
    this.checkBusy = false;
    this.isDisabledHL = true;
    this.isDisabledEL = true;
    this.isDisabled = false;
    this._electronService.ipcRenderer.on('lesImprimantes', (evt: any, message: Imprimante[]) => {
      message.forEach(e => {
        const newImprimante = new Imprimante(e.name, e.ip);
        this.listeImprimante?.push(newImprimante);
      });
    });
    this._electronService.ipcRenderer.on('verifClose', (evt: any, message1: any) => {
      console.log('length', Object.values(this.printService.printObservers).length);
      if (Object.values(this.printService.printObservers).length !== 0) {
        this.toastr.error('il ya une impression en cours');
      } else {
        this._electronService.ipcRenderer.send('noJob');
      }
    });
  }

  ngOnInit(): void {
    this.btnDisabled = true;
    this.checkBusy = false;
    this.isDisabledHL = true;
    this.isDisabledEL = true;

    this.getImprimantes();
    this.getDroitTimbre();
    this.getDocsByCodeLivraison();
    if (this.document !== undefined && this.documents !== undefined) {
      if (this.document.id !== undefined) {
        this.documentSuivantId = this.document.id + 1;
        this.documentId = this.document.id;
      }

      this.documents.forEach((d, i, array) => {
        if (d.id === this.documentId) {
          this.documentEncours = i;
        }
      });

      // for (let n = 0; n <= this.documents.length; n++) {
      //  if(this.documents[n].id===this.documentId){
      //    this.documentEncours = n;
      //  }else{
      //    this.documentEncours = -1;
      //  }
      // }

      //   this.documentEncours = this.documents.indexOf(this.document);

      this.documentSuivantIndex = this.documentEncours + 1;
      this.docsLenght = this.documents.length;
      this.documentRestant = this.documents.length - (this.documentSuivantIndex + 1);
      this.docRestant = this.documents.length - (this.documentEncours + 1);
    }
  }
  getImprimantes(): void {
    const arg = [];
    arg.push('--printers');
    this._electronService.ipcRenderer.send('getprinters', arg);
  }
  cancel(): void {
    this.activeModal.dismiss();
  }
  doPrint(): void {
    const prn: any = this.reimprimeForm.value.imprimante.name;
    console.log('prn', prn);
    console.log('nom imprimante', this.reimprimeForm.value.imprimante.name);
    if (prn && this.printService.printObservers[prn]) {
      this.toastr.error(
        `l'imprimante est occupée par une réimpression encours :${String(this.reimprimeForm.value.imprimante.name)}`,
        'erreur'
      );
      return;
    }
    this.codeReimpression = localStorage.getItem('codeReimpression');
    if (this.reimprimeForm.value.password === this.codeReimpression) {
      switch (this.reimprimeForm.value.printChoise) {
        case '1':
          this.printALl();
          break;
        case '2':
          if (this.codeLivraison !== undefined) {
            this.documentService.findAllByLivraison(this.codeLivraison).subscribe(
              res => {
                this.printableDocs = res;
                if (this.documentEncours !== -1) {
                  for (let n = this.documentEncours; n <= this.documentEncours + Number(this.reimprimeForm.value.nbrPagesEnCours); n++) {
                    this.docsForPrint?.push(this.printableDocs[n]);
                  }
                }
              },
              err => {
                console.log(err);
              }
            );
          }
          console.log('liste de réimpression case 2', this.printableDocs);
          this.length = this.printableDocs?.length;
          console.log('length', this.length);
          this.testCompteur(this.printableDocs);
          break;
        case '3':
          if (this.codeLivraison !== undefined) {
            this.documentService.findAllByLivraison(this.codeLivraison).subscribe(res => {
              this.printableDocs = res;
              if (this.documentSuivantIndex !== undefined && this.documentRestant !== -1) {
                for (let n = this.documentSuivantIndex; n <= this.documentSuivantIndex + Number(this.reimprimeForm.value.nbrPages); n++) {
                  this.docsForPrint?.push(this.printableDocs[n]);
                }
              }
              console.log('liste de réimpression case 3', this.printableDocs);
              this.length = this.printableDocs?.length;
              console.log('length', this.length);
              this.testCompteur(this.printableDocs);
            });
          }

          break;
      }
    } else {
      this.toastr.error(`le code réimpression est erroné :${String(this.reimprimeForm.value.password)}`, 'erreur');
    }
  }

  async testCompteur(list: any[]): Promise<any> {
    console.log('testCompteur methode', list);
    const test = list[list.length - 1];
    console.log('test', test);
    for (let i = 0; i < list.length; i++) {
      console.log('foreach', list[i].id);
      const res = await this.documentService.findTest(list[i].id);
      console.log('resr', res.body);
      if (res.body.compteur >= 3) {
        this.nombreTest++;
        console.log('nombreCompteur', this.nombreTest);
      }
    }
    console.log('resultat', this.nombreTest);
    if (this.nombreTest > 0) {
      this.toastr.error('vous avez réimprimer ce document plus que 3 fois');
    } else {
      this.doPrintList(this.docsForPrint);
    }
  }

  async testCompteur1(list: any[], livraison: any): Promise<any> {
    console.log('testCompteur methode', list);
    const test = list[list.length - 1];
    console.log('test', test);
    for (let i = 0; i < list.length; i++) {
      console.log('foreach', list[i].id);
      const res = await this.documentService.findTest(list[i].id);
      console.log('resr', res.body);
      if (res.body.compteur >= 3) {
        this.nombreTest++;
        console.log('nombreCompteur', this.nombreTest);
      }
    }
    console.log('resultat', this.nombreTest);
    if (this.nombreTest > 0) {
      this.toastr.error('vous avez réimprimer ce document plus que 3 fois');
    } else {
      this.toastr.info('Réimpression en cours...');
      if (livraison.enycryptedDocs.length !== 0) {
        for (let i = 0; i < livraison.enycryptedDocs.length; i++) {
          console.log('document reimprime id', livraison.enycryptedDocs[i].id);
          this.documentService.find(livraison.enycryptedDocs[i].id).subscribe(
            res => {
              this.documentToUpdate = res.body;
              console.log('document a modifier', this.documentToUpdate);
            },
            err => {
              console.log('erreur', err);
            },
            () => {
              console.log('document before update', this.documentToUpdate);
              this.documentToUpdate.motif = this.reimprimeForm.value.motif;

              this.documentToUpdate.compteur = parseInt(this.documentToUpdate.compteur.toString(), 10) + 1;
              console.log('document after update', this.documentToUpdate);
              this.subscribeToSaveResponse(this.documentService.updateMotif(this.documentToUpdate));
            }
          );
        }
      }
      if (livraison.enycryptedDocs.length !== 0) {
        livraison.key = localStorage.getItem('privateKey');
        livraison.nomImprimante = this.reimprimeForm.value.imprimante;
        livraison.nombreDocument = livraison.enycryptedDocs.length;
        livraison.typeLot = this.reimprimeForm.value.nombreVoucherLot;

        livraison.codeDistributeur = this.codeDistributeur;

        // console.log('distributeur',livraison.codeDistributeur);
        livraison.indexDocument = 0;
        //  console.log('bonsoir');
        const printJob = this.printService.startPrint(livraison);
        //   this.printService.printJobs[livraison.nomImprimante] = printJob;
        this.printService.printJobs.push(livraison);
        printJob.subscribe({
          next: value => {
            livraison.avancement = value;
            console.log('jobs ', this.printService.printJobs);
          },
          error: error => {
            this.printService.printJobs.forEach((l, index) => {
              const myarray = this.printService.printJobs;
              if (l.nomImprimante === livraison.nomImprimante) {
                setTimeout(function () {
                  myarray.splice(index, 1), 1000;
                });
              }
            });
            this.toastr.error("erreur d'impression", 'erreur');
            this.isDisabled = false;
          },
          complete: () => {
            this.printService.printJobs.forEach((l, index) => {
              const myarray = this.printService.printJobs;
              if (l.nomImprimante === livraison.nomImprimante) {
                setTimeout(function () {
                  myarray.splice(index, 1), 1000;
                });
              }
            });
            console.log(this.printService.printJobs);
            console.log('DONE!');
            this.toastr.success('Réimpression avec succès!');
            this.isDisabled = false;
            this.activeModal.dismiss();
          },
        });
        console.log(' i am after async');
      }
    }
  }
  reimprime(document2: any): void {
    //const printer = this.document?.printer;
    const printer = this.reimprimeForm.value.imprimante ? this.reimprimeForm.value.imprimante : document2?.printer;
    const prn: any = printer;
    if (prn && this.printService.printObservers[prn]) {
      this.toastr.error(`l'imprimante est occupée par une réimpression encours :${String(printer)}`, 'erreur');
      this.cancel();
      return;
    }
    const livraison: Livraison = new Livraison();

    this.codeReimpression = localStorage.getItem('codeReimpression');
    if (this.reimprimeForm.value.password === this.codeReimpression) {
      livraison.nomImprimante = printer;
      livraison.droitTimbre = this.droitTimbre;
      livraison.codeDistributeur = this.codeDistributeur;
      if (document2?.id) {
        this.documentService.getFailedDocument(document2.id).subscribe(
          res => {
            livraison.enycryptedDocs = new Array<EncryptedDoc>(res);
          },
          err => {
            console.log('error  to get docuemnt list %', err);
          },
          () => {
            if (livraison.enycryptedDocs.length !== 0) {
              livraison.key = localStorage.getItem('privateKey');

              livraison.nomImprimante = printer;

              livraison.nombreDocument = 1;
              //   livraison.typeLot = this.printForm.value.nombreVoucherLot;
              livraison.indexDocument = 0;
              this.isDisabled = true;
              const printJob = this.printService.startPrint(livraison);
              //  this.printService.printJobs[livraison.nomImprimante] = livraison;
              //this.printService.printJobs.push(livraison);
              printJob.subscribe({
                next: value => (livraison.avancement = value),
                //console.log('next ', livraison.nomImprimante, value);
                error: error => {
                  this.activeModal.close('error');

                  //this.printService.printJobs = [];
                  this.activeModal.dismiss();
                },
                complete: () => {
                  console.log('DONE!');
                  this.activeModal.close('success');

                  //this.printService.printJobs = [];
                  this.activeModal.dismiss();
                },
              });
              console.log(' i am after async');
            }
          }
        );
      }
    } else {
      this.toastr.error(`le code réimpression est erroné :${String(this.reimprimeForm.value.password)}`, 'erreur');
    }
  }

  getDroitTimbre(): void {
    this.documentService.getDroitTimbre().subscribe(
      res => {
        this.droitTimbre = res;
      },
      err => {
        console.log(err);
      }
    );
  }
  getDocsByCodeLivraison(): void {
    if (this.codeLivraison !== undefined) {
      this.documentService.findAllByLivraison(this.codeLivraison).subscribe(
        res => {
          this.printableDocs = res;
          this.totalPages = this.printableDocs.length;
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  printALl(): void {
    this.isDisabled = true;
    const prn: any = this.reimprimeForm.value.imprimante.name;
    if (prn && this.printService.printObservers[prn]) {
      this.toastr.error(
        `l'imprimante est occupée par une réimpression encours :${String(this.reimprimeForm.value.imprimante.name)}`,
        'erreur'
      );
      return;
    }

    const activeJobs: Livraison[] = this.printService.printJobs.filter(
      livraison => livraison.nomImprimante === this.reimprimeForm.value.imprimante.name
    );

    if (activeJobs.length === 0) {
      const livraison: Livraison = new Livraison();
      livraison.droitTimbre = this.droitTimbre;
      if (this.codeLivraison !== undefined) {
        this.documentService.findAllByLivraison(this.codeLivraison).subscribe(
          res => {
            livraison.enycryptedDocs = res;
          },
          err => {
            console.log('error  to get docuemnt list %', err);
          },

          () => {
            console.log('liste de réimpression case 1', livraison.enycryptedDocs);
            this.length = livraison.enycryptedDocs;
            console.log('length', this.length);
            this.testCompteur1(this.printableDocs, livraison);
          }
        );
      }
    }
  }
  setEnabledNbr1(): void {
    this.reimprimeForm.controls['nbrPages'].enable();
    this.reimprimeForm.controls['nbrPagesEnCours'].disable();
  }
  setEnabledNbr2(): void {
    this.reimprimeForm.controls['nbrPagesEnCours'].enable();
    this.reimprimeForm.controls['nbrPages'].disable();
  }
  setDisabled(): void {
    this.reimprimeForm.controls['nbrPages'].disable();
    this.reimprimeForm.controls['nbrPagesEnCours'].disable();
  }
  doPrintList(list: EncryptedDoc[]): void {
    console.log('doPrintList', list);
    const livraison: Livraison = new Livraison();
    livraison.droitTimbre = this.droitTimbre;
    livraison.enycryptedDocs = list;
    if (livraison.enycryptedDocs.length !== 0) {
      for (let i = 0; i < livraison.enycryptedDocs.length; i++) {
        console.log('document reimprime id', livraison.enycryptedDocs[i].id);
        this.documentService.find(livraison.enycryptedDocs[i].id).subscribe(
          res => {
            this.documentToUpdate = res.body;
            console.log('document a modifier', this.documentToUpdate);
          },
          err => {
            console.log('erreur', err);
          },
          () => {
            console.log('document before update', this.documentToUpdate);
            this.documentToUpdate.motif = this.reimprimeForm.value.motif;
            this.documentToUpdate.compteur = parseInt(this.documentToUpdate.compteur.toString(), 10) + 1;
            console.log('document after update', this.documentToUpdate);
            this.subscribeToSaveResponse(this.documentService.updateMotif(this.documentToUpdate));
          }
        );
      }
    }
    if (livraison.enycryptedDocs.length !== 0) {
      livraison.key = localStorage.getItem('privateKey');
      livraison.nomImprimante = this.reimprimeForm.value.imprimante;
      livraison.nombreDocument = livraison.enycryptedDocs.length;
      livraison.typeLot = this.reimprimeForm.value.nbrPages;

      livraison.codeDistributeur = this.codeDistributeur;
      console.log('distributeur', livraison.codeDistributeur);

      // console.log('distributeur',livraison.codeDistributeur);
      livraison.indexDocument = 0;
      //  console.log('bonsoir');
      console.log('livraison.nomImprimante :', livraison.nomImprimante);
      console.log('livraison.nomImprimante.name :', livraison.nomImprimante.name);
      const printJob = this.printService.startPrint(livraison);
      //   this.printService.printJobs[livraison.nomImprimante] = printJob;
      this.printService.printJobs.push(livraison);
      console.log(' printjobs', this.printService.printJobs);
      console.log(' i am  before async');
      printJob.subscribe({
        next: value => {
          livraison.avancement = value;
          console.log('next ', livraison.nomImprimante, value);
          console.log('jobs ', this.printService.printJobs);
        },
        error: error => {
          console.error('problem : ', error.toString());
          this.printService.printJobs.forEach((l, index) => {
            const myarray = this.printService.printJobs;
            if (l.nomImprimante === livraison.nomImprimante) {
              setTimeout(function () {
                myarray.splice(index, 1), 1000;
              });
            }
          });
          this.toastr.error('erreur de réimpression', 'erreur');
        },
        complete: () => {
          this.printService.printJobs.forEach((l, index) => {
            const myarray = this.printService.printJobs;
            if (l.nomImprimante === livraison.nomImprimante) {
              setTimeout(function () {
                myarray.splice(index, 1), 1000;
              });
            }
          });
          console.log(this.printService.printJobs);
          console.log('DONE!');
          this.toastr.success('Réimpression avec succès!');
          this.activeModal.dismiss();
        },
      });
      console.log(' i am after async');
    }
  }

  printDoc(): void {
    console.log('motif', this.reimprimeForm.value.motif);
    if (this.reimprimeForm.value.motif === '') {
      this.toastr.error(`champ motif obligatoire `, 'erreur');
      return;
    }
    if (this.document?.id !== undefined) {
      console.log('document to update', this.document);
      this.document.motif = this.reimprimeForm.value.motif;
    }

    const printer = this.reimprimeForm.value.imprimante ? this.reimprimeForm.value.imprimante : this.document?.printer;
    const prn: any = this.reimprimeForm.value.imprimante.name;
    console.log('prn', prn);
    if (prn && this.printService.printObservers[prn]) {
      this.toastr.error(
        `l'imprimante est occupée par une réimpression encours :${String(this.reimprimeForm.value.imprimante.name)}`,
        'erreur'
      );
      //this.isPrinting = false;
      //this.cancel();
      return;
    }
    const livraison: Livraison = new Livraison();
    console.log('document a reimprimer', this.document);
    console.log('mdp', this.reimprimeForm.value.password);
    this.codeReimpression = localStorage.getItem('codeReimpression');
    console.log('code', this.codeReimpression);
    if (this.reimprimeForm.value.password === this.codeReimpression) {
      if (this.document?.compteur !== undefined && this.document?.compteur < 3) {
        this.document.compteur = this.document.compteur + 1;
        this.subscribeToSaveResponse(this.documentService.updateMotif(this.document));
      } else {
        this.toastr.error('vous avez réimprimer ce document plus que 3 fois');
        return;
      }

      console.log(printer);
      this.toastr.info('Réimpression en cours...');
      this.isPrinting = true;
      livraison.nomImprimante = printer;

      if (this.document?.id) {
        this.documentService.getFailedDocument(this.document.id).subscribe(
          res => {
            livraison.enycryptedDocs = new Array<EncryptedDoc>(res);
          },
          err => {
            this.isPrinting = false;
            console.log('error  to get docuemnt list %', err);
          },
          () => {
            if (livraison.enycryptedDocs.length !== 0) {
              livraison.key = localStorage.getItem('privateKey');
              if (this.document !== undefined) {
                livraison.nomImprimante = printer;
                livraison.droitTimbre = this.droitTimbre;
                livraison.codeDistributeur = this.codeDistributeur;
                console.log('distro', livraison.codeDistributeur);
              }
              livraison.nombreDocument = 1;
              //   livraison.typeLot = this.printForm.value.nombreVoucherLot;
              livraison.indexDocument = 0;
              //  console.log('bonsoir');
              console.log(livraison.nomImprimante);
              this.isDisabled = true;
              const printJob = this.printService.startPrint(livraison);
              //  this.printService.printJobs[livraison.nomImprimante] = livraison;
              //this.printService.printJobs.push(livraison);
              console.log();
              console.log(' i am  before async');
              printJob.subscribe({
                next: value => {
                  livraison.avancement = value;
                  console.log('next ', livraison.nomImprimante, value);
                  console.log('jobs ', this.printService.printJobs);
                },
                error: error => {
                  console.error('problem : ', error.toString());
                  this.printService.printJobs.forEach((l, index) => {
                    const myarray = this.printService.printJobs;
                    if (l.nomImprimante === livraison.nomImprimante) {
                      setTimeout(function () {
                        myarray.splice(index, 1), 1000;
                      });
                    }
                  });
                  this.toastr.error('erreur de réimpression', 'erreur');
                  // if (this.document?.id) {
                  //   this.documentService.UpdateStatusFailedOfDocumentById(this.document.id, printer).subscribe(
                  //     res => {
                  //       console.log('notokstatus1');
                  //     },
                  //     err => {
                  //       this.isPrinting = false;
                  //       console.log('notokstatus2');
                  //     }
                  //   );
                  // }
                  console.log('notokstatus3');
                  this.isPrinting = false;
                  this.activeModal.dismiss();
                },
                complete: () => {
                  this.printService.printJobs.forEach((l, index) => {
                    const myarray = this.printService.printJobs;
                    if (l.nomImprimante === livraison.nomImprimante) {
                      setTimeout(function () {
                        myarray.splice(index, 1), 1000;
                      });
                    }
                  });
                  console.log(this.printService.printJobs);
                  console.log('DONE!');
                  this.toastr.success('Réimpression avec succès!');
                  console.log('okstatus3');
                  this.isPrinting = false;
                  this.activeModal.dismiss();
                },
              });
              console.log(' i am after async');
            }
          }
        );
      }
    } else {
      this.toastr.error(`le code réimpression est erroné :${String(this.reimprimeForm.value.password)}`, 'erreur');
    }
  }
  selectChangeHandler(event: any): void {
    this.btnDisabled = true;
    this.isDisabledEL = true;
    this.isDisabledHL = true;
    this.checkBusy = false;

    //update the ui
    this.imprimante = event;
    const args: any[] = [];
    args.push(this.imprimante?.ip);
    args.push(this.imprimante?.name);
    this._electronService.ipcRenderer.send('test status imprimante', args);
    this._electronService.ipcRenderer.on('verif', (evt: any, message1: any) => {
      if (message1.status === 'busy') {
        this.ngZone.run(() => {
          this.checkBusy = true;
        });
      } else if (message1.status === 'free') {
        this.ngZone.run(() => {
          this.checkBusy = false;
        });
      }
    });
    this._electronService.ipcRenderer.on('printOffline', (evt: any, message: any) => {
      if (message.status === 'ok') {
        this.ngZone.run(() => {
          this.btnDisabled = true;
          this.isDisabledHL = true;
          this.isDisabledEL = false;
          this.statusMessage = message.name;
        });
        // this.toastr.error(`l'imprimante est hors ligne :${String(message.name)}`, 'Erreur' );
      } else if (message.status === 'nok') {
        this.ngZone.run(() => {
          this.btnDisabled = false;
          this.isDisabledHL = false;
          this.isDisabledEL = true;

          this.statusMessage = message.name;
          // this.toastr.success('Imprimante en ligne', 'Success' );
        });
      }
    });
  }
  previousState(): void {
    window.history.back();
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocument>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }
  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    console.log('update');
    this.isSaving = true;
  }
}
