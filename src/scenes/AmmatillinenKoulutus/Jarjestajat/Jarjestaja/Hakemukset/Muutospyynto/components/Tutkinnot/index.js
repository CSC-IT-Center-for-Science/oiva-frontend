import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../../components/02-organisms/Lomake";
import { toUpper, map, groupBy, prop, equals } from "ramda";

const constants = {
  formLocation: ["tutkinnot"]
};

const Tutkinnot = React.memo(
  props => {
    const intl = useIntl();
    const sectionId = "tutkinnot";
    const localeUpper = toUpper(intl.locale);
    const tutkinnotByKoulutusala = groupBy(
      prop("koulutusalakoodiarvo"),
      props.tutkinnot || []
    );

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
            const lomakedata = {
              koulutusala,
              koulutustyypit: props.koulutustyypit,
              title,
              tutkinnotByKoulutustyyppi
            };

            return (
              <Lomake
                action="modification"
                anchor={fullSectionId}
                data={lomakedata}
                key={fullSectionId}
                path={constants.formLocation}
                rowTitle={title}
                showCategoryTitles={true}></Lomake>
            );
          }
          return null;
        }, props.koulutusalat)}
      </React.Fragment>
    );
  },
  (currentProps, nextProps) => {
    return equals(currentProps.changeObjects, nextProps.changeObjects);
  }
);

Tutkinnot.propTypes = {
  koulutusalat: PropTypes.array,
  koulutustyypit: PropTypes.array,
  tutkinnot: PropTypes.array
};

export default Tutkinnot;
