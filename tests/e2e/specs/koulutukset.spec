# Muutoshakemus

* Navigate to app
* Log in as "oiva-sanni"

## Koulutukset

* Avaa uusi muutospyyntolomake

### 3. radio button (ei valintaa) Kuljettajakoulutukset-kohdassa

* Avaa ExpandableRow "koulutukset_kuljettajakoulutukset"
* Assert if "radio" "koulutukset_kuljettajakoulutukset.1" is checked
* Assert if "radio" "koulutukset_kuljettajakoulutukset.2" is not checked
* Assert if "radio" "koulutukset_kuljettajakoulutukset.7" is not checked
* Select radio "koulutukset_kuljettajakoulutukset.2"

* Avaa ExpandableRow "koulutukset_tyovoimakoulutukset"
* Assert if "radio" "koulutukset_tyovoimakoulutukset.1" is checked
* Select radio "koulutukset_tyovoimakoulutukset.4"

* Seuraava sivu
* Assert if "perustelut_koulutukset_tyovoimakoulutukset.1-removal.textbox" exists



* Edellinen sivu
* Avaa ExpandableRow "koulutukset_kuljettajakoulutukset"
* Assert if "radio" "koulutukset_kuljettajakoulutukset.2" is checked
___
* Sulje lomake

___
* Log out
