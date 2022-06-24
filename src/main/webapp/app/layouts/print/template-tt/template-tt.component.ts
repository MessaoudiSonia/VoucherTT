import { Component, OnInit } from '@angular/core';
import { Recorde } from 'app/entities/recorde/recorde.model';
import { PosteService } from 'app/entities/poste/service/poste.service';
import { Poste } from 'app/entities/poste/poste.model';
import { DocumentService } from 'app/entities/document/service/document.service';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';

@Component({
  selector: 'inetum-template-tt',
  templateUrl: './template-tt.component.html',
  styleUrls: ['./template-tt.component.scss'],
})
export class TemplateTtComponent implements OnInit {
  postes?: Poste[] = [];
  recordes: Recorde[] = [];
  distribiteurConnect?: any;

  convertedRecordObj: any = '';
  private result: any;
  constructor(protected posteService: PosteService, private documentsService: DocumentService) {}

  ngOnInit(): void {
    this.getDistribiteurConnect();
    this.posteService.findAll().subscribe(res => (this.postes = res));
  }

  convertCSVToJson(recordArray: any): void {
    this.convertedRecordObj = JSON.stringify(recordArray, null, 2);
    this.recordes = recordArray.result;
    this.getDistribiteurConnect();
  }
  onError(err: any): void {
    this.convertedRecordObj = err;
  }

  getDistribiteurConnect(): void {
    this.documentsService.findAll().subscribe(res => {
      this.distribiteurConnect = res[0].poste?.distributeur?.nom;
      console.log(this.distribiteurConnect);
    });
  }
}
