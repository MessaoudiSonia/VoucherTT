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

describe('Document e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/api/documents*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('document');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Documents', () => {
    cy.intercept('GET', '/api/documents*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('document');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Document').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Document page', () => {
    cy.intercept('GET', '/api/documents*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('document');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('document');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Document page', () => {
    cy.intercept('GET', '/api/documents*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('document');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Document');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Document page', () => {
    cy.intercept('GET', '/api/documents*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('document');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Document');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  /* this test is commented because it contains required relationships
  it('should create an instance of Document', () => {
    cy.intercept('GET', '/api/documents*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('document');
    cy.wait('@entitiesRequest')
      .then(({ request, response }) => startingEntitiesCount = response.body.length);
    cy.get(entityCreateButtonSelector).click({force: true});
    cy.getEntityCreateUpdateHeading('Document');

    cy.get(`[data-cy="creation"]`).type('2021-05-12T03:29').invoke('val').should('equal', '2021-05-12T03:29');


    cy.get(`[data-cy="impression"]`).type('2021-05-12T14:14').invoke('val').should('equal', '2021-05-12T14:14');


    cy.get(`[data-cy="printer"]`).type('Fantastic a', { force: true }).invoke('val').should('match', new RegExp('Fantastic a'));


    cy.get(`[data-cy="printStatus"]`).select('FAILED');

    cy.setFieldSelectToLastOfEntity('lot1');

    cy.setFieldSelectToLastOfEntity('lot2');

    cy.setFieldSelectToLastOfEntity('poste');

    cy.get(entityCreateSaveButtonSelector).click({force: true});
    cy.scrollTo('top', {ensureScrollable: false});
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/documents*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('document');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });
  */

  /* this test is commented because it contains required relationships
  it('should delete last instance of Document', () => {
    cy.intercept('GET', '/api/documents*').as('entitiesRequest');
    cy.intercept('DELETE', '/api/documents/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('document');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({force: true});
        cy.getEntityDeleteDialogHeading('document').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({force: true});
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/documents*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('document');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
  */
});
