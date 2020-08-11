import React from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import { useIntl } from "react-intl";

const YhteenvetoLiitteet = React.memo(props => {
  const intl = useIntl();
  const sectionId = "yhteenveto_hakemuksenLiitteet";

  return (
    <React.Fragment>
      <hr />
      <ExpandableRowRoot
        title={intl.formatMessage(wizardMessages.otherAttachments)}
        anchor={sectionId}
        key={`yhteenveto-hakemuksenLiitteet`}
        changes={props.changeObjects.hakemuksenLiitteet}
        disableReverting={true}
        showCategoryTitles={true}
        isExpanded={true}
        sectionId={sectionId}
        onUpdate={props.onChangesUpdate}
        hideAmountOfChanges={true}>
        <Lomake
          action="modification"
          anchor={sectionId}
          changeObjects={props.changeObjects.hakemuksenLiitteet}
          metadata={{
            kohde: props.kohde
          }}
          onChangesUpdate={props.onChangesUpdate}
          path={["yhteenveto", "liitteet"]}
          showCategoryTitles={true}></Lomake>
      </ExpandableRowRoot>
    </React.Fragment>
  );
});

YhteenvetoLiitteet.propTypes = {
  changeObjects: PropTypes.object,
  handleChanges: PropTypes.func,
  headingNumber: PropTypes.number,
  kohde: PropTypes.object,
  lupa: PropTypes.object
};
export default YhteenvetoLiitteet;
