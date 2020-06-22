import React, { useEffect, useState } from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import common from "../../../../../../i18n/definitions/common";
import PropTypes from "prop-types";
import * as R from "ramda";
import Lomake from "../../../../../../components/02-organisms/Lomake";
import { useChangeObjects } from "../../../../../../stores/changeObjects";
import { useIntl } from "react-intl";
import { getMaarayksetByTunniste } from "../../../../../../helpers/lupa";
import { getMuutFromStorage } from "../../../../../../helpers/muut";
import * as helper from "../../../../../../helpers/opiskelijavuodet";

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

    // When sisaoppilaitos or vaativatuki are not visible, exclude them from the collection of changes updates
    useEffect(() => {
      const flattenMuutChanges = R.flatten(R.values(changeObjects.muut));
      const vaativatukiIsVisible = helper.isVaativatukiRajoitusVisible(
        muutMaaraykset,
        flattenMuutChanges
      );
      const sisaoppilaitosVisible = helper.isSisaoppilaitosRajoitusVisible(
        muutMaaraykset,
        flattenMuutChanges
      );

      // Filter out vaativa tuki and sisaoppilaitos changes values are not visible
      const filtered = R.filter(change => {
        const type = R.nth(1, R.split(".", R.prop("anchor", change)));
        if (type === "vaativatuki") {
          return vaativatukiIsVisible;
        } else if (type === "sisaoppilaitos") {
          return sisaoppilaitosVisible;
        }
        return true;
      }, changeObjects.opiskelijavuodet);

      if (!R.equals(filtered, changeObjects.opiskelijavuodet)) {
        onChangesUpdate({
          anchor: sectionId,
          changes: filtered
        });
      }
    }, [
      onChangesUpdate,
      changeObjects.muut,
      sectionId,
      muutMaaraykset,
      changeObjects.opiskelijavuodet
    ]);

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
