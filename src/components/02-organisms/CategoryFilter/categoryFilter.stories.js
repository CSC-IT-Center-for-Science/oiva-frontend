import React from "react";
import CategoryFilter from "./index";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { withState } from "@dump247/storybook-state";
import osaMaastaValittu from "./storydata/osaMaastaValittu";
import kokoMaaValittu from "./storydata/kokoMaaValittu";
import eiMaariteltyaToimintaaluetta from "./storydata/eiMaariteltyaToimintaaluetta";
import kunnat from "./storydata/kunnat";
import maakunnat from "./storydata/maakunnat";

const initialState = {
  isEditViewActive: false
};

storiesOf("CategoryFilter", module)
  .addDecorator(withInfo)
  .add(
    "Osa maasta",
    withState(initialState)(({ store }) => (
      <CategoryFilter
        anchor={"maakuntakunnat"}
        isEditViewActive={store.state.isEditViewActive}
        localizations={{
          accept: "Hyväksy",
          areaOfActionIsUndefined: "Ei määritettyä toiminta-aluetta",
          cancel: "Peruuta",
          currentAreaOfAction: "Nykyinen toiminta-alue",
          newAreaOfAction: "Uusi toiminta-alue",
          ofMunicipalities: "kunnista",
          quickFilter: "Pikavalinnat",
          sameAsTheCurrentAreaOfAction: "Sama kuin nykyinen toiminta-alue",
          wholeCountryWithoutAhvenanmaa:
            "Koko maa - pois lukien Ahvenanmaan maakunnat"
        }}
        municipalities={kunnat}
        provinces={osaMaastaValittu.categories}
        provincesWithoutMunicipalities={maakunnat}
        changeObjectsByProvince={{}}
        showCategoryTitles={false}
        onChanges={changeObjectsByMaakunta => {
          console.info(changeObjectsByMaakunta);
          return changeObjectsByMaakunta;
        }}
        toggleEditView={_isEditViewActive => {
          console.info(_isEditViewActive);
          store.set({ isEditViewActive: _isEditViewActive });
        }}
      />
    ))
  )
  .add(
    "Koko maa - pois lukien ahvenanmaa",
    withState(initialState)(({ store }) => (
      <CategoryFilter
        anchor={"maakuntakunnat"}
        isEditViewActive={store.state.isEditViewActive}
        localizations={{
          accept: "Hyväksy",
          areaOfActionIsUndefined: "Ei määritettyä toiminta-aluetta",
          cancel: "Peruuta",
          currentAreaOfAction: "Nykyinen toiminta-alue",
          newAreaOfAction: "Uusi toiminta-alue",
          ofMunicipalities: "kunnista",
          quickFilter: "Pikavalinnat",
          sameAsTheCurrentAreaOfAction: "Sama kuin nykyinen toiminta-alue",
          wholeCountryWithoutAhvenanmaa:
            "Koko maa - pois lukien Ahvenanmaan maakunnat"
        }}
        municipalities={kunnat}
        provinces={kokoMaaValittu.categories}
        provincesWithoutMunicipalities={maakunnat}
        changeObjectsByProvince={{}}
        showCategoryTitles={false}
        onChanges={changeObjectsByMaakunta => {
          console.info(changeObjectsByMaakunta);
          return changeObjectsByMaakunta;
        }}
        toggleEditView={_isEditViewActive => {
          console.info(_isEditViewActive);
          store.set({ isEditViewActive: _isEditViewActive });
        }}
      />
    ))
  )
  .add(
    "Ei määriteltyä toiminta-aluetta",
    withState(initialState)(({ store }) => (
      <CategoryFilter
        anchor={"maakuntakunnat"}
        isEditViewActive={store.state.isEditViewActive}
        localizations={{
          accept: "Hyväksy",
          areaOfActionIsUndefined: "Ei määritettyä toiminta-aluetta",
          cancel: "Peruuta",
          currentAreaOfAction: "Nykyinen toiminta-alue",
          newAreaOfAction: "Uusi toiminta-alue",
          ofMunicipalities: "kunnista",
          quickFilter: "Pikavalinnat",
          sameAsTheCurrentAreaOfAction: "Sama kuin nykyinen toiminta-alue",
          wholeCountryWithoutAhvenanmaa:
            "Koko maa - pois lukien Ahvenanmaan maakunnat"
        }}
        municipalities={kunnat}
        provinces={eiMaariteltyaToimintaaluetta.categories}
        provincesWithoutMunicipalities={maakunnat}
        changeObjectsByProvince={{}}
        showCategoryTitles={false}
        onChanges={changeObjectsByMaakunta => {
          console.info(changeObjectsByMaakunta);
          return changeObjectsByMaakunta;
        }}
        toggleEditView={_isEditViewActive => {
          console.info(_isEditViewActive);
          store.set({ isEditViewActive: _isEditViewActive });
        }}
      />
    ))
  );
