import React, { useEffect, useMemo } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import common from "../../../../../../../i18n/definitions/common";
import * as R from "ramda";

import "./perustelut-toiminta-alue.module.css";

const defaultProps = {
  changeObjects: {},
  isReadOnly: false,
  kohde: {},
  lupakohde: {},
  stateObjects: {}
};

const PerustelutToimintaalue = React.memo(
  ({
    changeObjects = defaultProps.changeObjects,
    intl,
    isReadOnly = defaultProps.isReadOnly,
    lupakohde = {},
    onStateUpdate,
    onChangesUpdate,
    sectionId,
    stateObjects = defaultProps.stateObjects
  }) => {
    const getLomake = useMemo(() => {
      return () => {
        return {
          anchor: "reasoning",
          components: [
            {
              anchor: "A",
              name: "TextBox",
              properties: {
                isReadOnly,
                placeholder: "Kirjoita perustelut"
              }
            }
          ]
        };
      };
    }, [isReadOnly]);

    const getCategories = useMemo(() => {
      return () => {
        return [
          {
            anchor: "changes",
            layout: { indentation: "none", margins: { top: "none" } },
            categories: [
              {
                anchor: "current",
                layout: { indentation: "none", margins: { top: "none" } },
                title: intl.formatMessage(common.current),
                components: (() => {
                  console.info(lupakohde);
                  const maakunnat = R.map(maakunta => {
                    return {
                      name: "StatusTextRow",
                      layout: { dense: true },
                      properties: {
                        title: maakunta.arvo
                      }
                    };
                  }, lupakohde.maakunnat);
                  const kunnat = R.map(kunta => {
                    return {
                      name: "StatusTextRow",
                      layout: { dense: true },
                      properties: {
                        title: kunta.arvo
                      }
                    };
                  }, lupakohde.kunnat);
                  return R.concat(maakunnat, kunnat);
                })()
              },
              {
                anchor: "removed",
                layout: {
                  margins: { top: "none" },
                  components: { vertical: true }
                },
                title: intl.formatMessage(common.toBeRemoved),
                components: R.map(changeObj => {
                  let json = null;
                  if (R.equals(changeObj.properties.isChecked, false)) {
                    console.info(changeObj);
                    json = {
                      name: "StatusTextRow",
                      layout: { dense: true },
                      properties: {
                        title:
                          changeObj.properties.metadata.title ||
                          changeObj.properties.metadata.label
                      }
                    };
                  }
                  return json;
                }, changeObjects.toimintaalue).filter(Boolean)
              },
              {
                anchor: "added",
                layout: {
                  margins: { top: "none" },
                  components: { vertical: true }
                },
                title: intl.formatMessage(common.toBeAdded),
                components: R.sortBy(
                  R.path(["properties", "title"]),
                  R.map(changeObj => {
                    console.info(changeObj);
                    let json = null;
                    if (
                      R.equals(changeObj.properties.isChecked, true) &&
                      changeObj.properties.metadata
                    ) {
                      json = {
                        name: "StatusTextRow",
                        layout: { dense: true },
                        properties: {
                          title:
                            R.path(
                              ["properties", "metadata", "title"],
                              changeObj
                            ) ||
                            R.path(
                              ["properties", "metadata", "label"],
                              changeObj
                            )
                        }
                      };
                    }
                    return json;
                  }, changeObjects.toimintaalue)
                ).filter(Boolean)
              }
            ]
          },
          getLomake()
        ];
      };
    }, [changeObjects.toimintaalue, getLomake, intl, lupakohde]);

    useEffect(() => {
      const categories = getCategories();
      onStateUpdate({
        categories
      });
    }, [getCategories, onStateUpdate]);

    return (
      <React.Fragment>
        {stateObjects.perustelut && (
          <ExpandableRowRoot
            anchor={sectionId}
            key={`perustelut-toimintaalue-lisattavat`}
            categories={stateObjects.perustelut.categories}
            changes={changeObjects.perustelut}
            disableReverting={true}
            hideAmountOfChanges={false}
            isExpanded={true}
            onUpdate={onChangesUpdate}
            sectionId={sectionId}
            showCategoryTitles={true}
            title="Muutokset"
          />
        )}
      </React.Fragment>
    );
  }
);

PerustelutToimintaalue.propTypes = {
  changeObjects: PropTypes.object,
  handleChanges: PropTypes.func,
  headingNumber: PropTypes.number,
  isReadOnly: PropTypes.bool,
  kohde: PropTypes.object,
  lupakohde: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func,
  stateObjects: PropTypes.object
};

export default injectIntl(PerustelutToimintaalue);
