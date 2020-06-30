import React, { useEffect, useState } from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import common from "../../../../../../i18n/definitions/common";
import PropTypes from "prop-types";
import Lomake from "../../../../../../components/02-organisms/Lomake";
import { useChangeObjects } from "../../../../../../stores/changeObjects";
import { useIntl } from "react-intl";
import { getMaarayksetByTunniste } from "../../../../../../helpers/lupa";
import { getMuutFromStorage } from "../../../../../../helpers/muut";

const MuutospyyntoWizardOpiskelijavuodet = React.memo(
  ({ onChangesRemove, onChangesUpdate, sectionId }) => {
    const intl = useIntl();
    const [maaraykset, setMaaraykset] = useState();
    const [muut, setMuut] = useState();
    const [muutMaaraykset, setMuutMaaraykset] = useState();
    const [changeObjects] = useChangeObjects();

    useEffect(() => {
      (async () => {
        setMuut(await getMuutFromStorage());
        setMaaraykset(await getMaarayksetByTunniste("opiskelijavuodet"));
        setMuutMaaraykset(await getMaarayksetByTunniste("muut"));
      })();
    }, []);

    const changesMessages = {
      undo: intl.formatMessage(common.undo),
      changesTest: intl.formatMessage(common.changesText)
    };

    return muut && muutMaaraykset ? (
      <ExpandableRowRoot
        anchor={sectionId}
        key={`expandable-row-root`}
        categories={[]}
        changes={changeObjects.opiskelijavuodet}
        hideAmountOfChanges={true}
        messages={changesMessages}
        onChangesRemove={onChangesRemove}
        onUpdate={onChangesUpdate}
        sectionId={sectionId}
        showCategoryTitles={true}
        isExpanded={true}>
        <Lomake
          action="modification"
          anchor={sectionId}
          changeObjects={changeObjects.opiskelijavuodet}
          data={{
            isSisaoppilaitosValueRequired: false,
            isVaativaTukiValueRequired: false,
            maaraykset,
            muut,
            muutChanges: changeObjects.muut,
            muutMaaraykset,
            sectionId: sectionId
          }}
          onChangesUpdate={onChangesUpdate}
          path={["opiskelijavuodet"]}
          rules={[]}
          showCategoryTitles={true}></Lomake>
      </ExpandableRowRoot>
    ) : null;
  }
);

MuutospyyntoWizardOpiskelijavuodet.defaultProps = {
  maaraykset: []
};

MuutospyyntoWizardOpiskelijavuodet.propTypes = {
  lupaKohteet: PropTypes.object,
  maaraykset: PropTypes.array,
  muut: PropTypes.array,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  sectionId: PropTypes.string
};

export default MuutospyyntoWizardOpiskelijavuodet;
