import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPoste, Poste } from '../poste.model';
import { IUser } from 'app/entities/user/user.model';
import { IDistributeur } from 'app/entities/distributeur/distributeur.model';
import { FormBuilder, Validators } from '@angular/forms';
import { PosteService } from 'app/entities/poste/service/poste.service';
import { UserService } from 'app/entities/user/user.service';
import { DistributeurService } from 'app/entities/distributeur/service/distributeur.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'inetum-poste-detail',
  templateUrl: './poste-detail.component.html',
})
export class PosteDetailComponent implements OnInit {
  poste: IPoste | undefined;
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    code: [null, [Validators.required]],
    privateKey: [],
    publicKey: [],
    distributeur: [null, Validators.required],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected posteService: PosteService,
    protected userService: UserService,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ poste }) => {
      this.poste = poste;
      console.log('this.poste', this.poste);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const poste = this.poste;
    if (poste !== undefined) {
      this.subscribeToSaveResponse(this.posteService.update(poste));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPoste>>): void {
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
    this.isSaving = false;
  }
}
