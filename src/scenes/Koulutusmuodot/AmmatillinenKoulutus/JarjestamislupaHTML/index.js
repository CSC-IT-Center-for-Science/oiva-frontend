import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import LupaSection from "./LupaSection";
import Typography from "@material-ui/core/Typography";
import { COLORS } from "modules/styles";
import {
  LUPA_LISAKOULUTTAJAT,
  LUPA_SECTIONS
} from "scenes/Koulutusmuodot/AmmatillinenKoulutus/JarjestamislupaHTML/constants";
import PropTypes from "prop-types";
import common from "i18n/definitions/common";
import moment from "moment";
import { getKieletFromStorage } from "helpers/kielet";

const TopSectionWrapper = styled.div`
  border-bottom: 1px solid ${COLORS.BORDER_GRAY};
`;

/**
 * Funktio rakentaa ammatillisen koulutuksen HTML-lupanäkymän
 * (TO DO: Siirrä lupanäkymän generointi tänne).
 * @param {*} lupa - Lupa, jonka tietoja hyödyntäen lupanäkymä muodostetaan.
 */
const JarjestamislupaJSX = ({ lupa, lupakohteet }) => {
  const intl = useIntl();
  // Luvan poikkeuskäsittely erikoisluville (17kpl)
  const titleMessageKey = common.lupaPageTitleAmmatillinen;
  const lupaException = LUPA_LISAKOULUTTAJAT[lupa.jarjestajaYtunnus];
  const dateString = new moment().format("D.M.YYYY");

  const [kielet, setKielet] = useState();

  useEffect(() => {
    getKieletFromStorage()
      .then(kielet => {
        setKielet(kielet);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return !!kielet ? (
    <div>
      {lupaException ? (
        <TopSectionWrapper className="pb-4">
          <Typography component="h2" variant="h5">
            {intl.formatMessage(titleMessageKey, { date: "" })}
          </Typography>
        </TopSectionWrapper>
      ) : (
        <TopSectionWrapper className="pb-4">
          <Typography component="h2" variant="h5">
            {intl.formatMessage(titleMessageKey, { date: dateString })}
          </Typography>
        </TopSectionWrapper>
      )}

      {lupaException ? (
        ""
      ) : (
        <div>
          {Object.keys(LUPA_SECTIONS).map((k, i) => {
            return (
              <LupaSection
                key={i}
                kohde={lupakohteet[k]}
                ytunnus={lupa.jarjestajaYtunnus}
                lupaAlkuPvm={lupa.alkupvm}
                kielet={kielet}
              />
            );
          })}
        </div>
      )}
    </div>
  ) : null;
};

JarjestamislupaJSX.propTypes = {
  lupa: PropTypes.object.isRequired,
  lupakohteet: PropTypes.object
};

export default JarjestamislupaJSX;
