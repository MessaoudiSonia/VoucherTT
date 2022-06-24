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

describe('Distributeur e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/api/distributeurs*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('distributeur');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Distributeurs', () => {
    cy.intercept('GET', '/api/distributeurs*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('distributeur');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Distributeur').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Distributeur page', () => {
    cy.intercept('GET', '/api/distributeurs*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('distributeur');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('distributeur');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Distributeur page', () => {
    cy.intercept('GET', '/api/distributeurs*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('distributeur');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Distributeur');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Distributeur page', () => {
    cy.intercept('GET', '/api/distributeurs*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('distributeur');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Distributeur');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Distributeur', () => {
    cy.intercept('GET', '/api/distributeurs*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('distributeur');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Distributeur');

    cy.get(`[data-cy="nom"]`).type('online withdrawal b', { force: true }).invoke('val').should('match', new RegExp('online withdrawal b'));

    cy.get(`[data-cy="code"]`).type('Administrateur', { force: true }).invoke('val').should('match', new RegExp('Administrateur'));

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/distributeurs*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('distributeur');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Distributeur', () => {
    cy.intercept('GET', '/api/distributeurs*').as('entitiesRequest');
    cy.intercept('DELETE', '/api/distributeurs/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('distributeur');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('distributeur').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/distributeurs*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('distributeur');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
