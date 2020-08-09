/// <reference path="../support/index.d.ts" />
/// <reference types="cypress" />

const years = [
    2017,
    2013,
    2009,
    2005,
    2001,
    1997,
    1993,
    1989,
    1985,
    1981,
    1977,
    1973,
    1969,
    1965,
    1961,
    1957,
    1953,
    1949,
    1945,
];
const yearsWithModernElectionSystem = [2017, 2013, 2009, 2005];
const yearsWithStLagues = years.slice(0, years.length - 2);

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

describe("ComputationMenu", () => {
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

    context("Default settings", () => {
        it("Works for all years", () => {
            cy.visit("").then(() => waitForLoad());

            years.forEach((year) => {
                cy.get("#year_select").select(`${year}`);
                cy.get("#year_select").should("have.value", `${year}`);
            });
        });
    });

    context("Merge to 11 districts checkbox", () => {
        it("Works for relevant years", () => {
            cy.visit("").then(() => waitForLoad());

            yearsWithModernElectionSystem.forEach((year) => {
                cy.get("#year_select").select(`${year}`);
                cy.get("#year_select").should("have.value", `${year}`);
                cy.get("#merge_to_11_districts_checkbox").check();
                cy.get("#merge_to_11_districts_checkbox").should("be.checked");
            });
        });
    });

    context("Use 2021 seat distribution checkbox", () => {
        it("Works for relevant years", () => {
            cy.visit("").then(() => waitForLoad());

            yearsWithModernElectionSystem.forEach((year) => {
                cy.get("#year_select").select(`${year}`);
                cy.get("#year_select").should("have.value", `${year}`);
                cy.get("#2021_distribution_checkbox").check();
                cy.get("#2021_distribution_checkbox").should("be.checked");
            });
        });
    });

    context("Merge checkbox, then 2021 distribution checkbox", () => {
        it("Works for relevant years", () => {
            cy.visit("").then(() => waitForLoad());

            yearsWithModernElectionSystem.forEach((year) => {
                cy.get("#year_select").select(`${year}`);
                cy.get("#year_select").should("have.value", `${year}`);
                cy.get("#merge_to_11_districts_checkbox").check();
                cy.get("#2021_distribution_checkbox").check();
                cy.get("#merge_to_11_districts_checkbox").should("be.checked");
                cy.get("#2021_distribution_checkbox").should("be.checked");
            });
        });
    });

    context("2021 distribution checkbox, then merge checkbox", () => {
        it("Works for relevant years", () => {
            cy.visit("").then(() => waitForLoad());

            yearsWithModernElectionSystem.forEach((year) => {
                cy.get("#year_select").select(`${year}`);
                cy.get("#year_select").should("have.value", `${year}`);
                cy.get("#2021_distribution_checkbox").check();
                cy.get("#merge_to_11_districts_checkbox").check();
                cy.get("#merge_to_11_districts_checkbox").should("be.checked");
                cy.get("#2021_distribution_checkbox").should("be.checked");
            });
        });
    });

    context("Algorithms", () => {
        years.forEach((year) => {
            it(`Works for ${year}`, () => {
                cy.visit("").then(() => waitForLoad());
                cy.get("#year_select").select(`${year}`);
                cy.get("#year_select").should("have.value", `${year}`);
                const algorithms = [
                    "SAINTE_LAGUE",
                    "D_HONDT",
                    "LARGEST_FRACTION_HARE",
                    "LARGEST_FRACTION_DROOP",
                    "LARGEST_FRACTION_HAGENBACH_BISCHOFF",
                ];
                algorithms.forEach((algorithm) => {
                    cy.get("#algorithm_select").select(algorithm);
                    cy.get("#algorithm_select").should("have.value", algorithm);
                });
            });
        });
    });

    context("First divisor", () => {
        yearsWithStLagues.forEach((year) => {
            it(`Works for ${year}`, () => {
                cy.visit("").then(() => waitForLoad());
                cy.get("#year_select").select(`${year}`);
                cy.get("#year_select").should("have.value", `${year}`);
                const divisorValues = ["1", "2", "3", "4", "5"];
                divisorValues.forEach((value) => {
                    cy.get("#firstDivisor").clear();
                    cy.get("#firstDivisor").type(value);
                    cy.get("#firstDivisor").should("have.value", value);
                });
            });
        });
    });

    context("Leveling seat threshold", () => {
        years.forEach((year) => {
            it(`Works for ${year}`, () => {
                cy.visit("").then(() => waitForLoad());
                cy.get("#year_select").select(`${year}`);
                cy.get("#year_select").should("have.value", `${year}`);
                const electionThresholdValues = ["0", "5", "7.5", "10", "15"];
                electionThresholdValues.forEach((electionThreshold) => {
                    cy.get("#electionThreshold").clear();
                    cy.get("#electionThreshold").type(electionThreshold);
                    cy.get("#electionThreshold").should("have.value", electionThreshold);
                });
            });
        });
    });

    context("District seat threshold", () => {
        years.forEach((year) => {
            it(`Works for ${year}`, () => {
                cy.visit("").then(() => waitForLoad());
                cy.get("#year_select").select(`${year}`);
                cy.get("#year_select").should("have.value", `${year}`);
                const districtThresholdValues = ["0", "5", "7.5", "10", "15"];
                districtThresholdValues.forEach((districtThreshold) => {
                    cy.get("#districtThreshold").clear();
                    cy.get("#districtThreshold").type(districtThreshold);
                    cy.get("#districtThreshold").should("have.value", districtThreshold);
                });
            });
        });
    });

    context("Leveling seats", () => {
        years.forEach((year) => {
            it(`Works for ${year}`, () => {
                cy.visit("").then(() => waitForLoad());
                cy.get("#year_select").select(`${year}`);
                cy.get("#year_select").should("have.value", `${year}`);
                const levelingSeatValues = ["0", "25", "50", "75", "100"];
                levelingSeatValues.forEach((levelingSeats) => {
                    cy.get("#levelingSeats").clear();
                    cy.get("#levelingSeats").type(levelingSeats);
                    cy.get("#levelingSeats").should("have.value", levelingSeats);
                });
            });
        });
    });

    context("District seats", () => {
        yearsWithModernElectionSystem.forEach((year) => {
            it(`Works for ${year}`, () => {
                cy.visit("").then(() => waitForLoad());
                cy.get("#year_select").select(`${year}`);
                cy.get("#year_select").should("have.value", `${year}`);
                const districtSeatValues = ["0", "125", "250", "325", "500"];
                districtSeatValues.forEach((districtSeats) => {
                    cy.get("#districtSeats").clear();
                    cy.get("#districtSeats").type(districtSeats);
                    cy.get("#districtSeats").should("have.value", districtSeats);
                });
            });
        });
    });

    context("Area factor", () => {
        yearsWithModernElectionSystem.forEach((year) => {
            it(`Works for ${year}`, () => {
                cy.visit("").then(() => waitForLoad());
                cy.get("#year_select").select(`${year}`);
                cy.get("#year_select").should("have.value", `${year}`);
                const areaFactorValues = ["0", "0.75", "1.5", "2.25", "3"];
                areaFactorValues.forEach((areaFactor) => {
                    cy.get("#areaFactor").clear();
                    cy.get("#areaFactor").type(areaFactor);
                    cy.get("#areaFactor").should("have.value", areaFactor);
                });
            });
        });
    });
});
