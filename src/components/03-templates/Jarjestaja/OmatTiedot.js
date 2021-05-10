import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import * as R from "ramda";

const OmatTiedot = ({ kunnat, maakunnat, organisation }) => {
  const intl = useIntl();

  const yhteystiedot = useMemo(() => {
    let values = organisation
      ? {
          postinumero: organisation.kayntiosoite.postinumeroUri
            ? organisation.kayntiosoite.postinumeroUri.substr(6)
            : null,
          ppostinumero: organisation.postiosoite.postinumeroUri
            ? organisation.postiosoite.postinumeroUri.substr(6)
            : null,
          email: (R.find(R.prop("email"), organisation.yhteystiedot) || {})
            .email,
          numero: (R.find(R.prop("numero"), organisation.yhteystiedot) || {})
            .numero,
          www: (R.find(R.prop("www"), organisation.yhteystiedot) || {}).www
        }
      : {};

    if (kunnat.fetchedAt && maakunnat.fetchedAt) {
      const koodiarvo = organisation.kotipaikkaUri.substr(6);
      const source = koodiarvo.length === 3 ? kunnat : maakunnat;
      const kotipaikkaObj = R.find(R.propEq("koodiArvo", koodiarvo), source);
      values.kotipaikka = (
        kotipaikkaObj
          ? R.find(
              R.propEq("kieli", R.toUpper(intl.locale)),
              kotipaikkaObj.metadata
            )
          : {}
      ).nimi;
    }
    return values;
  }, [intl.locale, organisation, kunnat, maakunnat]);

  if (organisation) {
    return (
      <React.Fragment>
        {(() => {
          const { email, kotipaikka, numero, postinumero, ppostinumero, www } =
            yhteystiedot;
          return (
            <React.Fragment>
              <Typography component="h2" variant="h5" className="pb-4">
                {intl.formatMessage(common.omatTiedotTitle)}
              </Typography>
              <Typography component="h3" variant="h6">
                {intl.formatMessage(common.omatTiedotVisitAddress)}
              </Typography>
              <p className="pb-4">
                {organisation.kayntiosoite.osoite}
                {postinumero && <span>,&nbsp;</span>}
                {postinumero}
                {organisation.kayntiosoite.postitoimipaikka && (
                  <span>&nbsp;</span>
                )}
                {organisation.kayntiosoite.postitoimipaikka}
              </p>
              <Typography component="h3" variant="h6">
                {intl.formatMessage(common.omatTiedotMailAddress)}
              </Typography>
              <p className="pb-4">
                {organisation.postiosoite.osoite &&
                  organisation.postiosoite.osoite}
                {ppostinumero && <span>,&nbsp;</span>}
                {ppostinumero && ppostinumero}&nbsp;
                {organisation.postiosoite.postitoimipaikka && (
                  <span>&nbsp;</span>
                )}
                {organisation.postiosoite.postitoimipaikka}
              </p>
              <Typography component="h3" variant="h6">
                {intl.formatMessage(common.omatTiedotMunicipality)}
              </Typography>
              <p className="pb-4">{kotipaikka && <span>{kotipaikka}</span>}</p>
              <Typography component="h3" variant="h6">
                {intl.formatMessage(common.omatTiedotContactInfo)}
              </Typography>
              {numero && (
                <div className="flex border-b">
                  <div className="w-1/2 sm:w-auto md:w-1/4 bg-gray-200 p-2 h-10">
                    <p>{intl.formatMessage(common.omatTiedotPhoneNumber)}</p>
                  </div>
                  <div className="w-1/2 sm:w-auto md:w-3/4 bg-gray-100 p-2 h-10">
                    <p>
                      <a
                        title={`Call to number ${numero}`}
                        href={`tel:${numero}`}>
                        {numero}
                      </a>
                    </p>
                  </div>
                </div>
              )}
              {www && (
                <div className="flex border-b">
                  <div className="w-1/2 sm:w-auto md:w-1/4  bg-gray-200 p-2 h-10">
                    <p>{intl.formatMessage(common.omatTiedotWwwAddress)}</p>
                  </div>
                  <div className="w-1/2 sm:w-auto md:w-3/4 bg-gray-100 p-2 h-10">
                    <p>
                      <a title={`Link to ${www}`} href={www}>
                        {www}
                      </a>
                    </p>
                  </div>
                </div>
              )}
              {email && (
                <div className="flex border-b">
                  <div className="w-1/2 sm:w-auto md:w-1/4 bg-gray-200 p-2 h-10">
                    <p>{intl.formatMessage(common.omatTiedotEmailAddress)}</p>
                  </div>
                  <div className="w-1/2 sm:w-auto md:w-3/4 bg-gray-100 p-2 h-10">
                    <p>
                      <a title={`Mail to ${email}`} href={`mailto: ${email}`}>
                        {email}
                      </a>
                    </p>
                  </div>
                </div>
              )}
              <br />
              <p>{intl.formatMessage(common.omatTiedotInfo)}</p>
            </React.Fragment>
          );
        })()}
      </React.Fragment>
    );
  }
};

OmatTiedot.propTypes = {
  organisation: PropTypes.object
};

export default OmatTiedot;
