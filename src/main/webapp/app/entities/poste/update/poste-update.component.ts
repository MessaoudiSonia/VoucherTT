import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPoste, Poste } from '../poste.model';
import { PosteService } from '../service/poste.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IDistributeur } from 'app/entities/distributeur/distributeur.model';
import { DistributeurService } from 'app/entities/distributeur/service/distributeur.service';

@Component({
  selector: 'inetum-poste-update',
  templateUrl: './poste-update.component.html',
})
export class PosteUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  distributeursSharedCollection: IDistributeur[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    code: [null, [Validators.required]],
    privateKey: [],
    publicKey: [],
    //  internalUser: [null, Validators.required],
    distributeur: [null, Validators.required],
  });

  constructor(
    protected posteService: PosteService,
    protected userService: UserService,
    protected distributeurService: DistributeurService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ poste }) => {
      this.updateForm(poste);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const poste = this.createFromForm();
    if (poste.id !== undefined) {
      this.subscribeToSaveResponse(this.posteService.update(poste));
    } else {
      this.subscribeToSaveResponse(this.posteService.create(poste));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackDistributeurById(index: number, item: IDistributeur): number {
    return item.id!;
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

  protected updateForm(poste: IPoste): void {
    this.editForm.patchValue({
      id: poste.id,
      nom: poste.nom,
      code: poste.code,
      privateKey: poste.privateKey,
      publicKey: poste.publicKey,
      internalUser: poste.internalUser,
      distributeur: poste.distributeur,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, poste.internalUser);
    this.distributeursSharedCollection = this.distributeurService.addDistributeurToCollectionIfMissing(
      this.distributeursSharedCollection,
      poste.distributeur
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('internalUser')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.distributeurService
      .query()
      .pipe(map((res: HttpResponse<IDistributeur[]>) => res.body ?? []))
      .pipe(
        map((distributeurs: IDistributeur[]) =>
          this.distributeurService.addDistributeurToCollectionIfMissing(distributeurs, this.editForm.get('distributeur')!.value)
        )
      )
      .subscribe((distributeurs: IDistributeur[]) => (this.distributeursSharedCollection = distributeurs));
  }

  protected createFromForm(): IPoste {
    return {
      ...new Poste(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      code: this.editForm.get(['code'])!.value,
      //  privateKey: this.editForm.get(['privateKey'])!.value,
      //  publicKey: this.editForm.get(['publicKey'])!.value,
      //  internalUser: this.editForm.get(['internalUser'])!.value,
      distributeur: this.editForm.get(['distributeur'])!.value,
    };
  }
}
