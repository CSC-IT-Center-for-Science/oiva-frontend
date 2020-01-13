# Muutoshakemus

* Navigate to app
* Log in as "oiva-sanni"

## Tutkinnot

* Avaa uusi muutospyyntolomake

### Muutokset kuljettajakoulutukset, ei oikeutta järjestää

* Avaa ExpandableRow "koulutukset_kuljettajakoulutukset"
* Lomakeoperaatio "Kuljettajakoulutukset" valitse "Ei oikeutta järjestää kuorma- ja linja-autonkuljettajan ammattipätevyyskoulutusta"

### Perustelut kuljettajakoulutukset, poisto

* Seuraava sivu
* Assert if text exists "Perustelut poistolle"

### Muutokset kuljettajakoulutukset, jatko

* Edellinen sivu
* Avaa ExpandableRow "koulutukset_kuljettajakoulutukset"
* Lomakeoperaatio "Kuljettajakoulutukset" valitse "Kuljettajakoulutus, jatkokoulutus"

### Perustelut kuljettajakoulutukset, jatko

* Seuraava sivu
* Assert if text exists "Jatkokoulutusta antavan koulutuskeskuksen tehtävä"

### Muutokset työvoimakoulutus

* Edellinen sivu
* Avaa ExpandableRow "koulutukset_tyovoimakoulutukset"
* Lomakeoperaatio "Työvoimakoulutukset" valitse "Vain työvoimakoulutus"

### Perustelut työvoimakoulutus

* Seuraava sivu
* Assert if text exists "Työvoimakoulutuksen tehtävä"

___
* Sulje lomake

___
* Log out
