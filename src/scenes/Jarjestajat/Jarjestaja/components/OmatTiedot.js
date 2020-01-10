import React, { useMemo, useEffect } from "react";
import { LUPA_TEKSTIT } from "../../../Jarjestajat/Jarjestaja/modules/constants";
import {
  InnerContentContainer,
  InnerContentWrapper
} from "../../../../modules/elements";
import { Typography } from "@material-ui/core";
import { useIntl } from "react-intl";
import { useKunnat } from "../../../../stores/kunnat";
import { useMaakunnat } from "../../../../stores/maakunnat";
import { useOrganisation } from "../../../../stores/organisation";
import * as R from "ramda";

const OmatTiedot = () => {
  const intl = useIntl();

  const [organisation] = useOrganisation();
  const [kunnat, kunnatActions] = useKunnat();
  const [maakunnat, maakunnatActions] = useMaakunnat();

  // Let's fetch KUNNAT
  useEffect(() => {
    kunnatActions.load();
  }, [kunnatActions]);

  // Let's fetch MAAKUNNAT
  useEffect(() => {
    maakunnatActions.load();
  }, [maakunnatActions]);

  const yhteystiedot = useMemo(() => {
    let values =
      organisation.fetchedAt && organisation.data
        ? {
            postinumero: organisation.data.kayntiosoite.postinumeroUri
              ? organisation.data.kayntiosoite.postinumeroUri.substr(6)
              : null,
            ppostinumero: organisation.data.postiosoite.postinumeroUri
              ? organisation.data.postiosoite.postinumeroUri.substr(6)
              : null,
            email: (
              R.find(R.prop("email"), organisation.data.yhteystiedot) || {}
            ).email,
            numero: (
              R.find(R.prop("numero"), organisation.data.yhteystiedot) || {}
            ).numero,
            www: (R.find(R.prop("www"), organisation.data.yhteystiedot) || {})
              .www
          }
        : {};

    if (kunnat.fetchedAt && maakunnat.fetchedAt) {
      const koodiarvo = organisation.data.kotipaikkaUri.substr(6);
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
    organisation.fetchedAt,
    organisation.data,
    kunnat.data,
    kunnat.fetchedAt,
    maakunnat.data,
    maakunnat.fetchedAt
  ]);

  if (organisation.fetchedAt && !organisation.isErroneous) {
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
                  {LUPA_TEKSTIT.OMATTIEDOT.OTSIKKO.FI}
                </Typography>
                <Typography component="h3" variant="h6">
                  {LUPA_TEKSTIT.OMATTIEDOT.KAYNTIOSOITE.FI}
                </Typography>
                <p className="pb-4">
                  {organisation.data.kayntiosoite.osoite}
                  {postinumero && <span>,&nbsp;</span>}
                  {postinumero}
                  {organisation.data.kayntiosoite.postitoimipaikka && (
                    <span>&nbsp;</span>
                  )}
                  {organisation.data.kayntiosoite.postitoimipaikka}
                </p>
                <Typography component="h3" variant="h6">
                  {LUPA_TEKSTIT.OMATTIEDOT.POSTIOSOITE.FI}
                </Typography>
                <p className="pb-4">
                  {organisation.data.postiosoite.osoite &&
                    organisation.data.postiosoite.osoite}
                  {ppostinumero && <span>,&nbsp;</span>}
                  {ppostinumero && ppostinumero}&nbsp;
                  {organisation.data.postiosoite.postitoimipaikka && (
                    <span>&nbsp;</span>
                  )}
                  {organisation.data.postiosoite.postitoimipaikka}
                </p>
                <Typography component="h3" variant="h6">
                  {LUPA_TEKSTIT.OMATTIEDOT.KOTIPAIKKA.FI}
                </Typography>
                <p className="pb-4">
                  {kotipaikka && <span>{kotipaikka}</span>}
                </p>
                <Typography component="h3" variant="h6">
                  {LUPA_TEKSTIT.OMATTIEDOT.YHTEYSTIEDOT.FI}
                </Typography>
                {numero && (
                  <div className="flex border-b">
                    <div className="w-1/2 sm:w-auto md:w-1/4 bg-gray-200 p-2 h-10">
                      <p>{LUPA_TEKSTIT.OMATTIEDOT.PUHELINNUMERO.FI}</p>
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
                      <p>{LUPA_TEKSTIT.OMATTIEDOT.WWWW.FI}</p>
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
                      <p>{LUPA_TEKSTIT.OMATTIEDOT.EMAIL.FI}</p>
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
                <p>{LUPA_TEKSTIT.OMATTIEDOT.INFO.FI}</p>
              </InnerContentWrapper>
            </InnerContentContainer>
          );
        })()}
      </React.Fragment>
    );
  }
};

export default OmatTiedot;
