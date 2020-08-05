Cypress.Commands.add("copyStorage", (fromStorage: { [name: string]: any }, toStorage: { [name: string]: any }) => {
    for (const key in fromStorage) {
        if (Object.prototype.hasOwnProperty.call(fromStorage, key)) {
            toStorage[key] = fromStorage[key];
        }
    }
});
