import React, { useContext } from "react";
import styled from "styled-components";
import Moment from "react-moment";
import LupaSection from "./LupaSection";
import Typography from "@material-ui/core/Typography";
import { LUPA_SECTIONS, LUPA_TEKSTIT } from "../modules/constants";
import {
  InnerContentContainer
} from "../../../../modules/elements";
import { COLORS } from "../../../../modules/styles";
import { LUPA_LISAKOULUTTAJAT } from "../../constants";
import { LuvatContext } from "context/luvatContext";

const TopSectionWrapper = styled.div`
  border-bottom: 1px solid ${COLORS.BORDER_GRAY};
`;

const Jarjestamislupa = () => {
  const { state: lupa } = useContext(LuvatContext);

  const { jarjestajaYtunnus } = lupa.data;
  const { kohteet } = lupa;

  // Luvan poikkeuskäsittely erikoisluville (17kpl)
  const lupaException = LUPA_LISAKOULUTTAJAT[jarjestajaYtunnus];

  return (
    <InnerContentContainer>
      <div>
        {lupaException ? (
          <TopSectionWrapper className="p-8">
            <Typography component="h1" variant="h5">{LUPA_TEKSTIT.LUPA.OTSIKKO.FI}</Typography>
          </TopSectionWrapper>
        ) : (
          <TopSectionWrapper className="p-8">
            <Typography component="h1" variant="h5">
              {LUPA_TEKSTIT.LUPA.OTSIKKO.FI} <Moment format="DD.MM.YYYY" />
            </Typography>
          </TopSectionWrapper>
        )}

        {lupaException ? (
          ""
        ) : (
          <div className="p-8">
            {Object.keys(LUPA_SECTIONS).map((k, i) => (
              <LupaSection
                kohde={kohteet[k]}
                ytunnus={jarjestajaYtunnus}
                key={i}
              />
            ))}
          </div>
        )}
      </div>
    </InnerContentContainer>
  );
};

export default Jarjestamislupa;
