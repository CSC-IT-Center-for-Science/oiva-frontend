import React from "react";
import PropTypes from "prop-types";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import common from "../../../../../../../i18n/definitions/common";
import "./perustelut-toiminta-alue.module.css";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { useIntl } from "react-intl";

const defaultProps = {
  changeObjects: {},
  isReadOnly: false,
  kohde: {},
  lupakohde: {},
  maakuntakunnat: [],
  maaraystyyppi: {},
  stateObjects: {}
};

const PerustelutToimintaalue = React.memo(
  ({
    changeObjects = defaultProps.changeObjects,
    isReadOnly = defaultProps.isReadOnly,
    kohde = defaultProps.kohde,
    lupakohde = {},
    maakuntakunnat = defaultProps.maakuntakunnat,
    maaraystyyppi = defaultProps.maaraystyyppi,
    onChangesRemove,
    onChangesUpdate
  }) => {
    const intl = useIntl();
    const sectionId = "perustelut_toimintaalue";
    const changesMessages = {
      undo: intl.formatMessage(common.undo),
      changesTest: intl.formatMessage(common.changesText)
    };

    return (
      <React.Fragment>
        {lupakohde && lupakohde.kunnat && lupakohde.maakunnat && kohde && (
          <ExpandableRowRoot
            anchor={sectionId}
            changes={changeObjects.perustelut}
            disableReverting={false}
            hideAmountOfChanges={true}
            isExpanded={true}
            messages={changesMessages}
            onChangesRemove={onChangesRemove}
            onUpdate={onChangesUpdate}
            sectionId={sectionId}
            title="Muutokset">
            <Lomake
              action="reasoning"
              anchor={sectionId}
              changeObjects={changeObjects.perustelut}
              isReadOnly={isReadOnly}
              data={{
                changeObjectsPage1: changeObjects.toimintaalue,
                lupakohde,
                maakuntakunnat
              }}
              metadata={{ kohde, maaraystyyppi }}
              onChangesUpdate={onChangesUpdate}
              path={["perustelut", "toimintaalue"]}
              showCategoryTitles={true}></Lomake>
          </ExpandableRowRoot>
        )}
      </React.Fragment>
    );
  }
);

PerustelutToimintaalue.propTypes = {
  changeObjects: PropTypes.object,
  handleChanges: PropTypes.func,
  isReadOnly: PropTypes.bool,
  kohde: PropTypes.object,
  lupakohde: PropTypes.object,
  maakuntakunnat: PropTypes.array,
  maaraystyyppi: PropTypes.object,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func
};

export default PerustelutToimintaalue;
