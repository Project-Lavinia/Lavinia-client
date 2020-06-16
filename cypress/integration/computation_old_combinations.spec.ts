describe("ComputationMenu", () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.viewport(1080, 720);
    });

    function waitForLoad(iteration: number = 0) {
        cy.wait(1000).then(() => {
            cy.get("#page_loader").then((loader) => {
                if (loader.is(":visible") && iteration < 30) {
                    waitForLoad(iteration++);
                }
            });
        });
    }

    context("Old combinations", () => {
        const presentations = [
            "Landsoversikt",
            "Fylkesoversikt",
            "Utjevningsmandater",
            "Restkvotienter",
            "Fylkesfordeling av mandater",
            "Enkeltfylke",
        ];
        const algorithms = ["SAINTE_LAGUE", "D_HONDT", "LARGEST_FRACTION_HARE"];
        const year = 1953;
        const levelingSeatValues = ["0", "100"];
        const districtThresholdValues = ["0", "15"];
        const electionThresholdValues = ["0", "15"];
        const firstDivisorValues = ["1", "5"];

        presentations.forEach((presentation) => {
            algorithms.forEach((algorithm) => {
                levelingSeatValues.forEach((levelingSeats) => {
                    districtThresholdValues.forEach((districtThreshold) => {
                        electionThresholdValues.forEach((electionThreshold) => {
                            it(`Presentation ${presentation}, Year ${year}, Algorithm ${algorithm}, Leveling seats ${levelingSeats}, District threshold ${districtThreshold}, Election threshold ${electionThreshold}`, () => {
                                cy.visit("").then(() => waitForLoad);
                                cy.get("#presentation_select").select(presentation);
                                cy.get("#year_select").select(`${year}`);
                                cy.get("#algorithm_select").select(algorithm);
                                cy.get("#levelingSeats").clear();
                                cy.get("#levelingSeats").type(levelingSeats);
                                cy.get("#districtThreshold").clear();
                                cy.get("#districtThreshold").type(districtThreshold);
                                cy.get("#electionThreshold").clear();
                                cy.get("#electionThreshold").type(electionThreshold);
                                if (algorithm === "SAINTE_LAGUE") {
                                    firstDivisorValues.forEach((firstDivisor) => {
                                        cy.log(`First divisor: ${firstDivisor}`);
                                        cy.get("#firstDivisor").clear();
                                        cy.get("#firstDivisor").type(firstDivisor);
                                        cy.get("#firstDivisor").should("have.value", firstDivisor);
                                    });
                                } else {
                                    cy.get("#firstDivisor").should("not.be.visible");
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});
