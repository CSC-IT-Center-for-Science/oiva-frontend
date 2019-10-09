                ____  _
               / __ \(_)
              | |  | |___   ____ _
              | |  | | \ \ / / _` |
              | |__| | |\ V / (_| |
     ______    \____/|_| \_/ \__,_|
    |  ____| ______      ____     ____  __   ________   _______   ____  __    _______
    | |__   |  __  \   /      \  |    \|  | |__   ___| |  ____/  |    \|  |  |   __   \
    |  __|  |  ——  |  | () ()  | |  |\    |    |  |    |  |___   |  |\    |  |  |  |  |
    |  |    |  |\  \  | \___   | |  | |   |    |  |    |   ____  |  | |   |  |  |_/   |
    |__|    |__| |__|  \______/  |__| |__/     |__|    |______/  |__| |__/   |_______/

# Kehitysympäristön asentaminen

Tervetuloa Oiva-projektin pariin! Tämä on projektin frontend-osuus, joka pohjautuu [Create React App](https://github.com/facebook/create-react-app) -projektipohjaan.

## Tarvitset nämä
* NPM (6.11.3)
* NodeJS (10.15.3)

Edellä listatut versiot on toimiviksi todettu. Tämä ei poissulje sitä, etteikö frontend voisi toimia myös listatuista poikkeavilla versioilla.

## Pakettien asentaminen
Suorita projektin juurihakemistossa seuraava komento:
```
npm install
```

## Projektin käynnistäminen
Suorita projektin juurihakemistossa seuraava komento:
```
npm run start
```

Navigoi osoitteeseen [http://localhost](http://localhost).

**Huom!** Jotta sinun on mahdollista saada dataa [Oivan backend](https://github.com/CSCfi/oiva-backend)istä, sinulla tulee olla myös backend-projekti asennettuna koneellesi.

## Testit

### Yksikkötestit
Yksikkötestien ajamiseen käytämme [Jest](https://jestjs.io/):iä.

Testejä voi ajaa näin:
```
npm t -- --watchAll=false
```

Testikattavuutta voi seurata näin:
```
npm run coverage
```

### E2E-testit
E2E-testien käyttöönotto on vielä hieman kesken. Sovelluksen ulkoasun, HTML-elementtien keskinäisten suhteiden ja responsiivisuuden testaamiseen on kaavailtu [http://galenframework.com/](Galen Framework) -ratkaisua.

Testejä voidaan ajaa speksejä vasten näin:
```
./node_modules/.bin/galen check "src/specs/homepage.gspec" --url "http://localhost" --size "1024x768" --htmlreport reports
```

Toiminnallisten testien suorittamiseen käytämme [https://gauge.org/index.html](Gauge/Taiko) -yhdistelmää.

Toiminnallisia testejä voi ajaa näin:
```
npm run e2e
```
Yllä oleva komento suorittaa `tests/e2e/specs`-kansion .spec-tiedostoissa määritellyt testit.