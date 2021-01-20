import React from "react";
import { useIntl } from "react-intl";
import wizard from "../../../../../../../../i18n/definitions/wizard";
import PropTypes from "prop-types";
import { includes, map, pathEq } from "ramda";
import { Typography } from "@material-ui/core";
import Lomake from "components/02-organisms/Lomake";

const MuutospyyntoWizardTaloudelliset = ({ isReadOnly, tutkinnotCO }) => {
  const intl = useIntl();
  const headerLevel = isReadOnly ? "h3" : "h2";

  const isUusiaTutkintolisayksia = includes(
    true,
    map(pathEq(["properties", "isChecked"], true), tutkinnotCO || [])
  );

  return (
    <div className={`bg-vaalenharmaa ${isReadOnly ? "" : "px-16"} pt-8 w-full m-auto mb-20 border-b border-xs border-harmaa`}>
      <Typography component={headerLevel} variant={headerLevel}>
        {intl.formatMessage(wizard.pageTitle_3)}
      </Typography>

      {!isUusiaTutkintolisayksia ? (
        <p>{intl.formatMessage(wizard.noAddedTutkinnot)}</p>
      ) : (
        <div className="mb-20">
          {!isReadOnly && <p className={"mb-10"}>
            {intl.formatMessage(wizard.allFieldsRequired)}
          </p>}

          <Lomake
            mode="yleisettiedot"
            anchor="taloudelliset_yleisettiedot"
            isReadOnly={isReadOnly}
            isRowExpanded={true}
            path={["taloudelliset"]}
            rowTitle={intl.formatMessage(wizard.yleisetTiedot)}
            showCategoryTitles={true}
          ></Lomake>

          <Lomake
            mode="investoinnit"
            anchor="taloudelliset_investoinnit"
            isReadOnly={isReadOnly}
            isRowExpanded={true}
            path={["taloudelliset"]}
            rowTitle={intl.formatMessage(wizard.taloudellisetInvestoinnit)}
            showCategoryTitles={true}
          ></Lomake>

          <Lomake
            mode="tilinpaatostiedot"
            anchor="taloudelliset_tilinpaatostiedot"
            isReadOnly={isReadOnly}
            isRowExpanded={true}
            path={["taloudelliset"]}
            rowTitle={intl.formatMessage(wizard.taloudellisetTilinpaatostiedot)}
            showCategoryTitles={true}
          ></Lomake>

          <Lomake
            mode="liitteet"
            anchor={"taloudelliset_liitteet"}
            isReadOnly={isReadOnly}
            isRowExpanded={true}
            path={["taloudelliset"]}
            rowTitle={intl.formatMessage(wizard.liitteet)}
            showCategoryTitles={true}
          ></Lomake>
        </div>
      )}
    </div>
  );
};

MuutospyyntoWizardTaloudelliset.propTypes = {
  isReadOnly: PropTypes.bool,
  mode: PropTypes.string,
  muutoshakemus: PropTypes.object
};

export default MuutospyyntoWizardTaloudelliset;
