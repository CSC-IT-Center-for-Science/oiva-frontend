import React, { useState } from "react";
import CategoryFilter from "./index";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import osaMaastaValittu from "./storydata/osaMaastaValittu";
import kokoMaaValittu from "./storydata/kokoMaaValittu";
import eiMaariteltyaToimintaaluetta from "./storydata/eiMaariteltyaToimintaaluetta";
import kunnat from "./storydata/kunnat";
import maakunnat from "./storydata/maakunnat";

storiesOf("CategoryFilter", module)
  .addDecorator(withInfo)
  .add("Osa maasta", () => {
    const [state, setState] = useState({
      isEditViewActive: false,
      changes: osaMaastaValittu.changes
    });

    return (
      <CategoryFilter
        anchor={"maakuntakunnat"}
        isEditViewActive={state.isEditViewActive}
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
        changeObjectsByProvince={state.changes}
        showCategoryTitles={false}
        onChanges={changeObjectsByMaakunta => {
          return changeObjectsByMaakunta;
        }}
        toggleEditView={_isEditViewActive => {
          setState({ isEditViewActive: _isEditViewActive });
        }}
      />
    );
  })
  .add("Koko maa - pois lukien ahvenanmaa", () => {
    const [state, setState] = useState({
      isEditViewActive: false,
      changes: kokoMaaValittu.changes
    });
    return (
      <CategoryFilter
        anchor={"maakuntakunnat"}
        isEditViewActive={state.isEditViewActive}
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
          return changeObjectsByMaakunta;
        }}
        toggleEditView={_isEditViewActive => {
          setState({ isEditViewActive: _isEditViewActive });
        }}
      />
    );
  })
  .add("Ei määriteltyä toiminta-aluetta", () => {
    const [state, setState] = useState({
      isEditViewActive: false,
      changes: eiMaariteltyaToimintaaluetta.changes
    });
    return (
      <CategoryFilter
        anchor={"maakuntakunnat"}
        isEditViewActive={state.isEditViewActive}
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
          return changeObjectsByMaakunta;
        }}
        toggleEditView={_isEditViewActive => {
          setState({ isEditViewActive: _isEditViewActive });
        }}
      />
    );
  });
