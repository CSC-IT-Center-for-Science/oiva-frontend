# Esi- ja perusopetus

* Siirry osoitteeseen "localhost"
* Log in as "oiva-essi"

## Pääsy tallennetulle hakulomakkeelle - kirjautunut/kirjautumaton käyttäjä

* Klikkaa päänavigaation linkkiä "Järjestämis- ja ylläpitämisluvat"
* Siirry koulutusmuodon "Esi- ja perusopetus" pääsivulle
* Siirry koulutusmuodon avoimiin asioihin sivulla olevan linkin "Asianhallinta" kautta
* Klikkaa elementtiä, jossa on teksti "Luo uusi asia"
* Varmista, että uuden asian esidialogi aukesi otsikolla "Luo uusi asia"
* Klikkaa elementtiä, jossa on teksti "Hae koulutuksen järjestäjää (Y-tunnus, OID, Virastotunnus)"
* Kirjoita kenttään, jonka tyyppi on "text" arvo "0211675-2"
* Klikkaa esidialogin hakupainiketta
* Klikkaa elementtiä, jossa on teksti "Hyväksy"
* Varmista, että hakulomake on avattu otsikolla "Tampereen kaupunki"
* Assert if text exists "Päätöksen valmistelu: Järjestämisluvan muutos"
* Kirjoita kenttään, jonka parametri "id" on "paatoksentiedot.asianumero.A" arvo "VN/0000/0001"
* Klikkaa elementtiä, jossa on teksti "TALLENNA LUONNOS"
* Varmista, että hakulomake on avattu otsikolla "Tampereen kaupunki"
* Päivitä selainikkuna
* Varmista, että hakulomake on avattu otsikolla "Tampereen kaupunki"
* Varmista, ettei auki olevalle hakemukselle pääse kirjautumattomana
