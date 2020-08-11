import React from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import common from "../../../../../../../i18n/definitions/common";
import { toUpper, map, groupBy, prop, equals } from "ramda";

const Tutkinnot = React.memo(
  props => {
    const intl = useIntl();
    const sectionId = "tutkinnot";
    const localeUpper = toUpper(intl.locale);
    const tutkinnotByKoulutusala = groupBy(
      prop("koulutusalakoodiarvo"),
      props.tutkinnot || []
    );

    const changesMessages = {
      undo: intl.formatMessage(common.undo),
      changesTest: intl.formatMessage(common.changesText)
    };

    return (
      <React.Fragment>
        {map(koulutusala => {
          if (tutkinnotByKoulutusala[koulutusala.koodiarvo]) {
            const fullSectionId = `${sectionId}_${koulutusala.koodiarvo}`;
            const title = koulutusala.metadata[localeUpper].nimi;
            const tutkinnotByKoulutustyyppi = groupBy(
              prop("koulutustyyppikoodiarvo"),
              tutkinnotByKoulutusala[koulutusala.koodiarvo]
            );
            return (
              <ExpandableRowRoot
                anchor={fullSectionId}
                key={`expandable-row-root-${koulutusala.koodiarvo}`}
                changes={props.changeObjects[koulutusala.koodiarvo]}
                hideAmountOfChanges={true}
                messages={changesMessages}
                onChangesRemove={props.onChangesRemove}
                onUpdate={props.onChangesUpdate}
                sectionId={fullSectionId}
                showCategoryTitles={true}
                title={title}>
                <Lomake
                  action="modification"
                  anchor={fullSectionId}
                  changeObjects={props.changeObjects[koulutusala.koodiarvo]}
                  data={{
                    koulutusala,
                    koulutustyypit: props.koulutustyypit,
                    title,
                    tutkinnotByKoulutustyyppi
                  }}
                  onChangesUpdate={props.onChangesUpdate}
                  path={["tutkinnot"]}
                  showCategoryTitles={true}></Lomake>
              </ExpandableRowRoot>
            );
          }
          return null;
        }, props.koulutusalat)}
      </React.Fragment>
    );
  },
  (currentProps, nextProps) => {
    return equals(currentProps.changeObjects, nextProps.changeObjects);
    // return true;
  }
);

Tutkinnot.propTypes = {
  changeObjects: PropTypes.object,
  koulutusalat: PropTypes.array,
  koulutustyypit: PropTypes.array,
  onChangesUpdate: PropTypes.func,
  tutkinnot: PropTypes.array
};

export default Tutkinnot;
