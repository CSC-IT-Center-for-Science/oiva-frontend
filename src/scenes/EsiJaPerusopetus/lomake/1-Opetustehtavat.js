import React from "react";
import ExpandableRowRoot from "../../../components/02-organisms/ExpandableRowRoot";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import common from "../../../i18n/definitions/common";
import { toUpper } from "ramda";

const Opetustehtavat = ({
  changeObjects,
  onChangesRemove,
  onChangesUpdate,
  opetustehtavakoodisto,
  opetustehtavat,
  sectionId
}) => {
  const intl = useIntl();

  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  };

  return (
    <ExpandableRowRoot
      anchor={sectionId}
      key={`expandable-row-root`}
      changes={changeObjects}
      hideAmountOfChanges={true}
      isExpanded={true}
      messages={changesMessages}
      onChangesRemove={onChangesRemove}
      onUpdate={onChangesUpdate}
      sectionId={sectionId}
      showCategoryTitles={true}
      title={opetustehtavakoodisto.metadata[toUpper(intl.locale)].nimi}>
      <Lomake
        action="modification"
        anchor={sectionId}
        changeObjects={changeObjects}
        data={{
          opetustehtavat
        }}
        onChangesUpdate={onChangesUpdate}
        path={["esiJaPerusopetus", "opetusJotaLupaKoskee"]}
        showCategoryTitles={true}></Lomake>
    </ExpandableRowRoot>
  );
};

Opetustehtavat.propTypes = {
  changeObjects: PropTypes.array,
  onChangesUpdate: PropTypes.func,
  opetustehtavakoodisto: PropTypes.object,
  opetustehtavat: PropTypes.array,
  sectionId: PropTypes.string
};

export default Opetustehtavat;
