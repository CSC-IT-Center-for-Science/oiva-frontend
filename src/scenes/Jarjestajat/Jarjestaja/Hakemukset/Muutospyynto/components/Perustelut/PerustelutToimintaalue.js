import React from "react";
import PropTypes from "prop-types";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import common from "../../../../../../../i18n/definitions/common";
import "./perustelut-toiminta-alue.module.css";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { rules } from "../../../../../../../services/lomakkeet/perustelut/toiminta-alue/rules";
import { useIntl } from "react-intl";

const defaultProps = {
  changeObjects: {},
  isReadOnly: false,
  kohde: {},
  lupakohde: {},
  maaraystyyppi: {},
  stateObjects: {}
};

const PerustelutToimintaalue = React.memo(
  ({
    changeObjects = defaultProps.changeObjects,
    isReadOnly = defaultProps.isReadOnly,
    kohde = defaultProps.kohde,
    lupakohde = {},
    maaraystyyppi = defaultProps.maaraystyyppi,
    onChangesRemove,
    onChangesUpdate,
    sectionId
  }) => {
    const intl = useIntl();
    const changesMessages = {
      undo: intl.formatMessage(common.undo),
      changesTest: intl.formatMessage(common.changesText)
    }
    
    return (
      <React.Fragment>
        {lupakohde && lupakohde.kunnat && lupakohde.maakunnat && kohde && (
          <ExpandableRowRoot
            anchor={sectionId}
            categories={[]}
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
                lupakohde
              }}
              metadata={{ kohde, maaraystyyppi }}
              onChangesUpdate={onChangesUpdate}
              path={["perustelut", "toimintaalue"]}
              rules={rules}
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
  maaraystyyppi: PropTypes.object,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func
};

export default PerustelutToimintaalue;
