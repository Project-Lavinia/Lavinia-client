# Lavinia-client

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/64b563a2c5e349e2a13fcfe3c1bc1008)](https://www.codacy.com/gh/Project-Lavinia/Lavinia-client?utm_source=github.com&utm_medium=referral&utm_content=Project-Lavinia/Lavinia-client&utm_campaign=Badge_Grade) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/Project-Lavinia/Lavinia-client.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Project-Lavinia/Lavinia-client/context:javascript) [![Total alerts](https://img.shields.io/lgtm/alerts/g/Project-Lavinia/Lavinia-client.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Project-Lavinia/Lavinia-client/alerts/)

Denne guiden på andre språk:

-   [English](README.md)

## Beskrivelse

En applikasjon som simulerer mandatdistribusjon i valg. Nåværende funksjonalitet inkluderer:

-   Alle stortingsvalg siden 1945
-   Fordelingsmetodene Sainte-Lagüe (modifisert), d'Hondt, største brøks metode (Hare, Droop & Hagenbach-Bischoff)
-   Detaljerte tabeller som beskriver simulasjonsresultatene
-   Parametere for å justere hvordan mandatene fordeles
-   Sammenslåing av fylker for å simulere effekten av de nye regionene i 2020
-   Se hvordan fylkesdataene for 2021 ville forandret resultatene av tidligere valg
-   Lagre resultatene fra en fordeling og sammenlign de med justerte parametre

Les mer om Lavinia og det norske valgsystemet i vår [wiki](https://project-lavinia.github.io/).

## Forutsetninger

Installer de siste versjonene av:

-   [Node.js](https://nodejs.org)
-   [Yarn](https://yarnpkg.com)

## For å kjøre utviklingsbygget

1. Klon repositoriet ned til din foretrukne mappe
2. Åpne favoritt-terminalen din og naviger til den tidligere nevnte mappen
3. Skriv inn `yarn` <kbd>Enter</kbd> og vent tålmodig på at de nødvendige pakkene installeres
4. Skriv inn `yarn start` <kbd>Enter</kbd>

Etter steg 4. burde din standard-nettleser åpne seg med applikasjonen i et vindu eller en fane. I de fleste terminaler stopper du applikasjonen ved å fokusere terminalen og trykke <kbd>Ctrl</kbd>+<kbd>c</kbd>
