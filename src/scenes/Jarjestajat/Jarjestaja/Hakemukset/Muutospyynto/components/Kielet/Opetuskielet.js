import React, { useMemo } from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import common from "../../../../../../../i18n/definitions/common";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import { getDataForOpetuskieletList } from "../../../../../../../utils/opetuskieletUtil";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import * as R from "ramda";
import { useChangeObjects } from "../../../../../../../stores/changeObjects";

const Opetuskielet = React.memo(props => {
  const [changeObjects] = useChangeObjects();
  const intl = useIntl();
  const sectionId = "kielet_opetuskielet";
  const { onChangesRemove, onChangesUpdate } = props;

  const opetuskieletData = useMemo(() => {
    return getDataForOpetuskieletList(
      R.sortBy(R.prop("koodiArvo"), R.values(props.opetuskielet)),
      props.lupakohde,
      R.toUpper(intl.locale)
    );
  }, [intl.locale, props.lupakohde, props.opetuskielet]);

  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  }

  return (
    <React.Fragment>
      <ExpandableRowRoot
        anchor={sectionId}
        key={`expandable-row-root`}
        changes={changeObjects.kielet.opetuskielet}
        hideAmountOfChanges={true}
        messages={changesMessages}
        onChangesRemove={onChangesRemove}
        onUpdate={onChangesUpdate}
        sectionId={sectionId}
        title={intl.formatMessage(wizardMessages.teachingLanguages)}
        isExpanded={true}>
        {opetuskieletData && (
          <Lomake
            action="modification"
            anchor={sectionId}
            changeObjects={changeObjects.kielet.opetuskielet}
            data={{
              opetuskieletData
            }}
            onChangesUpdate={onChangesUpdate}
            path={["kielet", "opetuskielet"]}
            rules={[]}
            showCategoryTitles={true}></Lomake>
        )}
      </ExpandableRowRoot>
    </React.Fragment>
  );
});

Opetuskielet.propTypes = {
  lupakohde: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  onChangesRemove: PropTypes.func,
  opetuskielet: PropTypes.array
};

export default Opetuskielet;
