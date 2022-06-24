import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Fichier } from 'app/entities/fichier/fichier.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FichierService } from 'app/entities/fichier/service/fichier.service';
import { IDistributeur } from 'app/entities/distributeur/distributeur.model';
import { DistributeurDeleteDialogComponent } from 'app/entities/distributeur/delete/distributeur-delete-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReimpressionConfirmComponent } from 'app/layouts/print/reimpression-confirm/reimpression-confirm.component';
import { Document, IDocument } from 'app/entities/document/document.model';
import { DocumentService } from 'app/entities/document/service/document.service';
import { ToastrService } from 'ngx-toastr';
import { DistributeurService, EntityResponseType } from 'app/entities/distributeur/service/distributeur.service';
import * as dayjs from 'dayjs';

@Component({
  selector: 'inetum-reimpression',
  templateUrl: './reimpression.component.html',
  styleUrls: ['./reimpression.component.scss'],
})
export class ReimpressionComponent implements OnInit {
  documents: Document[] = [];
  docsToRePrint: Document[] = [];
  documentsByPoste: Document[] = [];
  document?: Document;
  fichiers?: Fichier[];
  fileSelected?: Fichier;
  idFichier?: any;
  idDocument?: any;
  authorities: string[] = [];
  disabledPrint = false;
  p?: number = 1;
  distributeur?: EntityResponseType;
  idDistributeur?: any;
  codeReimpression?: any;
  filepwd?: any;
  filepath?: any;
  activeTab = 1;
  disabledReimp = false;
  @Output() codeDistributeurEmitter = new EventEmitter<any>();

  printForm = this.fb.group({
    nombre: [],
    nombreVoucherLot: [],
    imprimante: [],
    fichier: [],
    count: [],
    rest: [],
  });
  reimprimeForm = this.fb.group({
    id: [],
    fichier: [],
    password: [''],
    serialCode: [''],
  });
  selectedDeviceObj?: Fichier;
  noResult = false;
  codeDistributeur: any;
  codeLivraison?: string;
  totalOffset = 0;

  constructor(
    protected router: Router,
    private fichierService: FichierService,
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    protected modalService: NgbModal,
    private toastr: ToastrService,
    private distributeurService: DistributeurService
  ) {}

  ngOnInit(): void {
    this.getFichier();
  }

  verifReimpression(compteur: any): boolean {
    if (compteur >= 3) {
      return true;
    } else {
      return false;
    }
  }

  // verifReimpressionSerialCode(document: Document[]): any{
  //   let cmp
  //   document.forEach(doc => {
  //     if (doc.compteur !== undefined){
  //       if (doc.compteur >= 3){
  //         cmp =1;
  //       } else {
  //         cmp =0;
  //        }
  //     }
  //   });
  //   if (cmp = 1) {
  //     return true
  //   }
  //   else  if (cmp = 0){
  //     return false
  //   }
  //
  // }

  getDocuments(): void {
    this.documentService.findAllHistoriqueByPoste().subscribe(res => {
      this.documentsByPoste = res;
    });
  }
  reset(): void {
    this.getDocumentsFailedAndPostConnect();
  }
  rechercheParFichier(): void {
    console.log('fichier selectionner', this.printForm.value.fichier);
    this.docsToRePrint = this.documentsByPoste.filter(doc => doc.lot1?.fichier?.path === this.printForm.value.fichier);
    this.codeDistributeur = this.docsToRePrint[0].poste?.distributeur?.code;
    console.log('fichier aprés filtre', this.documents);
  }

  getDocumentsFailedAndPostConnect(): void {
    this.documentService.findByPrintStatusAndPosteConnect().subscribe(
      res => {
        this.documents = res;
        console.log('listes des documents', this.documents);
        if (this.documents.length > 0) {
          this.idDistributeur = this.documents[0].lot1?.fichier?.distributeur?.id;
          console.log('iddis', this.idDistributeur);
          this.findDistributeurById(this.idDistributeur);
        }
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
        console.log('code réimpression', this.codeReimpression);
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
    this.fichierService.findAll().subscribe(res => {
      this.fichiers = res;
    });
  }

  previousState(): void {
    window.history.back();
  }

  reimprime(): void {
    const modalRef = this.modalService.open(ReimpressionConfirmComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.document = this.document;
    modalRef.componentInstance.activeTab = this.activeTab;
    console.log('code distro', this.codeDistributeur);
    modalRef.componentInstance.codeDistributeur = this.codeDistributeur;
    modalRef.componentInstance.documents = this.documents;
    modalRef.componentInstance.codeLivraison = this.codeLivraison;
  }
  selectedFichier(): void {
    console.log(this.selectedDeviceObj?.id);
    this.filepwd = this.selectedDeviceObj?.password;
    this.filepath = this.selectedDeviceObj?.path;
    this.idFichier = this.reimprimeForm.value.id;

    // this.fichierService.findById(this.idFichier).subscribe(
    //   res => {
    //     this.fileSelected = res;
    //     this.filepwd =  this.fileSelected.password;
    //     this.filepath = this.fileSelected.path;
    //  //   console.log(this.fileSelected);
    //   },
    //   err => {
    //     err;
    //   }
    // );
  }

  checkNumberLot(): boolean {
    const number = this.printForm.get('nombre')?.value;
    const rest = this.printForm.get('rest')?.value;
    if (rest < number) {
      return true;
    }
    return false;
  }
  getVal(val: any): number {
    return +val + 50;
  }
  getVal1(val: any): number {
    return +val + 1;
  }

  getDoc(): void {
    this.documents = [];
    this.noResult = false;
    this.fichierService.findBySerial(this.filepath, this.filepwd, this.reimprimeForm.value.serialCode).subscribe(
      res => {
        this.documents = res;
        console.log('docs', res);
        this.fichierService.getIdDocBySerial(this.filepath, this.filepwd, this.reimprimeForm.value.serialCode).subscribe(
          data => {
            console.log(data);
            this.document = data;
          },
          err => {
            err;
          }
        );
        // this.totalOffset = this.totalOffset + Number(this.documents[0]?.lot2?.offset);
        if (this.documents.length !== 0) {
          this.documents.forEach(d => {
            if (d.lot2?.offset !== undefined) {
              const x = d.lot2.offset;
              this.totalOffset = x;
            } else {
              if (d.lot1?.offset !== undefined) {
                const x = d.lot1.offset;
                this.totalOffset = x;
              }
            }
          });
        }

        console.log('total:', this.totalOffset + 50);

        if (this.documents.length !== 0) {
          this.codeLivraison = this.documents[0].livraison;
          this.codeDistributeur = this.documents[0].poste?.distributeur?.code;
          console.log(this.codeDistributeur);
        }
        if (this.documents.length === 0) {
          this.noResult = true;
          this.toastr.error('numéro de série introuvable');
        }
      },
      err => {
        err;
      }
    );
  }

  doReprint(document: Document): void {
    const modalRef = this.modalService.open(ReimpressionConfirmComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.document = document;
    console.log('code distro', this.codeDistributeur);
    modalRef.componentInstance.codeDistributeur = this.codeDistributeur;
    modalRef.componentInstance.activeTab = this.activeTab;
    modalRef.componentInstance.codeLivraison = this.codeLivraison;
  }

  dateFormat(date: dayjs.Dayjs | any): string {
    return dayjs(date).format('D MMM YYYY HH:mm:ss');
  }
}
