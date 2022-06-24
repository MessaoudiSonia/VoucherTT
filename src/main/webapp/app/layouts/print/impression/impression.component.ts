import { Component, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FichierService } from 'app/entities/fichier/service/fichier.service';
import { Fichier } from 'app/entities/fichier/fichier.model';
import { DocumentService } from 'app/entities/document/service/document.service';
import { PosteService } from 'app/entities/poste/service/poste.service';
import { ElectronService } from 'ngx-electron';
import { Livraison } from 'app/entities/print/print';
import { PrintService } from 'app/layouts/print/impression/print.service';
import { ToastrService } from 'ngx-toastr';
import { DistributeurService, EntityResponseType } from 'app/entities/distributeur/service/distributeur.service';
import { Imprimante } from 'app/layouts/print/impression/imprimante';

@Component({
  selector: 'inetum-impression',
  templateUrl: './impression.component.html',
  styleUrls: ['./impression.component.scss'],
})
export class ImpressionComponent implements OnInit {
  printJobs!: Livraison[];
  fichiers?: Fichier[];
  restfiles?: any;
  files?: Fichier[];
  key?: any;
  privateKey?: any;
  droitTimbre?: string;
  imprimantes?: string[];
  listeImprimante?: Imprimante[] = [];
  imprimante?: Imprimante;
  imprimantesFiltred?: string[];
  codeDistributeur?: any;
  fileSelected?: Fichier;
  idFichier?: any;
  codeReimpression?: any;
  ligneRestant?: any;
  authorities: string[] = [];
  distributeur?: EntityResponseType;
  idDistributeur?: any;
  printing?: boolean = false;
  btnDisabled?: boolean;
  isDisabledHL?: boolean;
  isDisabledEL?: boolean;
  statusMessage?: string;
  statusMessage1?: string;
  checkBusy?: boolean;
  printForm = this.fb.group({
    nombre: [],
    nombreVoucherLot: [],
    imprimante: [],
    fichier: [],
    count: [],
    rest: [],
  });

  constructor(
    protected router: Router,
    private fichierService: FichierService,
    private route: ActivatedRoute,
    public printService: PrintService,
    private fb: FormBuilder,
    private documentService: DocumentService,
    private posteService: PosteService,
    private _electronService: ElectronService,
    private toastr: ToastrService,
    private distributeurService: DistributeurService,
    private ngZone: NgZone
  ) {
    this.isDisabledHL = true;
    this.isDisabledEL = true;
    this.checkBusy = false;

    this._electronService.ipcRenderer.on('lesImprimantes', (evt: any, message: Imprimante[]) => {
      //this.listeImprimante=message;
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
    // console.log('nom Imprimante',this.printForm.value.imprimante.name);
    // const prn: any = this.printForm.value.imprimante.name;
    // console.log('job',this.printService.printObservers[prn]);
    // console.log('job1',this.printService.printObservers[prn]);
    // if(this.printForm.value.imprimante!=null &&
    //   this.printService.printObservers[this.printForm.value.imprimante.name]!==undefined
    //   && this.printService.printObservers[this.printForm.value.imprimante.name].length>0)
    // {
    //   console.log('JobExiste');
    //   this.toastr.error("il y a une impression en cours");
    // }else {
    //   console.log('noJob');
    //   const arg: (string | number | null | undefined)[] = [];
    //   arg.push(this.printService.printObservers.length);
    // this._electronService.ipcRenderer.send('noJob',arg);
  }
  ngOnInit(): void {
    this.btnDisabled = true;
    this.checkBusy = false;
    this.isDisabledHL = true;
    this.isDisabledEL = true;

    this.getFichier();
    this.getDroitTimbre();
    this.posteService.findPrivateKey().subscribe(
      res => {
        this.privateKey = res;
      },
      err => {
        console.log(err);
      },
      () => {
        localStorage.setItem('privateKey', this.privateKey);
      }
    );
    this.getImprimantes();
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
  findDistributeurById(id: number): void {
    this.distributeurService.find(id).subscribe(
      res => {
        this.distributeur = res;
        this.codeReimpression = this.distributeur.body?.codeReimpression;
        this.codeDistributeur = this.distributeur.body?.code;
      },
      err => {
        console.log(err);
      },
      () => {
        localStorage.setItem('codeReimpression', this.codeReimpression);
      }
    );
  }

  getFichier(): void {
    this.fichierService.findAll().subscribe(
      res => {
        this.fichiers = res;
        this.fichiers = this.fichiers.filter(fichier => fichier.password);
      },
      err => {
        console.log(err);
      },
      () => {
        if (this.fichiers) {
          this.idDistributeur = this.fichiers[0].distributeur?.id;
          this.fichiers.forEach(file =>
            this.fichierService.findLigneRestant(file.id as number).subscribe(
              res => {
                this.restfiles = res.body;
                this.files = res;
              },
              err => {
                console.log(err);
              },
              () => {
                if (this.restfiles === 0) {
                  this.fichiers = this.fichiers?.filter(fichier => fichier.id !== file.id);
                }
              }
            )
          );
        }

        this.findDistributeurById(this.idDistributeur);
        //  }
      }
    );
  }
  reset(): void {
    console.log('reset');
    this.printForm.get('nombreVoucherLot')?.setValue(null);
    this.printForm.get('nombre')?.setValue(null);
    this.printForm.get('imprimante')?.setValue(null);
    this.printForm.get('fichier')?.setValue(null);
    this.printForm.get('count')?.setValue(null);
    this.printForm.get('rest')?.setValue(null);
  }

  getImprimantes(): void {
    const arg = [];
    arg.push('--printers');
    this._electronService.ipcRenderer.send('getprinters', arg);
  }

  previousState(): void {
    window.history.back();
  }

  imprime(): void {
    this.printing = true;
    console.log('idDistributeur', this.idDistributeur);
    this.findDistributeurById(this.idDistributeur);
    this.getDroitTimbre();

    const prn: any = this.printForm.value.imprimante.name;
    console.log('prn', prn);
    if (prn && this.printService.printObservers[prn]) {
      this.toastr.error(`l'imprimante est occupée par une impression encours :${String(this.printForm.value.imprimante.name)}`, 'erreur');
      return;
    }
    const activeJobs: Livraison[] = this.printService.printJobs.filter(
      livraison => livraison.nomImprimante === this.printForm.value.imprimante
    );
    console.log('activateJobLength', activeJobs.length);
    if (activeJobs.length === 0) {
      console.log('ready to Print');
      const livraison: Livraison = new Livraison();
      livraison.droitTimbre = this.droitTimbre;
      if (this.printForm.value.nombreVoucherLot === '50') {
        livraison.isDouble = 'false';
      } else {
        livraison.isDouble = 'true';
      }
      this.documentService
        .getNDocuments(this.printForm.value.nombre, livraison.isDouble, this.printForm.value.fichier, this.printForm.value.imprimante?.name)
        .subscribe(
          res => {
            livraison.enycryptedDocs = res;
            console.log('docCrypted', livraison.enycryptedDocs);
          },
          err => {
            console.log('error  to get docuemnt list %', err);
          },

          () => {
            if (livraison.enycryptedDocs.length !== 0) {
              livraison.key = localStorage.getItem('privateKey');
              livraison.nomImprimante = this.printForm.value.imprimante;
              livraison.nombreDocument = this.printForm.value.nombre;
              livraison.typeLot = this.printForm.value.nombreVoucherLot;
              livraison.codeDistributeur = this.codeDistributeur;
              livraison.indexDocument = 0;
              const printJob = this.printService.startPrint(livraison);
              //   this.printService.printJobs[livraison.nomImprimante] = printJob;
              this.printService.printJobs.push(livraison);
              printJob.subscribe({
                next: value => {
                  livraison.avancement = value;
                  this.printing = true;
                },
                error: error => {
                  this.printing = false;
                  this.printService.printJobs.forEach((l, index) => {
                    const myarray = this.printService.printJobs;
                    if (l.nomImprimante === livraison.nomImprimante) {
                      setTimeout(function () {
                        myarray.splice(index, 1), 1000;
                      });
                    }
                  });
                  this.toastr.error("erreur d'impression", 'erreur');
                  this.getRestOfLignes();
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
                  this.printing = false;
                  this.toastr.success('impression avec succès!');
                  this.getRestOfLignes();
                },
              });
            }
          }
        );
    }
  }

  getRestOfLignes(): void {
    this.fichierService.findLigneRestant(this.idFichier).subscribe(
      res => {
        this.ligneRestant = res;
      },
      err => {
        err;
      },
      () => {
        this.printForm.get('rest')!.setValue(this.ligneRestant.body);
      }
    );
  }

  selectedFichier(): void {
    this.idFichier = this.printForm.value.fichier;
    this.fichierService.findLigneRestant(this.idFichier).subscribe(
      res => {
        this.ligneRestant = res;
      },
      err => {
        err;
      },
      () => {
        this.printForm.get('rest')!.setValue(this.ligneRestant.body);
      }
    );
    this.fichierService.findById(this.idFichier).subscribe(
      res => {
        this.fileSelected = res;
      },
      err => {
        err;
      },
      () => {
        this.printForm.get('count')!.setValue(this.fileSelected!.count);
        // this.printForm.get('rest')!.setValue(this.fileSelected!.rest);}
        this.checkPrinting();
      }
    );
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
  checkPrinting(): boolean {
    if (this.printing === true) {
      return true;
    } else {
      return false;
    }
  }

  // const number = this.printForm.get('nombre')?.value;
  // const rest = this.printForm.get('rest')?.value;
  // if (rest < number) {
  //   return true;
  //   this.toastr.info('merci de vérifier le nombre de document..');}
  //  else
  //  {return false;}
  // }
}
