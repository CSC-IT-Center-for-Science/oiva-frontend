import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import LupaSection from "./LupaSection";
import Typography from "@material-ui/core/Typography";
import { LUPA_SECTIONS } from "./constants";
import { COLORS } from "modules/styles";
import { LUPA_LISAKOULUTTAJAT } from "./constants";
import PropTypes from "prop-types";
import common from "i18n/definitions/common";
import moment from "moment";

const TopSectionWrapper = styled.div`
  border-bottom: 1px solid ${COLORS.BORDER_GRAY};
`;

const Jarjestamislupa = React.memo(({ lupaKohteet, lupa, kielet }) => {
  const intl = useIntl();
  // Luvan poikkeuskäsittely erikoisluville (17kpl)
  const titleMessageKey = common.lupaPageTitleAmmatillinen;
  const lupaException = LUPA_LISAKOULUTTAJAT[lupa.jarjestajaYtunnus];
  const dateString = new moment().format("D.M.YYYY");
  return (
    <div>
      {lupaException ? (
        <TopSectionWrapper className="py-16">
          <Typography component="h2" variant="h5">
            {intl.formatMessage(titleMessageKey, { date: "" })}
          </Typography>
        </TopSectionWrapper>
      ) : (
        <TopSectionWrapper className="py-16">
          <Typography component="h2" variant="h5">
            {intl.formatMessage(titleMessageKey, { date: dateString })}
          </Typography>
        </TopSectionWrapper>
      )}

      {lupaException ? (
        ""
      ) : (
        <div>
          {Object.keys(LUPA_SECTIONS).map((k, i) => (
            <LupaSection
              key={i}
              kohde={lupaKohteet[k]}
              ytunnus={lupa.jarjestajaYtunnus}
              lupaAlkuPvm={lupa.alkupvm}
              kielet={kielet}
            />
          ))}
        </div>
      )}
    </div>
  );
});

Jarjestamislupa.propTypes = {
  lupaKohteet: PropTypes.object,
  lupa: PropTypes.object
};

export default Jarjestamislupa;
