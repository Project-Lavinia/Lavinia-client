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

const arbitraryNumberOfMilliseconds = 4000;
describe("ComputationMenu", () => {
    beforeEach(() => {
        cy.clearLocalStorage();
    });
    context("default settings", () => {
        it("work for all years", () => {
            cy.visit("").wait(arbitraryNumberOfMilliseconds);

            years.forEach((year) => {
                cy.get("#year_select").select(`${year}`);
                cy.get("#year_select").should("have.value", `${year}`);
            });
        });
    });

    context("merge to 11 districts checkbox", () => {
        it("works for relevant years", () => {
            cy.visit("").wait(1000);

            yearsWithModernElectionSystem.forEach((year) => {
                cy.get("#year_select").select(`${year}`);
                cy.get("#year_select").should("have.value", `${year}`);
                cy.get("#merge_to_11_districts_checkbox").check();
                cy.get("#merge_to_11_districts_checkbox").should("be.checked");
            });
        });
    });

    context("use 2021 seat distribution checkbox", () => {
        it("works for relevant years", () => {
            cy.visit("").wait(1000);

            yearsWithModernElectionSystem.forEach((year) => {
                cy.get("#year_select").select(`${year}`);
                cy.get("#year_select").should("have.value", `${year}`);
                cy.get("#2021_distribution_checkbox").check();
                cy.get("#2021_distribution_checkbox").should("be.checked");
            });
        });
    });

    context("merge checkbox, then 2021 distribution checkbox", () => {
        it("works for relevant years", () => {
            cy.visit("").wait(1000);

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
        it("works for relevant years", () => {
            cy.visit("").wait(1000);

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

    context("algorithms", () => {
        years.forEach((year) => {
            it(`works for ${year}`, () => {
                cy.visit("").wait(1000);
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
});
