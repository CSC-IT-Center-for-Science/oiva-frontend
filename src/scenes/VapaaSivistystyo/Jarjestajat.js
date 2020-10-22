import React from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Jarjestajaluettelo from "./Jarjestajaluettelo";
import { Helmet } from "react-helmet";
import education from "../../i18n/definitions/education";
import { useIntl } from "react-intl";

const Jarjestajat = ({ luvat }) => {
  const intl = useIntl();

  return (
    <React.Fragment>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>{intl.formatMessage(education.vstEducation)} - Oiva</title>
      </Helmet>

      <BreadcrumbsItem to="/vapaa-sivistystyo">
        {intl.formatMessage(education.vstEducation)}
      </BreadcrumbsItem>

      <Jarjestajaluettelo luvat={luvat} />
    </React.Fragment>
  );
};

export default Jarjestajat;
