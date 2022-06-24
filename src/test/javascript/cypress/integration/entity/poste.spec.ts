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

describe('Poste e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/api/postes*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('poste');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Postes', () => {
    cy.intercept('GET', '/api/postes*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('poste');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Poste').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Poste page', () => {
    cy.intercept('GET', '/api/postes*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('poste');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('poste');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Poste page', () => {
    cy.intercept('GET', '/api/postes*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('poste');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Poste');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Poste page', () => {
    cy.intercept('GET', '/api/postes*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('poste');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Poste');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  /* this test is commented because it contains required relationships
  it('should create an instance of Poste', () => {
    cy.intercept('GET', '/api/postes*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('poste');
    cy.wait('@entitiesRequest')
      .then(({ request, response }) => startingEntitiesCount = response.body.length);
    cy.get(entityCreateButtonSelector).click({force: true});
    cy.getEntityCreateUpdateHeading('Poste');

    cy.get(`[data-cy="nom"]`).type('Licensed orchestrate Chine', { force: true }).invoke('val').should('match', new RegExp('Licensed orchestrate Chine'));


    cy.get(`[data-cy="code"]`).type('generating Secured du', { force: true }).invoke('val').should('match', new RegExp('generating Secured du'));


    cy.get(`[data-cy="privateKey"]`).type('bypass', { force: true }).invoke('val').should('match', new RegExp('bypass'));


    cy.get(`[data-cy="publicKey"]`).type('parse compelling', { force: true }).invoke('val').should('match', new RegExp('parse compelling'));

    cy.setFieldSelectToLastOfEntity('internalUser');

    cy.setFieldSelectToLastOfEntity('distributeur');

    cy.get(entityCreateSaveButtonSelector).click({force: true});
    cy.scrollTo('top', {ensureScrollable: false});
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/postes*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('poste');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });
  */

  /* this test is commented because it contains required relationships
  it('should delete last instance of Poste', () => {
    cy.intercept('GET', '/api/postes*').as('entitiesRequest');
    cy.intercept('DELETE', '/api/postes/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('poste');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({force: true});
        cy.getEntityDeleteDialogHeading('poste').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({force: true});
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/postes*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('poste');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
  */
});
