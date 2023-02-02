import COMMANDS from '../../src/enums/commands';
import ELEMENT_TYPES from '../../src/enums/elementTypes';
import FIELD_DATA_TYPES from '../../src/enums/fieldDataTypes';
import QUERIES from '../../src/enums/queries';
import Factory from '../support/Factory';

describe('edit elements', () => {
  const board = Factory.board({name: 'Video Games'});
  const allColumn = Factory.column({
    name: 'All',
    'card-inclusion-condition': null,
  });

  beforeEach(() => {
    cy.intercept('http://cypressapi/boards?', {data: [board]});
    cy.intercept('GET', `http://cypressapi/boards/${board.id}?`, {
      data: board,
    });
    cy.intercept(`http://cypressapi/boards/${board.id}/columns?`, {
      data: [allColumn],
    });
  });

  it('allows creating, updating, and deleting fields', () => {
    const newField = Factory.field({
      'element-type': ELEMENT_TYPES.FIELD.key,
      name: '',
    });
    const greetingField = Factory.field(
      {
        name: 'Greeting',
        'data-type': FIELD_DATA_TYPES.TEXT.key,
        'show-in-summary': true,
      },
      newField,
    );

    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [],
    });
    cy.intercept(`http://cypressapi/boards/${board.id}/cards?`, {
      data: [],
    });

    cy.visit('/');
    cy.contains('Video Games').click();

    cy.log('ADD FIELD');

    cy.get('[aria-label="Board Menu"]').click();
    cy.contains('Edit Elements').click({force: true});

    cy.intercept('POST', 'http://cypressapi/elements?', {
      data: newField,
    }).as('addField');
    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [newField],
    });

    cy.contains(/^Add$/).click();
    cy.contains(/^Field$/).click({force: true});

    cy.wait('@addField');
    const fieldName = 'Greeting';
    cy.get('[data-testid="text-input-element-name"]').type(fieldName);
    cy.contains('Data Type: (choose)').paperSelect('Text');
    cy.contains('Data Type: Text');
    cy.get('[data-testid="checkbox-show-in-summary"]').click();

    // TODO: set other element fields: show condition, etc

    cy.intercept('PATCH', `http://cypressapi/elements/${newField.id}?`, {
      success: true,
    }).as('updateField');
    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [greetingField],
    });
    cy.contains('Save Element').click();
    cy.wait('@updateField')
      .its('request.body')
      .should('deep.equal', {data: greetingField});
    cy.contains(fieldName);
    cy.contains('Done Editing Elements').click();

    const newCard = Factory.card({});
    cy.intercept('POST', 'http://cypressapi/cards?', {
      data: newCard,
    });
    cy.intercept(`http://cypressapi/boards/${board.id}/cards?`, {
      data: [newCard],
    });
    cy.contains('Add Card').click();
    const greeting = 'Hello, World!';
    cy.get(`[data-testid="text-input-${greetingField.id}"]`).type(
      'Hello, World!',
    );
    cy.intercept('PATCH', `http://cypressapi/cards/${newCard.id}?`, {
      success: true,
    }).as('updateField');
    cy.intercept(`http://cypressapi/boards/${board.id}/cards?`, {
      data: [Factory.card({[greetingField.id]: greeting})],
    });
    cy.contains('Save').click();
    cy.wait('@updateField');
    cy.contains(greeting);

    cy.log('EDIT FIELD');

    cy.get('[aria-label="Board Menu"]').click();
    cy.contains('Edit Elements').click({force: true});

    cy.get(`[aria-label="Edit ${fieldName} field"]`).click();
    cy.get('[data-testid="text-input-element-name"]')
      .invoke('val')
      .then(value => expect(value).to.equal(fieldName));

    cy.contains('Cancel').click();
    cy.get('[data-testid="text-input-element-name"]').should('not.exist');
    cy.get(`[aria-label="Edit ${fieldName} field"]`).click();

    const updatedFieldName = 'Salutation';
    cy.get('[data-testid="text-input-element-name"]')
      .clear()
      .type(updatedFieldName);
    const updatedGreetingField = Factory.field(
      {name: updatedFieldName},
      greetingField,
    );
    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [updatedGreetingField],
    });
    cy.contains('Save Element').click();
    cy.wait('@updateField');
    cy.contains('Save Element').should('not.exist');
    cy.contains(updatedFieldName);

    cy.log('DELETE FIELD');

    cy.get(`[aria-label="Edit ${updatedFieldName} field"]`).click();
    cy.intercept('DELETE', `http://cypressapi/elements/${greetingField.id}`, {
      success: true,
    }).as('deleteField');
    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [],
    });
    cy.contains('Delete Element').click();
    cy.wait('@deleteField');
    cy.contains(updatedFieldName).should('not.exist');
  });

  it('allows creating, updating, and deleting buttons', () => {
    const greetingField = Factory.field({
      name: 'Greeting',
      'data-type': FIELD_DATA_TYPES.TEXT.key,
      'show-in-summary': true,
    });

    const newButton = Factory.button({});
    const buttonName = 'Quiet Down';
    const greetButton = Factory.button(
      {
        name: buttonName,
        action: {
          command: COMMANDS.SET_VALUE.key,
          field: greetingField.id,
          value: 'EMPTY',
        },
        'show-condition': {
          query: QUERIES.IS_NOT_EMPTY.key,
          field: greetingField.id,
        },
      },
      newButton,
    );

    const greetingText = 'Hello, world!';
    const card = Factory.card({[greetingField.id]: greetingText});

    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [greetingField],
    });
    cy.intercept(`http://cypressapi/boards/${board.id}/cards?`, {
      data: [card],
    });

    cy.visit('/');
    cy.contains('Video Games').click();

    cy.log('ADD BUTTON');

    cy.get('[aria-label="Board Menu"]').click();
    cy.contains('Edit Elements').click({force: true});

    cy.intercept('POST', 'http://cypressapi/elements?', {
      data: newButton,
    }).as('addButton');
    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [greetingField, newButton],
    });

    cy.contains(/^Add$/).click();
    cy.contains(/^Button$/).click({force: true});

    cy.wait('@addButton')
      .its('request.body')
      .should('deep.equal', {
        data: {
          type: 'elements',
          relationships: {
            board: {data: {type: 'boards', id: String(board.id)}},
          },
          attributes: {'element-type': ELEMENT_TYPES.BUTTON.key},
        },
      });

    cy.get('[data-testid="text-input-element-name"]').type(buttonName);

    // action
    cy.contains('Command: (choose)').paperSelect('Set Value');
    // TODO: make this reliable to select when it's just the field name shown, not conflicting with other things on the page
    cy.contains('Action Field: (choose)').paperSelect('Greeting');
    cy.contains('Value: (choose)').paperSelect('Empty');

    // show condition
    cy.contains('Show Query: (choose)').paperSelect('Not Empty');
    cy.contains('Query Field: (choose)').paperSelect('Greeting');

    cy.intercept('PATCH', `http://cypressapi/elements/${newButton.id}?`, {
      success: true,
    }).as('updateField');
    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [greetingField, greetButton],
    });
    cy.contains('Save Element').click();
    cy.wait('@updateField')
      .its('request.body')
      .should('deep.equal', {data: greetButton});
    cy.contains(buttonName);
    cy.contains('Done Editing Elements').click();

    cy.contains(greetingText).click();

    const quietedCard = Factory.card({[greetingField.id]: null}, card);
    cy.intercept('PATCH', `http://cypressapi/cards/${card.id}?`, {
      success: true,
    }).as('updateCard');
    cy.intercept(`http://cypressapi/boards/${board.id}/cards?`, {
      data: [quietedCard],
    });
    cy.contains(buttonName).click();
    cy.wait('@updateCard')
      .its('request.body')
      .should('deep.equal', {data: quietedCard});
    cy.contains(greetingText).should('not.exist');

    cy.get(`[data-testid="card-${quietedCard.id}"]`).click();
    cy.contains(buttonName).should('not.exist');

    cy.log('EDIT BUTTON');

    cy.get('[aria-label="Board Menu"]').click();
    cy.contains('Edit Elements').click({force: true});

    cy.get(`[aria-label="Edit ${buttonName} button"]`).click();

    const updatedButtonName = 'Shoosh';
    cy.get('[data-testid="text-input-element-name"]')
      .clear()
      .type(updatedButtonName);

    const renamedButton = Factory.button(
      {name: updatedButtonName},
      greetButton,
    );
    cy.intercept('PATCH', `http://cypressapi/elements/${newButton.id}?`, {
      success: true,
    }).as('updateField');
    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [greetingField, renamedButton],
    });

    cy.contains('Save Element').click();
    cy.wait('@updateField')
      .its('request.body')
      .should('deep.equal', {data: renamedButton});
    cy.contains(updatedButtonName);

    cy.log('DELETE BUTTON');

    cy.get(`[aria-label="Edit ${updatedButtonName} button"]`).click();

    cy.intercept(`http://cypressapi/boards/${board.id}/elements?`, {
      data: [greetingField],
    });
    cy.intercept('DELETE', `http://cypressapi/elements/${renamedButton.id}`, {
      success: true,
    }).as('deleteButton');
    cy.contains('Delete Element').click();
    cy.wait('@deleteButton');

    cy.contains(updatedButtonName).should('not.exist');
  });
});
