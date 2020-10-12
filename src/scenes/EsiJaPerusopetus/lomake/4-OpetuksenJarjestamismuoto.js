import React from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import common from "../../../i18n/definitions/common";
import education from "../../../i18n/definitions/education";
import { useEsiJaPerusopetus } from "../../../stores/esiJaPerusopetus";

const OpetuksenJarjestamismuoto = ({
  onChangesRemove,
  opetuksenJarjestamismuodot,
  sectionId
}) => {
  const intl = useIntl();
  const [state, actions] = useEsiJaPerusopetus();

  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  };

  return (
    <ExpandableRowRoot
      anchor={sectionId}
      key={`expandable-row-root`}
      changes={state.changeObjects[sectionId]}
      hideAmountOfChanges={true}
      isExpanded={true}
      messages={changesMessages}
      onChangesRemove={onChangesRemove}
      onUpdate={payload => actions.setChangeObjects(payload.anchor, payload.changes)}
      sectionId={sectionId}
      showCategoryTitles={true}
      title={intl.formatMessage(education.opetuksenJarjestamismuodot)}>
      <Lomake
        action="modification"
        anchor={sectionId}
        changeObjects={state.changeObjects[sectionId]}
        data={{
          opetuksenJarjestamismuodot
        }}
        onChangesUpdate={payload => actions.setChangeObjects(payload.anchor, payload.changes)}
        path={["esiJaPerusopetus", "opetuksenJarjestamismuodot"]}
        showCategoryTitles={true}></Lomake>
    </ExpandableRowRoot>
  );
};

OpetuksenJarjestamismuoto.propTypes = {
  onChangesUpdate: PropTypes.func,
  opetuksenJarjestamismuodot: PropTypes.array,
  sectionId: PropTypes.string
};

export default OpetuksenJarjestamismuoto;
