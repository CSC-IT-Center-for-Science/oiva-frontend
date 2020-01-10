import React, { useEffect, useMemo } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";

const PerustelutLiitteet = React.memo(props => {
  const { onStateUpdate, sectionId } = props;

  const getCategories = useMemo(() => {
    return () => {
      let structure = null;

      structure = [
        {
          anchor: "liitteet",
          components: [
            {
              name: "StatusTextRow",
              styleClasses: ["w-full"],
              properties: {
                title:
                  "Liitteen koko saa olla korkeintaan 25 MB ja tyypiltään pdf, word, excel, jpeg tai gif. Muistakaa merkitä salassa pidettävät liitteet.",
                isHidden: props.isReadOnly
              }
            },
            {
              anchor: "A",
              styleClasses: ["w-full"],
              name: "Attachments",
              properties: {
                isReadOnly: false
              }
            }
          ]
        }
      ];

      return structure;
    };
  }, [props.isReadOnly]);

  useEffect(() => {
    const array = getCategories();

    onStateUpdate(
      {
        categories: array
      },
      sectionId
    );
  }, [getCategories, onStateUpdate, sectionId]);

  return (
    <React.Fragment>
      {!!R.path(["categories"], props.stateObject) && (
        <div className="mt-4">
          <ExpandableRowRoot
            title={"Liitteet"}
            anchor={sectionId}
            key={`perustelut-liitteet`}
            categories={props.stateObject.categories}
            changes={R.path(["perustelut"], props.changeObjects)}
            disableReverting={true}
            showCategoryTitles={true}
            isExpanded={true}
            sectionId={sectionId}
            onUpdate={props.onChangesUpdate}
            hideAmountOfChanges={true}
            isReadOnly={props.isReadOnly}
            {...props}
          />
        </div>
      )}
    </React.Fragment>
  );
});

PerustelutLiitteet.propTypes = {
  changeObjects: PropTypes.object,
  handleChanges: PropTypes.func,
  headingNumber: PropTypes.number,
  kohde: PropTypes.object,
  lupa: PropTypes.object,
  onStateUpdate: PropTypes.func,
  stateObject: PropTypes.object,
  isReadOnly: PropTypes.bool
};
export default injectIntl(PerustelutLiitteet);
