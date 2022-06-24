import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from 'app/entities/document/service/document.service';
import { Document } from 'app/entities/document/document.model';
import { PrintStatus } from 'app/entities/enumerations/print-status.model';
import { Poste } from 'app/entities/poste/poste.model';
import { PosteService } from 'app/entities/poste/service/poste.service';
import { LoginService } from 'app/login/login.service';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';
import { AccountService } from 'app/core/auth/account.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { LANGUAGES } from 'app/config/language.constants';
import { DistributeurService } from 'app/entities/distributeur/service/distributeur.service';
import { Distributeur } from 'app/entities/distributeur/distributeur.model';
import { HistoriqueService } from 'app/layouts/print/historique/historique.service';
import { Historique } from 'app/layouts/print/historique/historique.model';
import * as dayjs from 'dayjs';
import { Fichier } from 'app/entities/fichier/fichier.model';
import { PrintService } from 'app/layouts/print/impression/print.service';
import { ElectronService } from 'ngx-electron';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'inetum-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss'],
})
export class HistoriqueComponent implements OnInit {
  status = null;
  UNDEFINED = 'UNDEFINED';
  public prinStatus = Object.values(PrintStatus);
  documents: Document[] = [];
  historiques: Historique[] = [];
  documentsConsumed: Document[] = [];
  documentsFinal: Document[] = [];
  userConnect?: any;
  userConnectId?: any;
  userConnectId1?: any;
  documentsFailed?: Document[];
  postes?: Poste[];
  distributeurs?: Distributeur[];
  docSelected?: Document;
  idDoc?: any;
  authorities: string[] = [];
  inProduction?: boolean;
  languages = LANGUAGES;
  openAPIEnabled?: boolean;
  version = '';
  err = '';
  nbr?: number = 50;
  p?: number = 1;
  lists: Historique[] = [];
  items: Historique[] = [];
  fichier: Fichier | undefined;
  oneHistory: Historique | undefined;
  statusPrint: PrintStatus | undefined;
  livraisonID = '';

  searchForm = this.fb.group({
    id: [],
    creation: [],
    impression: [],
    printer: [],
    printStatus: [null],
    lot1: [],
    lot2: [],
    posteId: [localStorage.getItem('podteId')],
    distributeur: [],
  });
  postId?: number;

  constructor(
    protected router: Router,
    private documentsService: DocumentService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private posteService: PosteService,
    private loginService: LoginService,
    private translateService: TranslateService,
    private sessionStorage: SessionStorageService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private distributeurService: DistributeurService,
    private historiqueService: HistoriqueService,
    public printService: PrintService,
    private electronSevice: ElectronService,
    private toastr: ToastrService
  ) {
    try {
      this.electronSevice.ipcRenderer.on('verifClose', (evt: any, message1: any) => {
        console.log('length', Object.values(this.printService.printObservers).length);
        if (Object.values(this.printService.printObservers).length !== 0) {
          this.toastr.error('il ya une impression en cours');
        } else {
          this.electronSevice.ipcRenderer.send('noJob');
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  ngOnInit(): void {
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });
    this.getDocument();
    this.getAllDistribteurs();
    this.getHistory();
  }

  // getDocument(): void {
  //   this.documentsService.findAll().subscribe(res => {
  //     this.documents = res;
  //     this.userConnect = res[0].poste?.nom;
  //   });
  // }
  getHistory(): void {
    this.historiques = [];
    this.historiqueService.findAll().subscribe(res => {
      console.log('sorted list');
      this.historiques = this.sortHistory(res);
      // this.userConnect = res[0].poste?.nom;
    });
  }
  getDocument(): void {
    this.documentsService.findAllHistoriqueByPoste().subscribe(
      res => {
        this.documents = res;
        if (res[0] !== undefined) {
          console.log('undefined');
          this.userConnect = res[0].poste?.nom;
          this.userConnectId1 = res[0].poste?.id;
        }
      },
      err => {
        console.log(err);
      },
      () => {
        console.log('user', this.userConnect);
        console.log('poste id: ', this.userConnectId1);
        localStorage.setItem('podteId', this.userConnectId1);
        this.userConnectId = localStorage.getItem('podteId');
      }
    );
  }

  reset(): void {
    this.getDocument();
  }
  rechercheCriteria(): void {
    this.historiques = [];
    this.items = [];
    console.log(this.searchForm.value.prinStatus);
    if (this.searchForm.get('printStatus')?.value === 'TOUS') {
      console.log('ouuuuu');
      this.searchForm.get('printStatus')?.setValue(null);
      console.log('ouuuuu', this.searchForm.get('printStatus')?.value);
      this.searchForm.value.prinStatus = null;
    }
    console.log(this.searchForm.value.prinStatus);
    this.searchForm.get('posteId')?.setValue(localStorage.getItem('podteId'));
    console.log('user iddddd:', this.searchForm.get('posteId')?.value);
    console.log('search form', this.searchForm.value);
    this.historiqueService.findAllCriteria(this.searchForm.value).subscribe(res => {
      console.log('criteria: ', res);
      for (const list of res) {
        if (list.printStatus === PrintStatus.CONSUMED || list.printStatus === PrintStatus.FAILED) {
          this.items.push(list);
        }
      }
      this.historiques = this.sortHistory(this.items);
      console.log('user poste:', this.userConnectId);
      //   this.documents = this.documents.filter(doc => doc.poste?.nom === this.userConnect);
    });

    // let doc: Document[];
    // this.documentsService.findAll().subscribe(
    //   res => {
    //     this.documents = res;
    //     console.log(this.documents);
    //     doc = res;
    //   },
    //   err => {
    //     err;
    //   },
    //   () => {
    //     doc = doc.filter(
    //       d =>
    //         d.printer === this.searchForm.value.printer ||
    //         d.printStatus === this.searchForm.value.printStatus ||
    //         d.poste?.nom === this.searchForm.value.poste ||
    //         d.poste?.distributeur?.nom === this.searchForm.value.distributeur
    //     );
    //     this.documents = doc;
    //   }
    // );
    // console.log(this.documents);
  }

  rechercheCriteriaAdmin(): void {
    this.historiques = [];
    this.items = [];
    console.log('criteria', this.searchForm.value);
    console.log('value printStatus', this.searchForm.value.printStatus);
    if (this.searchForm.value.printStatus === 'TOUS') {
      this.searchForm.get('printStatus')?.setValue(null);
    }
    console.log('criteria2', this.searchForm.value);
    this.historiqueService.findAllCriteria(this.searchForm.value).subscribe(res => {
      for (const list of res) {
        if (list.printStatus === PrintStatus.CONSUMED || list.printStatus === PrintStatus.FAILED) {
          this.items.push(list);
        }
      }
      this.historiques = this.sortHistory(this.items);
      //this.historiques = res;
      //   this.documents = this.documents.filter(doc => doc.poste?.nom === this.userConnect);
    });
  }

  getAllPosteByDistributeur(): void {
    this.posteService.findAllByDistributeur(this.searchForm.value.distributeur).subscribe(
      res => {
        this.postes = res;
        console.log(res);
      },
      err => {
        err;
      }
    );
  }
  getAllDistribteurs(): void {
    this.distributeurService.findAll().subscribe(
      res => {
        console.log(res);
        this.distributeurs = res;
      },
      err => {
        err;
      }
    );
  }

  previousState(): void {
    window.history.back();
  }

  getVal(val: any): number {
    return +val + 50;
  }
  getVal2(val: any): number {
    return 50;
  }
  getVal1(val: any): number {
    return +val + 1;
  }
  getOffset(lot1: any, lot2: any): number {
    console.log(lot1);
    console.log(lot2);
    console.log('getoffset');
    if (lot2 - lot1 > 50) {
      return 100;
    } else {
      return 50;
    }
  }

  // getOffset(lot1: any, lot2: any): number {
  //   console.log(lot1);
  //   console.log(lot2);
  //   console.log("getoffset");
  //    return 50;
  // }

  getOffset1(lot1: any, lot2: any): number {
    console.log('getoffset1');
    return 100;
  }

  dateFormat(date: dayjs.Dayjs | any): string {
    return dayjs(date).format('D MMM YYYY HH:mm:ss');
  }

  sortHistory(listElements: Historique[]): Historique[] {
    this.lists = [];
    this.fichier = undefined;
    let offset1 = 0;
    let offset2 = 0;

    console.log('ici:', this.fichier);
    for (const item of listElements) {
      console.log(
        this.fichier?.path,
        ' === ',
        item.document?.lot1?.fichier?.path,
        ' &&',
        this.statusPrint,
        '===',
        item.printStatus,
        '&&',
        offset2,
        '===',
        item.document?.lot1?.offset,
        this.fichier?.distributeur?.id,
        '===',
        item.document?.lot1?.fichier?.distributeur?.id,
        '&&',
        this.postId,
        '===',
        item.document?.poste?.id
      );
      if (this.fichier === undefined) {
        this.fichier = item.document?.lot1?.fichier;
        if (item.document?.lot1?.offset !== undefined) {
          offset1 = item.document.lot1.offset;
        }
        if (item.livraison !== undefined) {
          this.livraisonID = item.livraison;
        }
        if (item.document?.poste !== undefined) {
          this.postId = item.document.poste.id;
        }
        if (item.document?.lot2?.offset !== undefined) {
          offset2 = item.document.lot2.offset + 50;
        }
        if (item.document?.lot2 === null) {
          offset2 = offset1 + 50;
        }
        console.log('new Item');
        console.log(item.document?.lot1?.fichier?.path);
        console.log('offset1', offset1);
        console.log('offset2', offset2);
        if (item.printStatus !== null) {
          this.statusPrint = item.printStatus;
        }
        this.oneHistory = item;
      } else if (
        this.fichier.path === item.document?.lot1?.fichier?.path &&
        this.statusPrint === item.printStatus &&
        offset2 === Number(item.document?.lot1?.offset) &&
        this.fichier.distributeur?.id === item.document?.lot1?.fichier?.distributeur?.id &&
        this.postId === item.document?.poste?.id &&
        this.livraisonID === item.livraison
      ) {
        if (item.document?.lot1?.offset !== undefined) {
          offset1 = item.document.lot1.offset;
        }

        if (item.document?.lot2?.offset !== undefined) {
          offset2 = item.document.lot2.offset + 50;
        }
        if (item.document?.lot2 === null) {
          offset2 = offset1 + 50;
        }

        console.log('same Item');
        console.log(item.document?.lot1?.fichier?.path);
        console.log('offset1', offset1);
        console.log('offset2', offset2);
        console.log('***');
        console.log(this.fichier.path);
        console.log('***');

        if (this.oneHistory?.document?.lot2?.offset !== undefined) {
          this.oneHistory.document.lot2.offset = offset2;
        }
      } else if (
        this.fichier.path !== item.document?.lot1?.fichier?.path ||
        this.statusPrint !== item.printStatus ||
        offset2 !== Number(item.document?.lot1?.offset) ||
        this.fichier.distributeur?.id !== item.document?.lot1?.fichier?.distributeur?.id ||
        this.postId !== item.document?.poste?.id ||
        this.livraisonID !== item.livraison
      ) {
        if (this.oneHistory !== undefined) {
          if (this.oneHistory.document?.lot2?.offset !== undefined) {
            this.oneHistory.document.lot2.offset = offset2 - 50;
          }
          if (this.oneHistory.document?.lot2 === null) {
            this.oneHistory.document.lot2 = { offset: offset2 - 50 };
          }
          this.lists.push(this.oneHistory);
          console.log(this.lists);
        }
        if (item.document?.lot1?.offset !== undefined) {
          offset1 = item.document.lot1.offset;
        }

        if (item.document?.lot2?.offset !== undefined) {
          offset2 = item.document.lot2.offset + 50;
        }
        if (item.document?.lot2 === null) {
          offset2 = offset1 + 50;
        }
        console.log('different Item');
        console.log(item.document?.lot1?.fichier?.path);
        console.log('offset1', offset1);
        console.log('offset2', offset2);
        if (item.document?.lot1?.fichier?.path !== undefined) {
          console.log('***');
          console.log(this.fichier.path);
          console.log('***');
          console.log('***');
          console.log(this.lists[0]?.document?.lot1?.fichier?.path);
          console.log('***');
          this.fichier = item.document.lot1.fichier;
          console.log('***');
          console.log(this.fichier.path);
          console.log(this.lists[0]?.document?.lot1?.fichier?.path);
          console.log('***');
        }
        this.oneHistory = item;
        if (item.printStatus !== null) {
          this.statusPrint = item.printStatus;
        }
        if (item.livraison !== undefined) {
          this.livraisonID = item.livraison;
        }
        this.postId = item.document?.poste?.id;
        if (item.document?.lot1?.fichier?.distributeur !== undefined && this.fichier.distributeur !== undefined) {
          this.fichier.distributeur.id = item.document.lot1.fichier.distributeur.id;
        }
      }
    }
    if (listElements.length > 0) {
      if (this.oneHistory !== undefined) {
        if (this.oneHistory.document?.lot2?.offset !== undefined) {
          this.oneHistory.document.lot2.offset = offset2 - 50;
        }
        if (this.oneHistory.document?.lot2 === null) {
          this.oneHistory.document.lot2 = { offset: offset2 - 50 };
        }
        this.lists.push(this.oneHistory);
      }
    }
    console.log(this.lists);
    return this.lists;
  }
}
