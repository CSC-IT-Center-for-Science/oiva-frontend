import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import education from "../../../i18n/definitions/education";
import { useEsiJaPerusopetus } from "../../../stores/esiJaPerusopetus";

const constants = {
  formLocations: ["esiJaPerusopetus", "opetuksenJarjestamismuodot"]
}

const OpetuksenJarjestamismuoto = ({
  lisatiedot,
  opetuksenJarjestamismuodot,
  sectionId
}) => {
  const intl = useIntl();
  const [state, actions] = useEsiJaPerusopetus();

  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      changeObjects={state.changeObjects[sectionId]}
      data={{
        lisatiedot,
        opetuksenJarjestamismuodot
      }}
      onChangesUpdate={payload =>
        actions.setChangeObjects(payload.anchor, payload.changes)
      }
      path={constants.formLocations}
      showCategoryTitles={true}
      rowTitle={intl.formatMessage(education.opetuksenJarjestamismuodot)}></Lomake>
  );
};

OpetuksenJarjestamismuoto.propTypes = {
  lisatiedot: PropTypes.array,
  opetuksenJarjestamismuodot: PropTypes.array,
  sectionId: PropTypes.string
};

export default OpetuksenJarjestamismuoto;
