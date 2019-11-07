import React, { useEffect, useMemo } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";

const whyDidYouRender = require("@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender.min.js");
whyDidYouRender(React, { hotReloadBufferMs: 1500 });

const categories = [
  {
    anchor: "hakemuksenliitteet",
    components: [
      {
        name: "StatusTextRow",
        styleClasses: ["w-full"],
        properties: {
          title:
            "Liitteen koko saa olla korkeintaan 25 MB ja tyypiltään pdf, word, excel, jpeg tai gif. Muistakaa merkitä salassa pidettävät liitteet."
        }
      },
      {
        anchor: "A",
        styleClasses: ["w-full"],
        name: "Attachments"
      }
    ]
  }
];

const YhteenvetoLiitteet = props => {
  const { onStateUpdate, sectionId } = props;

  useEffect(() => {
    onStateUpdate(
      {
        categories
      },
      sectionId
    );
  }, [onStateUpdate, sectionId]);

  return (
    <React.Fragment>
      <hr />
      {!!R.path(["categories"], props.stateObject) && (
        <ExpandableRowRoot
          title={"Hakemuksen yleiset liitteet 2"}
          anchor={sectionId}
          key={`yhteenveto-hakemuksenliitteet`}
          categories={props.stateObject.categories}
          changes={R.path(["yhteenveto"], props.changeObjects)}
          disableReverting={true}
          showCategoryTitles={true}
          isExpanded={true}
          sectionId={sectionId}
          onUpdate={props.onChangesUpdate}
          hideAmountOfChanges={true}
          {...props}
        />
      )}
    </React.Fragment>
  );
};

YhteenvetoLiitteet.propTypes = {
  changeObjects: PropTypes.object,
  handleChanges: PropTypes.func,
  headingNumber: PropTypes.number,
  kohde: PropTypes.object,
  lupa: PropTypes.object,
  onStateUpdate: PropTypes.func,
  stateObject: PropTypes.object
};

YhteenvetoLiitteet.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: "YhteenvetoLiitteet"
};

export default injectIntl(YhteenvetoLiitteet);
