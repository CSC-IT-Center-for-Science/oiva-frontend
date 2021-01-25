import React from "react";
import { useIntl } from "react-intl";
import wizard from "i18n/definitions/wizard";
import PropTypes from "prop-types";
import { includes, map, pathEq } from "ramda";
import { Typography } from "@material-ui/core";
import Lomake from "components/02-organisms/Lomake";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";

const sectionIds = [
  "taloudelliset_yleisettiedot",
  "taloudelliset_investoinnit",
  "taloudelliset_tilinpaatostiedot",
  "taloudelliset_liitteet"
];

const MuutospyyntoWizardTaloudelliset = ({ isReadOnly, tutkinnotCO }) => {
  const intl = useIntl();
  const headerLevel = isReadOnly ? "h3" : "h2";

  const isUusiaTutkintolisayksia = includes(
    true,
    map(pathEq(["properties", "isChecked"], true), tutkinnotCO || [])
  );

  const [yleisetTiedotCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionIds[0]
  });
  const [investoinnitCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionIds[1]
  });
  const [tilinpaatostiedotCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionIds[2]
  });
  const [liitteetCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionIds[3]
  });

  return (
    <form>
      <Typography component={headerLevel} variant={headerLevel}>
        {intl.formatMessage(wizard.pageTitle_3)}
      </Typography>

      {!isUusiaTutkintolisayksia ? (
        <p>{intl.formatMessage(wizard.noAddedTutkinnot)}</p>
      ) : (
        <div className="mb-20">
          {!isReadOnly && (
            <p className={"mb-10"}>
              {intl.formatMessage(wizard.allFieldsRequired)}
            </p>
          )}

          <Lomake
            anchor={sectionIds[0]}
            changeObjects={yleisetTiedotCO}
            isReadOnly={isReadOnly}
            isRowExpanded={true}
            mode="yleisettiedot"
            path={["taloudelliset"]}
            rowTitle={intl.formatMessage(wizard.yleisetTiedot)}
            showCategoryTitles={true}
          ></Lomake>

          <Lomake
            anchor={sectionIds[1]}
            changeObjects={investoinnitCO}
            isReadOnly={isReadOnly}
            isRowExpanded={true}
            mode="investoinnit"
            path={["taloudelliset"]}
            rowTitle={intl.formatMessage(wizard.taloudellisetInvestoinnit)}
            showCategoryTitles={true}
          ></Lomake>

          <Lomake
            anchor={sectionIds[2]}
            changeObjects={tilinpaatostiedotCO}
            isReadOnly={isReadOnly}
            isRowExpanded={true}
            mode="tilinpaatostiedot"
            path={["taloudelliset"]}
            rowTitle={intl.formatMessage(wizard.taloudellisetTilinpaatostiedot)}
            showCategoryTitles={true}
          ></Lomake>

          <Lomake
            anchor={sectionIds[3]}
            changeObjects={liitteetCO}
            isReadOnly={isReadOnly}
            isRowExpanded={true}
            mode="liitteet"
            path={["taloudelliset"]}
            rowTitle={intl.formatMessage(wizard.liitteet)}
            showCategoryTitles={true}
          ></Lomake>
        </div>
      )}
    </form>
  );
};

MuutospyyntoWizardTaloudelliset.propTypes = {
  isReadOnly: PropTypes.bool,
  mode: PropTypes.string,
  muutoshakemus: PropTypes.object
};

export default MuutospyyntoWizardTaloudelliset;
