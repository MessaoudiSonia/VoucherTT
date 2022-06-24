import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Fichier e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/api/fichiers*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('fichier');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Fichiers', () => {
    cy.intercept('GET', '/api/fichiers*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('fichier');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Fichier').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Fichier page', () => {
    cy.intercept('GET', '/api/fichiers*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('fichier');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('fichier');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Fichier page', () => {
    cy.intercept('GET', '/api/fichiers*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('fichier');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Fichier');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Fichier page', () => {
    cy.intercept('GET', '/api/fichiers*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('fichier');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Fichier');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  /* this test is commented because it contains required relationships
  it('should create an instance of Fichier', () => {
    cy.intercept('GET', '/api/fichiers*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('fichier');
    cy.wait('@entitiesRequest')
      .then(({ request, response }) => startingEntitiesCount = response.body.length);
    cy.get(entityCreateButtonSelector).click({force: true});
    cy.getEntityCreateUpdateHeading('Fichier');

    cy.get(`[data-cy="path"]`).type('invoice a', { force: true }).invoke('val').should('match', new RegExp('invoice a'));


    cy.get(`[data-cy="count"]`).type('26591').should('have.value', '26591');


    cy.get(`[data-cy="password"]`).type('schemas wireless Cambridgeshire', { force: true }).invoke('val').should('match', new RegExp('schemas wireless Cambridgeshire'));

    cy.setFieldSelectToLastOfEntity('distributeur');

    cy.get(entityCreateSaveButtonSelector).click({force: true});
    cy.scrollTo('top', {ensureScrollable: false});
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/fichiers*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('fichier');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });
  */

  /* this test is commented because it contains required relationships
  it('should delete last instance of Fichier', () => {
    cy.intercept('GET', '/api/fichiers*').as('entitiesRequest');
    cy.intercept('DELETE', '/api/fichiers/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('fichier');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({force: true});
        cy.getEntityDeleteDialogHeading('fichier').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({force: true});
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/fichiers*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('fichier');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
  */
});
