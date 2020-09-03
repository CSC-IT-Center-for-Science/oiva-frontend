import React from "react";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import { COLORS } from "../../../modules/styles";
import PropTypes from "prop-types";
import LupaSection from "./LupaSection";

const TopSectionWrapper = styled.div`
  border-bottom: 1px solid ${COLORS.BORDER_GRAY};
`;

const InnerContentContainer = styled.div`
  background-color: ${COLORS.WHITE};
  border: 1px solid ${COLORS.BORDER_GRAY};
  box-shadow: 0 2px 4px 3px rgba(219, 219, 219, 0.2);
`;

const Jarjestamislupa = React.memo(({ sections, lupaTitle }) => {
  return (
    <InnerContentContainer>
      <div>
        <TopSectionWrapper className="p-8">
            <Typography component="h1" variant="h5">
              {lupaTitle}
            </Typography>
          </TopSectionWrapper>

        <div className="p-8">
          {sections.map((sectionData, i) => (
            <LupaSection
              key={i}
              kohde={sectionData || {}}
            />
          ))}
        </div>
      </div>
    </InnerContentContainer>
  );
});

Jarjestamislupa.propTypes = {
  sections: PropTypes.array,
  lupaTitle: PropTypes.string
};

export default Jarjestamislupa;
