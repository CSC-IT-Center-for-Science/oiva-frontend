import React, { useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import wizardMessages from "../../../../../../i18n/definitions/wizard";
import ExpandableRowRoot from "../../../../../../components/02-organisms/ExpandableRowRoot";
import {
  getAnchorPart,
  replaceAnchorPartWith,
  removeAnchorPart
} from "../../../../../../utils/common";
import { isAdded, isInLupa, isRemoved } from "../../../../../../css/label";
import * as R from "ramda";

const MuutospyyntoWizardToimintaalue = React.memo(props => {
  const { onChangesUpdate, onStateUpdate } = props;

  const lisattavatKunnat = useMemo(() => {
    return R.sortBy(
      R.prop("title"),
      R.map(changeObj => {
        return R.equals(
          getAnchorPart(changeObj.anchor, 1),
          "lupaan-lisattavat-kunnat"
        )
          ? changeObj.properties
          : null;
      }, props.changeObjects).filter(Boolean)
    );
  }, [props.changeObjects]);

  const lisattavatMaakunnat = useMemo(() => {
    return R.sortBy(
      R.prop("title"),
      R.map(changeObj => {
        return R.equals(
          getAnchorPart(changeObj.anchor, 1),
          "lupaan-lisattavat-maakunnat"
        )
          ? changeObj.properties
          : null;
      }, props.changeObjects).filter(Boolean)
    );
  }, [props.changeObjects]);

  const kunnatInLupa = useMemo(() => {
    return R.sortBy(
      R.path(["meta", "arvo"]),
      R.map(kunta => {
        return {
          title: kunta.arvo,
          meta: kunta
        };
      }, props.lupakohde.kunnat)
    );
  }, [props.lupakohde.kunnat]);

  const maakunnatInLupa = useMemo(() => {
    return R.sortBy(
      R.path(["meta", "arvo"]),
      R.map(maakunta => {
        return {
          title: maakunta.arvo,
          meta: maakunta
        };
      }, props.lupakohde.maakunnat)
    );
  }, [props.lupakohde.maakunnat]);

  const valittavissaOlevatKunnat = useMemo(() => {
    return R.sortBy(
      R.prop("label"),
      R.map(kunta => {
        const labelObject = R.find(
          R.propEq("kieli", R.toUpper(props.intl.locale))
        )(kunta.metadata);
        const isKuntaInLupa = !!R.find(
          R.pathEq(["meta", "koodiarvo"], kunta.koodiArvo),
          kunnatInLupa
        );
        const isKuntaInLisattavat = !!R.find(
          R.pathEq(["meta", "koodiarvo"], kunta.koodiArvo),
          lisattavatKunnat
        );
        return isKuntaInLupa || isKuntaInLisattavat
          ? null
          : {
              label: labelObject.nimi,
              value: kunta.koodiArvo,
              meta: {
                koodiarvo: kunta.koodiArvo,
                koodisto: kunta.koodisto
              }
            };
      }, props.kunnat).filter(Boolean)
    );
  }, [kunnatInLupa, lisattavatKunnat, props.intl.locale, props.kunnat]);

  const valittavissaOlevatMaakunnat = useMemo(() => {
    return R.sortBy(
      R.prop("label"),
      R.map(maakunta => {
        const labelObject = R.find(
          R.propEq("kieli", R.toUpper(props.intl.locale))
        )(maakunta.metadata);
        const isMaakuntaInLupa = !!R.find(
          R.pathEq(["meta", "koodiarvo"], maakunta.koodiArvo),
          maakunnatInLupa
        );
        const isMaakuntaInLisattavat = !!R.find(
          R.pathEq(["meta", "koodiarvo"], maakunta.koodiArvo),
          lisattavatMaakunnat
        );
        return isMaakuntaInLupa || isMaakuntaInLisattavat
          ? null
          : {
              label: labelObject.nimi,
              value: maakunta.koodiArvo,
              meta: {
                koodiarvo: maakunta.koodiArvo,
                koodisto: maakunta.koodisto
              }
            };
      }, props.maakunnat).filter(Boolean)
    );
  }, [
    lisattavatMaakunnat,
    maakunnatInLupa,
    props.intl.locale,
    props.maakunnat
  ]);

  const isValtakunnallinenChecked = useMemo(() => {
    const c = R.find(changeObj => {
      return R.equals(getAnchorPart(changeObj.anchor, 1), "valtakunnallinen");
    }, props.changeObjects);
    return (
      (!!props.lupakohde.valtakunnallinen && !c) ||
      !!(c && c.properties.isChecked)
    );
  }, [props.changeObjects, props.lupakohde.valtakunnallinen]);

  const handleChanges = useCallback(
    changesByAnchor => {
      const updatedChanges = R.map(changeObj => {
        let changeObjectsForKunnatInLupa = [];
        const koodistoUri = R.path(
          ["properties", "value", "meta", "koodisto", "koodistoUri"],
          changeObj
        );
        const isMaakunta = koodistoUri && koodistoUri === "maakunta";
        if (isMaakunta) {
          const relatedKunnatParentObject = R.find(
            R.propEq("koodiArvo", changeObj.properties.value.meta.koodiarvo),
            props.maakuntakunnat.maakuntakunnatList
          );
          const kunnat = relatedKunnatParentObject
            ? relatedKunnatParentObject.kunta
            : [];

          changeObjectsForKunnatInLupa = R.map(kunta => {
            const kuntaInLupa = R.find(
              R.pathEq(["meta", "koodiarvo"], kunta.koodiArvo),
              kunnatInLupa
            );
            const kuntaChangeObj = R.find(
              R.propEq(
                "anchor",
                `toimintaalue.lupaan-kuuluvat-kunnat.${kunta.koodiarvo}`
              ),
              props.changeObjects
            );
            const isKuntaAlreadyUnchecked =
              kuntaChangeObj && kuntaChangeObj.properties.isChecked === false;

            return !!kuntaInLupa && !isKuntaAlreadyUnchecked
              ? {
                  anchor: `toimintaalue.lupaan-kuuluvat-kunnat.${kunta.koodiArvo}`,
                  properties: {
                    ...kuntaInLupa.properties,
                    isChecked: false,
                    meta: {
                      koodiarvo: kunta.koodiArvo,
                      koodisto: { koodistoUri: kunta.koodisto }
                    }
                  }
                }
              : null;
          }, kunnat).filter(Boolean);
        }

        if (
          // Let's remove all the change objects which are not checked and which are not in LUPA
          R.includes("lupaan-lisattavat", changeObj.anchor) &&
          changeObj.properties.isChecked === false
        ) {
          return null;
        } else if (R.includes("valintakentat", changeObj.anchor)) {
          // Let's return a new change object based on the one user selected using select element
          const updatedAnchor = `${removeAnchorPart(
            replaceAnchorPartWith(
              changeObj.anchor,
              1,
              "lupaan-lisattavat-" + getAnchorPart(changeObj.anchor, 2)
            ),
            -1
          )}.${changeObj.properties.value.value}`;
          return [
            {
              anchor: updatedAnchor,
              properties: {
                isChecked: true,
                meta: changeObj.properties.value.meta,
                title: changeObj.properties.value.label
              }
            },
            changeObjectsForKunnatInLupa
          ];
        }
        return [changeObj, changeObjectsForKunnatInLupa];
      }, changesByAnchor.changes).filter(Boolean);

      const sectionChanges = {
        anchor: changesByAnchor.anchor,
        changes: R.flatten(updatedChanges)
      };
      onChangesUpdate(sectionChanges);
    },
    [
      onChangesUpdate,
      kunnatInLupa,
      props.changeObjects,
      props.maakuntakunnat.maakuntakunnatList
    ]
  );

  const getCategories = useMemo(() => {
    return () => [
      /**
       * VALINTAKENTTÄ - MAAKUNNAT
       */
      {
        anchor: "valintakentat-maakunta",
        isVisible: !isValtakunnallinenChecked,
        title: "Maakunnat",
        styleClasses: ["pt-0"],
        components: [
          {
            anchor: "maakunnat",
            name: "Autocomplete",
            styleClasses: ["ml-10 mt-4"],
            properties: {
              isMulti: false,
              options: valittavissaOlevatMaakunnat,
              placeholder: "Valitse maakunta...",
              value: []
            }
          }
        ]
      },
      /**
       * LUPAAN KUULUVAT MAAKUNNAT
       */
      {
        anchor: "lupaan-kuuluvat-maakunnat",
        isVisible:
          !isValtakunnallinenChecked &&
          !!maakunnatInLupa &&
          maakunnatInLupa.length > 0,
        layout: {
          indentation: "large",
          components: {
            justification: "start"
          }
        },
        components: R.map(maakunta => {
          return {
            anchor: maakunta.meta.koodiarvo,
            name: "CheckboxWithLabel",
            styleClasses: ["w-1/2 sm:w-1/4"],
            properties: {
              isChecked: true,
              labelStyles: {
                removal: isRemoved
              },
              meta: {
                koodiarvo: maakunta.meta.koodiarvo,
                koodisto: { koodistoUri: maakunta.meta.koodisto }
              },
              title: maakunta.title
            }
          };
        }, maakunnatInLupa),
        title:
          maakunnatInLupa && maakunnatInLupa.length ? "Lupaan kuuluvat" : ""
      },
      /**
       * LUPAAN LISÄTTÄVÄT MAAKUNNAT
       */
      {
        anchor: "lupaan-lisattavat-maakunnat",
        isVisible:
          !isValtakunnallinenChecked &&
          (!!lisattavatMaakunnat && lisattavatMaakunnat.length > 0),
        layout: {
          indentation: "large",
          components: {
            justification: "start"
          }
        },
        components: R.map(maakunta => {
          return {
            anchor: maakunta.meta.koodiarvo,
            name: "CheckboxWithLabel",
            styleClasses: ["w-1/2 sm:w-1/4"],
            properties: {
              isChecked: true,
              labelStyles: {
                removal: isRemoved
              },
              title: maakunta.title
            }
          };
        }, lisattavatMaakunnat),
        title: "Lupaan lisättävät"
      },
      /**
       * VALINTAKENTTÄ - KUNNAT
       */
      {
        anchor: "valintakentat-kunta",
        isVisible: !isValtakunnallinenChecked,
        title: "Kunnat",
        components: [
          {
            anchor: "kunnat",
            name: "Autocomplete",
            styleClasses: ["ml-10 mt-4"],
            properties: {
              isMulti: false,
              options: valittavissaOlevatKunnat,
              placeholder: "Valitse kunta...",
              value: []
            }
          }
        ]
      },
      /**
       * LUPAAN KUULUVAT KUNNAT
       */
      {
        anchor: "lupaan-kuuluvat-kunnat",
        isVisible:
          !isValtakunnallinenChecked && !!kunnatInLupa && kunnatInLupa.length,
        layout: {
          indentation: "large",
          components: {
            justification: "start"
          }
        },
        components: R.map(kunta => {
          return {
            anchor: kunta.meta.koodiarvo,
            name: "CheckboxWithLabel",
            styleClasses: ["w-1/2 sm:w-1/4"],
            properties: {
              isChecked: true,
              labelStyles: {
                removal: isRemoved
              },
              meta: {
                koodiarvo: kunta.meta.koodiarvo,
                koodisto: { koodistoUri: kunta.meta.koodisto }
              },
              title: kunta.title
            }
          };
        }, kunnatInLupa),
        title: kunnatInLupa && kunnatInLupa.length ? "Lupaan kuuluvat" : ""
      },
      /**
       * LUPAAN LISÄTTÄVÄT KUNNAT
       */
      {
        anchor: "lupaan-lisattavat-kunnat",
        isVisible:
          !isValtakunnallinenChecked &&
          (!!lisattavatKunnat && lisattavatKunnat.length > 0),
        layout: {
          indentation: "large",
          components: {
            justification: "start"
          }
        },
        components: R.map(kunta => {
          return {
            anchor: kunta.meta.koodiarvo,
            name: "CheckboxWithLabel",
            styleClasses: ["w-1/2 sm:w-1/4"],
            properties: {
              isChecked: true,
              labelStyles: {
                removal: isRemoved
              },
              title: kunta.title
            }
          };
        }, lisattavatKunnat),
        title: "Lupaan lisättävät"
      },
      /**
       * VALTAKUNNALLINEN
       */
      {
        anchor: "valtakunnallinen",
        title: "Koko Suomi - pois lukien Ahvenanmaan maakunta",
        components: [
          {
            anchor: "A",
            name: "CheckboxWithLabel",
            styleClasses: ["ml-10"],
            properties: {
              isChecked: isValtakunnallinenChecked,
              labelStyles: {
                addition: isAdded,
                custom: props.lupakohde.valtakunnallinen ? isInLupa : {},
                removal: isRemoved
              },
              title: props.intl.formatMessage(wizardMessages.responsibilities)
            }
          }
        ]
      }
    ];
  }, [
    isValtakunnallinenChecked,
    kunnatInLupa,
    maakunnatInLupa,
    lisattavatKunnat,
    lisattavatMaakunnat,
    props.intl,
    props.lupakohde.valtakunnallinen,
    valittavissaOlevatKunnat,
    valittavissaOlevatMaakunnat
  ]);

  useEffect(() => {
    onStateUpdate({
      categories: getCategories(),
      kohde: props.kohde,
      maaraystyyppi: props.maaraystyyppi
    });
  }, [getCategories, props.kohde, props.maaraystyyppi, onStateUpdate]);

  return (
    <React.Fragment>
      {R.path(["categories"], props.stateObjects.toimintaalue) ? (
        <ExpandableRowRoot
          anchor={props.sectionId}
          key={`expandable-row-root`}
          categories={props.stateObjects.toimintaalue.categories}
          changes={props.changeObjects}
          isExpanded={true}
          showCategoryTitles={true}
          onChangesRemove={props.onChangesRemove}
          onUpdate={handleChanges}
          title={"Yksittäiset kunnat ja maakunnat tai koko maa"}
        />
      ) : null}
    </React.Fragment>
  );
});

MuutospyyntoWizardToimintaalue.defaultProps = {
  changeObjects: [],
  muutokset: [],
  kohde: {},
  kunnat: [],
  lupakohde: {},
  maakunnat: [],
  maakuntakunnat: {},
  maaraystyyppi: {},
  stateObjects: {
    toimintaalue: {}
  }
};

MuutospyyntoWizardToimintaalue.propTypes = {
  changeObjects: PropTypes.array,
  muutokset: PropTypes.array,
  kohde: PropTypes.object,
  kunnat: PropTypes.array,
  lupakohde: PropTypes.object,
  maakunnat: PropTypes.array,
  maakuntakunnat: PropTypes.object,
  maaraystyyppi: PropTypes.object,
  onStateUpdate: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  onChangesRemove: PropTypes.func,
  stateObjects: PropTypes.object
};

export default injectIntl(MuutospyyntoWizardToimintaalue);
