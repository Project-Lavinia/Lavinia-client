/// <reference path="../support/index.d.ts" />
/// <reference types="cypress" />

describe("PresentationMenu", () => {
    function waitForLoad(iteration: number = 0) {
        cy.wait(1000).then(() => {
            cy.get("#page_loader").then((loader) => {
                if (loader.is(":visible") && iteration < 30) {
                    waitForLoad(iteration++);
                }
            });

            cy.get("#close_tutorial_button").then((button) => {
                if (button.is(":visible")) {
                    button.click();
                }
            });
        });
    }

    const presentations = ["Landsoversikt", "Fylkesoversikt", "Utjevningsmandater", "Restkvotienter", "Fylkesfordeling av mandater", "Enkeltfylke"];
    const timeoutLength = 30000;
    let previousFetch = performance.now();
    let localStorageCache = {};

    beforeEach(() => {
        cy.viewport(1080, 720);
        const currentTime = performance.now();
        if (currentTime - previousFetch < timeoutLength) {
            cy.copyStorage(localStorageCache, localStorage);
        } else {
            previousFetch = currentTime;
        }
    });

    afterEach(() => {
        localStorageCache = {};
        cy.copyStorage(localStorage, localStorageCache);
    });

    context("Hide parties without seats", () => {
        it("Works for all presentations", () => {
            cy.visit("").then(() => waitForLoad());

            cy.get("#no-seats-setting").uncheck({force: true});
            presentations.forEach((presentation) => {
                cy.get("#presentation_select").select(presentation);
                cy.get("#no-seats-setting").should("not.be.checked");
            });
        });
    });
});
