import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Authority } from '../config/authority.constants';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'poste',
        data: {
          pageTitle: 'voucherTtApp.poste.home.title',
          authorities: [Authority.ADMIN, Authority.POSTE, Authority.USER, Authority.DISTRIBUTEUR],
        },
        loadChildren: () => import('./poste/poste.module').then(m => m.PosteModule),
      },
      {
        path: 'distributeur',
        data: {
          pageTitle: 'voucherTtApp.distributeur.home.title',
          authorities: [Authority.ADMIN, Authority.USER],
        },
        loadChildren: () => import('./distributeur/distributeur.module').then(m => m.DistributeurModule),
      },
      {
        path: 'fichier',
        data: {
          pageTitle: 'voucherTtApp.fichier.home.title',
          authorities: [Authority.ADMIN, Authority.POSTE, Authority.USER, Authority.DISTRIBUTEUR],
        },
        loadChildren: () => import('./fichier/fichier.module').then(m => m.FichierModule),
      },
      {
        path: 'lot',
        data: { pageTitle: 'voucherTtApp.lot.home.title' },
        loadChildren: () => import('./lot/lot.module').then(m => m.LotModule),
      },
      {
        path: 'document',
        data: { pageTitle: 'voucherTtApp.document.home.title', authorities: [Authority.ADMIN, Authority.USER, Authority.DISTRIBUTEUR] },
        loadChildren: () => import('./document/document.module').then(m => m.DocumentModule),
      },
      {
        path: 'agent',
        data: { pageTitle: 'voucherTtApp.agent.home.title' },
        loadChildren: () => import('./agent/agent.module').then(m => m.AgentModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
