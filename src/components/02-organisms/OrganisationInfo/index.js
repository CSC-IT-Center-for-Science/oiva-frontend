import React from "react";
import { useIntl } from "react-intl";
import { find, head, last, prop, values } from "ramda";
import { Typography } from "@material-ui/core";
import isEqual from "react-fast-compare";
import { PropTypes } from "prop-types";

const OrganisationInfo = React.memo(
  ({ isPreviewModeOn, organisation }) => {
    const intl = useIntl();
    const organisationPhoneNumber = head(
      values(find(prop("numero"), organisation.yhteystiedot))
    );

    const organisationEmail = head(
      values(find(prop("email"), organisation.yhteystiedot))
    );

    const organisationWebsite = head(
      values(find(prop("www"), organisation.yhteystiedot))
    );

    return (
      <div className="bg-vaalenharmaa w-full m-auto border-b border-xs border-harmaa">
        <div
          className={`pt-4 pb-12 px-8 ${
            isPreviewModeOn ? "" : "xxl:px-0 max-w-7xl m-auto"
          }`}>
          <Typography component="h1" variant="h1">
            {organisation.nimi[intl.locale] || last(values(organisation.nimi))}
          </Typography>
          <p>
            {organisation.kayntiosoite.osoite},{" "}
            {organisation.postiosoite.osoite}{" "}
            {organisation.kayntiosoite.postitoimipaikka}
          </p>
          <p>
            {organisationPhoneNumber && (
              <React.Fragment>
                <a
                  href={`tel:${organisationPhoneNumber}`}
                  className="underline">
                  {organisationPhoneNumber}
                </a>{" "}
                |{" "}
              </React.Fragment>
            )}
            {organisationPhoneNumber && (
              <React.Fragment>
                <a href={`mailto:${organisationEmail}`} className="underline">
                  {organisationEmail}
                </a>{" "}
                |{" "}
              </React.Fragment>
            )}
            {organisation.ytunnus} |{" "}
            {organisationWebsite && (
              <a href={organisationWebsite} className="underline">
                {organisationWebsite}
              </a>
            )}
          </p>
        </div>
      </div>
    );
  },
  (cp, np) => isEqual(cp, np)
);

OrganisationInfo.propTypes = {
  isPreviewModeOn: PropTypes.bool,
  organisation: PropTypes.object
};

OrganisationInfo.displayName = "OrganisationInfo";

export default OrganisationInfo;
