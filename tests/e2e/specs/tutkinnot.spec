# Muutoshakemus

* Navigate to app
* Log in as "oiva-sanni"

## Tutkinnot

* Avaa uusi muutospyyntolomake

### Muutokset kuljettajakoulutukset, perus

* Avaa ExpandableRow "koulutukset_kuljettajakoulutukset"
* Lomakeoperaatio "Kuljettajakoulutukset" valitse "Kuljettajakoulutus, perustason ammattipätevyyskoulutus ja jatkokoulutus"

### Perustelut kuljettajakoulutukset, perus

* Seuraava sivu
* Assert if text exists "Perustason ammattipätevyyskoulutusta antavan koulutuskeskuksen tehtävä"

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
* Lomakeoperaatio "Työvoimakoulutukset" valitse "Työvoimakoulutus"

### Perustelut työvoimakoulutus

* Seuraava sivu
* Assert if text exists "Työvoimakoulutukset"

___
* Sulje lomake

___
* Log out
