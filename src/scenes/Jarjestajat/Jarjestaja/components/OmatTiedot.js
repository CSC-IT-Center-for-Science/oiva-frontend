import React, { useMemo } from "react";
import {
  InnerContentContainer,
  InnerContentWrapper
} from "../../../../modules/elements";
import { Typography } from "@material-ui/core";
import { useIntl } from "react-intl";
import { useOrganisation } from "../../../../stores/organisation";
import common from "../../../../i18n/definitions/common";
import { useUser } from "../../../../stores/user";
import * as R from "ramda";

const OmatTiedot = ({ kunnat, maakunnat }) => {
  const intl = useIntl();

  const [organisation] = useOrganisation();
  const [user] = useUser();
  const userOrganisation = organisation[user.data.oid];

  const yhteystiedot = useMemo(() => {
    let values =
      userOrganisation.fetchedAt && userOrganisation.data
        ? {
            postinumero: userOrganisation.data.kayntiosoite.postinumeroUri
              ? userOrganisation.data.kayntiosoite.postinumeroUri.substr(6)
              : null,
            ppostinumero: userOrganisation.data.postiosoite.postinumeroUri
              ? userOrganisation.data.postiosoite.postinumeroUri.substr(6)
              : null,
            email: (
              R.find(R.prop("email"), userOrganisation.data.yhteystiedot) || {}
            ).email,
            numero: (
              R.find(R.prop("numero"), userOrganisation.data.yhteystiedot) || {}
            ).numero,
            www: (
              R.find(R.prop("www"), userOrganisation.data.yhteystiedot) || {}
            ).www
          }
        : {};

    if (kunnat.fetchedAt && maakunnat.fetchedAt) {
      const koodiarvo = userOrganisation.data.kotipaikkaUri.substr(6);
      const source = koodiarvo.length === 3 ? kunnat.data : maakunnat.data;
      const kotipaikkaObj = R.find(R.propEq("koodiArvo", koodiarvo), source);
      values.kotipaikka = (kotipaikkaObj
        ? R.find(
            R.propEq("kieli", R.toUpper(intl.locale)),
            kotipaikkaObj.metadata
          )
        : {}
      ).nimi;
    }
    return values;
  }, [
    intl.locale,
    userOrganisation.fetchedAt,
    userOrganisation.data,
    kunnat.data,
    kunnat.fetchedAt,
    maakunnat.data,
    maakunnat.fetchedAt
  ]);

  if (userOrganisation.fetchedAt && !userOrganisation.isErroneous) {
    return (
      <React.Fragment>
        {(() => {
          const {
            email,
            kotipaikka,
            numero,
            postinumero,
            ppostinumero,
            www
          } = yhteystiedot;
          return (
            <InnerContentContainer>
              <InnerContentWrapper>
                <Typography component="h2" variant="h5" className="pb-4">
                  {intl.formatMessage(common.omatTiedotTitle)}
                </Typography>
                <Typography component="h3" variant="h6">
                  {intl.formatMessage(common.omatTiedotVisitAddress)}
                </Typography>
                <p className="pb-4">
                  {userOrganisation.data.kayntiosoite.osoite}
                  {postinumero && <span>,&nbsp;</span>}
                  {postinumero}
                  {userOrganisation.data.kayntiosoite.postitoimipaikka && (
                    <span>&nbsp;</span>
                  )}
                  {userOrganisation.data.kayntiosoite.postitoimipaikka}
                </p>
                <Typography component="h3" variant="h6">
                  {intl.formatMessage(common.omatTiedotMailAddress)}
                </Typography>
                <p className="pb-4">
                  {userOrganisation.data.postiosoite.osoite &&
                    userOrganisation.data.postiosoite.osoite}
                  {ppostinumero && <span>,&nbsp;</span>}
                  {ppostinumero && ppostinumero}&nbsp;
                  {userOrganisation.data.postiosoite.postitoimipaikka && (
                    <span>&nbsp;</span>
                  )}
                  {userOrganisation.data.postiosoite.postitoimipaikka}
                </p>
                <Typography component="h3" variant="h6">
                  {intl.formatMessage(common.omatTiedotMunicipality)}
                </Typography>
                <p className="pb-4">
                  {kotipaikka && <span>{kotipaikka}</span>}
                </p>
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
              </InnerContentWrapper>
            </InnerContentContainer>
          );
        })()}
      </React.Fragment>
    );
  }
};

export default OmatTiedot;
