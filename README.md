# Lavinia-client

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/64b563a2c5e349e2a13fcfe3c1bc1008)](https://www.codacy.com/gh/Project-Lavinia/Lavinia-client?utm_source=github.com&utm_medium=referral&utm_content=Project-Lavinia/Lavinia-client&utm_campaign=Badge_Grade) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/Project-Lavinia/Lavinia-client.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Project-Lavinia/Lavinia-client/context:javascript) [![Total alerts](https://img.shields.io/lgtm/alerts/g/Project-Lavinia/Lavinia-client.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Project-Lavinia/Lavinia-client/alerts/)

This guide in other languages:

-   [Norsk bokmål](README.nob.md)

## Description

An application that simulates seat distribution in elections. Current features include:

-   All the Norwegian Parliamentary Elections since 1945
-   Sainte-Lagüe (modified), d'Hondt and largest fraction (Hare, Droop, Hagenbach-Bischoff) distribution methods
-   Detailed tables describing the simulation results
-   Parameters for adjusting how the seats are distributed
-   Merging of counties to simulate the effect of the new Norwegian regions of 2020
-   See how the county data for 2021 would have changed the results of previous elections
-   Save the results from a distribution and compare them to the results with adjusted parameters

Read more about Lavinia and the Norwegian election system in our [wiki](https://project-lavinia.github.io/).

## Prerequisites

Install the latest:

-   [Node.js](https://nodejs.org)
-   [Yarn](https://yarnpkg.com)

## Running the development build

1. Clone the repository to your preferred folder
2. Open your favourite terminal and navigate to aforementioned folder
3. Type `yarn` <kbd>Enter</kbd> and wait patiently for the packages to be installed
4. Type `yarn start` <kbd>Enter</kbd>

After step 4. your default browser should have opened up, running a development server locally on your machine. In most terminals, hit <kbd>Ctrl</kbd>+<kbd>c</kbd> with your terminal focused to close the application.
