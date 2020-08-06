declare namespace Cypress {
    interface Chainable {
        copyStorage(fromStorage: { [name: string]: any }, toStorage: { [name: string]: any }): Chainable<Element>;
    }
}
