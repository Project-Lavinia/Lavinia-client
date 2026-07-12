# Lavinia-client

This guide in other languages:

-   [Norsk bokmål](README.nob.md)

## Description

An application that simulates seat distribution in elections. Current features include:

-   All the Norwegian Parliamentary Elections since 1945
-   Sainte-Laguë (modified), d'Hondt and largest fraction (Hare, Droop, Hagenbach-Bischoff) distribution methods
-   Detailed tables describing the simulation results
-   Parameters for adjusting how the seats are distributed
-   Merging of counties to simulate the effect of the new Norwegian regions of 2020
-   See how the county data for 2021 would have changed the results of previous elections
-   Save the results from a distribution and compare them to the results with adjusted parameters

Read more about Lavinia and the Norwegian election system in our [wiki](https://project-lavinia.github.io/).

## Prerequisites

-   [Node.js](https://nodejs.org) 20 LTS or later
-   [Yarn](https://yarnpkg.com)

## Running the development build

1. Clone the repository to your preferred folder
2. Open your favourite terminal and navigate to aforementioned folder
3. Type `yarn` <kbd>Enter</kbd> and wait patiently for the packages to be installed
4. Type `yarn download-data` <kbd>Enter</kbd> and wait patiently for the election data to be downloaded
5. Type `yarn start` <kbd>Enter</kbd>

After step 5. your default browser should have opened up, running a development server locally on your machine. In most terminals, hit <kbd>Ctrl</kbd>+<kbd>c</kbd> with your terminal focused to close the application.
