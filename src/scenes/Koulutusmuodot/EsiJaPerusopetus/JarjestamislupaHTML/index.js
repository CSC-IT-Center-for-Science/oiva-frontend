import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import { Typography } from "@material-ui/core";
import styled from "styled-components";
import { COLORS } from "../../../../modules/styles";
import PoOpetuskieletHtml from "./opetuskielet";
import PoOpetuksenJarjestamismuotoHtml from "./opetuksenJarjestamismuoto";

const TopSectionWrapper = styled.div`
  border-bottom: 1px solid ${COLORS.BORDER_GRAY};
`;

/**
 * Funktio rakentaa esi- ja perusopetuksen HTML-lupanäkymän.
 * @param {*} lupa - Lupa, jonka tietoja hyödyntäen lupanäkymä muodostetaan.
 */
const JarjestamislupaJSX = ({ lupa, lupakohteet }) => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <TopSectionWrapper className="py-16">
        <Typography variant="h2">
          {formatMessage(common.htmlLuvanOtsikko, {
            date: new Date().toLocaleDateString(),
            koulutusmuodon: "esi- ja perusopetuksen",
          })}
        </Typography>
      </TopSectionWrapper>

      <PoOpetuskieletHtml maaraykset={lupa.maaraykset} />
      <PoOpetuksenJarjestamismuotoHtml maaraykset={lupa.maaraykset }/>
    </div>
  );
};

JarjestamislupaJSX.propTypes = {
  lupa: PropTypes.object.isRequired,
  lupakohteet: PropTypes.object
};

export default JarjestamislupaJSX;
