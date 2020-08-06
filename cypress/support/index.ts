Cypress.Commands.add("copyStorage", (fromStorage: { [name: string]: any }, toStorage: { [name: string]: any }) => {
    for (const key in fromStorage) {
        if (fromStorage.hasOwnProperty(key)) {
            toStorage[key] = fromStorage[key];
        }
    }
});
