import React, { useEffect, useState } from "react";
import commonMessages from "../../../../../../i18n/definitions/common";
import wizardMessages from "../../../../../../i18n/definitions/wizard";
import ExpandableRowRoot from "../../../../../../components/02-organisms/ExpandableRowRoot";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";

const getApplyFor = (categoryName, items) => {
  return (
    R.find(value => {
      return value.kategoria === categoryName;
    }, items || []) || {}
  ).arvo;
};

const isInLupa = (areaCode, items) => {
  return !!R.find(obj => {
    return obj.koodiarvo === areaCode;
  }, items);
};

const defaultConstraintFlags = {
  isVaativaTukiVisible: true,
  isSisaoppilaitosVisible: true,
  isVaativaTukiValueRequired: false,
  isSisaoppilaitosValueRequired: false
};

const MuutospyyntoWizardOpiskelijavuodet = React.memo(props => {
  const { onChangesRemove, onChangesUpdate, onStateUpdate } = props;
  const { opiskelijavuodet } = props.lupaKohteet[4];
  const { muutCombined } = props.lupaKohteet[5];

  const [constraintFlags, setConstraintFlags] = useState(
    defaultConstraintFlags
  );
  const [applyFor, setApplyFor] = useState(0);
  const [applyForVaativa, setApplyForVaativa] = useState(0);
  const [applyForSisaoppilaitos, setApplyForSisaoppilaitos] = useState(0);
  const [initialValue, setInitialValue] = useState(0);
  const [koodiarvot, setKoodiarvot] = useState({});
  const [initialValueVaativa] = useState(0);
  const [initialValueSisaoppilaitos] = useState(0);
  const [categories, setCategories] = useState([]);

  // This effect is run depending on existing 'lupa', from props alone (run only on first render)
  useEffect(() => {
    const relevantChangesOfSection5 = R.concat(
      (props.changesOfSection5 || {})["02"] || [],
      (props.changesOfSection5 || {})["03"] || []
    );

    setApplyForVaativa(getApplyFor("vaativa", [])); // [] = opiskelijavuosimuutoksetValue
    setApplyForSisaoppilaitos(getApplyFor("sisaoppilaitos", [])); // [] = opiskelijavuosimuutoksetValue

    const isVaativatInLupa = !!isInLupa("2", muutCombined);
    const isVaativatInChanges = !!(
      (
        R.find(
          R.propEq("anchor", "02.vaativat.16"),
          relevantChangesOfSection5
        ) || {}
      ).properties || {}
    ).isChecked;
    const isSisaoppilaitosInLupa = !!isInLupa("4", muutCombined);
    const isSisaoppilaitosInChanges = !!(
      (
        R.find(
          R.propEq("anchor", "03.sisaoppilaitos.4"),
          relevantChangesOfSection5
        ) || {}
      ).properties || {}
    ).isChecked;

    setConstraintFlags({
      isVaativaTukiVisible: isVaativatInLupa || isVaativatInChanges,
      isSisaoppilaitosVisible:
        isSisaoppilaitosInLupa || isSisaoppilaitosInChanges,
      isVaativaTukiValueRequired: !isVaativatInLupa && isVaativatInChanges,
      isSisaoppilaitosValueRequired:
        !isSisaoppilaitosInLupa && isSisaoppilaitosInChanges
    });
  }, [muutCombined, props.changesOfSection5]);

  useEffect(() => {
    setInitialValue(
      parseInt(
        (
          R.find(obj => {
            return obj.tyyppi === "Ammatillinen koulutus";
          }, opiskelijavuodet || []) || {}
        ).arvo || "0",
        10
      )
    );
  }, [opiskelijavuodet]);

  useEffect(() => {
    const tmpApplyFor = getApplyFor("vahimmaisopiskelijavuodet", []);
    setApplyFor(tmpApplyFor || initialValue); // [] = opiskelijavuosimuutoksetValue
  }, [initialValue]);

  useEffect(() => {
    const maarays = R.find(R.propEq("koodisto", "koulutussektori"))(
      props.lupa.maaraykset
    );
    if (maarays) {
      setKoodiarvot(prevState => {
        return {
          ...prevState,
          vahimmaisopiskelijavuodet: maarays.koodiarvo
        };
      });
    }
  }, [props.lupa.maaraykset]);

  useEffect(() => {
    const titles = [
      props.intl.formatMessage(commonMessages.current),
      props.intl.formatMessage(commonMessages.applyFor),
      props.intl.formatMessage(commonMessages.difference)
    ];
    const allCategories = [
      {
        anchor: "vahimmaisopiskelijavuodet",
        title: props.intl.formatMessage(wizardMessages.minimumAmountOfYears),
        components: [
          {
            anchor: "A",
            name: "Difference",
            properties: {
              initialValue: initialValue,
              applyForValue: applyFor,
              name: `${props.sectionId}-difference-1`,
              titles
            }
          }
        ]
      },
      {
        anchor: "vaativatuki",
        title: props.intl.formatMessage(wizardMessages.limitForSpecialSupport),
        components: [
          {
            anchor: "A",
            name: "Difference",
            properties: {
              isRequired: constraintFlags.isVaativaTukiValueRequired,
              initialValue: initialValueVaativa,
              applyForValue: applyForVaativa,
              name: `${props.sectionId}-difference-2`,
              titles
            }
          }
        ]
      },
      {
        anchor: "sisaoppilaitos",
        title: props.intl.formatMessage(wizardMessages.limitForBoardingSchool),
        components: [
          {
            anchor: "A",
            name: "Difference",
            properties: {
              isRequired: constraintFlags.isSisaoppilaitosValueRequired,
              initialValue: initialValueSisaoppilaitos,
              applyForValue: applyForSisaoppilaitos,
              name: `${props.sectionId}-difference-3`,
              titles
            }
          }
        ]
      }
    ];

    const activeCategories = R.filter(category => {
      return (
        category.anchor === "vahimmaisopiskelijavuodet" ||
        (category.anchor === "vaativatuki" &&
          constraintFlags.isVaativaTukiVisible) ||
        (category.anchor === "sisaoppilaitos" &&
          constraintFlags.isSisaoppilaitosVisible)
      );
    }, allCategories);
    setCategories(activeCategories);
  }, [
    applyFor,
    applyForSisaoppilaitos,
    applyForVaativa,
    initialValue,
    initialValueSisaoppilaitos,
    initialValueVaativa,
    constraintFlags,
    props.intl,
    props.sectionId
  ]);

  // This effect is run depending on changes in section 5
  useEffect(() => {
    if (props.muut && props.stateObjects.muut.muutdata) {
      let sisaoppilaitosKoodiarvo = null;
      let vaativatKoodiarvo = null;

      // Mikäli jokin alla olevista koodeista on valittuna osiossa 5, näytetään vaativaa tukea koskevat kentät osiossa 4.
      const vaativatCodes = [2, 16, 17, 18, 19, 20, 21];

      const flattenChangesOfMuut = R.flatten(
        R.values(props.changeObjects.muut)
      );

      const sisaoppilaitosState = R.find(
        R.propEq("key", "sisaoppilaitos"),
        props.stateObjects.muut.muutdata
      );

      const newConstraintFlags = {};

      if (sisaoppilaitosState) {
        const isSisaoppilaitosCheckedByDefault = sisaoppilaitosState
          ? sisaoppilaitosState.categories[0].categories[0].components[0]
              .properties.isChecked
          : false;

        // 5. osion muutosten joukosta etsitään sisäoppilaitosta koskeva muutos.
        const sisaoppilaitosChange = R.find(item => {
          return R.contains("sisaoppilaitos", item.anchor);
        })(flattenChangesOfMuut);

        // Let's pick the koodiarvo up.
        if (sisaoppilaitosChange) {
          sisaoppilaitosKoodiarvo = R.compose(
            R.view(R.lensIndex(2)),
            R.split(".")
          )(sisaoppilaitosChange.anchor);
        } else {
          sisaoppilaitosKoodiarvo = R.head(
            R.map(category => {
              return R.equals(
                true,
                R.path(["properties", "isChecked"], category.components[0])
              )
                ? category.anchor
                : null;
            }, sisaoppilaitosState.categories[0].categories).filter(Boolean)
          );
        }

        /**
         * Mikäli muutos löytyy ja sisäoppilaitosta koskeva kohta osiossa 5 on valittu, tulee sisäoppilaitosta
         * koskeva tietue näyttää osiossa 4.
         */

        const isCheckedByDefault =
          isSisaoppilaitosCheckedByDefault && !sisaoppilaitosChange;
        const isCheckedByChange =
          !!sisaoppilaitosChange && sisaoppilaitosChange.properties.isChecked;

        const shouldSisaoppilaitosBeVisible =
          isCheckedByDefault || isCheckedByChange;

        newConstraintFlags.isSisaoppilaitosVisible = shouldSisaoppilaitosBeVisible;
        newConstraintFlags.isSisaoppilaitosValueRequired = isCheckedByChange;
      }

      const vaativatukiState = R.find(
        R.propEq("key", "vaativatuki"),
        props.stateObjects.muut.muutdata
      );

      /**
       * Seuraavaksi etsitään ne vaativaa tukea koskevat - osioon 5 tehdyt - muutokset, jotka vaikuttavat
       * vaativaa tukea käsittelevän tietueen näkyvyyteen osiossa 4.
       */
      const vaativatChanges = R.filter(item => {
        const anchorParts = R.split(".", item.anchor);
        return (
          R.contains("vaativatuki", item.anchor) &&
          R.contains(parseInt(R.slice(2, 3)(anchorParts), 10), vaativatCodes)
        );
      })(flattenChangesOfMuut);

      if (vaativatukiState) {
        // Let's find out the koodiarvo for vaativa tuki.
        if (vaativatChanges.length) {
          vaativatKoodiarvo = R.compose(
            R.view(R.lensIndex(2)),
            R.split(".")
          )(vaativatChanges[0].anchor);
        } else {
          vaativatKoodiarvo = R.head(
            R.map(category => {
              return R.equals(
                true,
                R.path(["properties", "isChecked"], category.components[0])
              )
                ? category.anchor
                : null;
            }, vaativatukiState.categories[0].categories).filter(Boolean)
          );
        }

        const isVaativatukiCheckedByDefault = R.find(category => {
          return category.components[0].properties.isChecked;
        }, vaativatukiState.categories[0].categories);

        const isCheckedByChange = !!R.filter(
          R.compose(
            R.equals(true),
            R.path(["properties", "isChecked"])
          )
        )(vaativatChanges).length;

        const shouldVaativatBeVisible =
          isVaativatukiCheckedByDefault || isCheckedByChange;

        newConstraintFlags.isVaativaTukiVisible = shouldVaativatBeVisible;
        newConstraintFlags.isVaativaTukiValueRequired = isCheckedByChange;
      }

      setConstraintFlags(previousConstraintFlags => {
        return {
          ...previousConstraintFlags,
          ...newConstraintFlags
        };
      });

      // Let's set koodiarvot so that they can be used when saving the muutoshakemus.
      setKoodiarvot(prevState => {
        return {
          ...prevState,
          sisaoppilaitos: sisaoppilaitosKoodiarvo,
          vaativatuki: vaativatKoodiarvo
        };
      });
    }
  }, [props.changeObjects.muut, props.muut, props.stateObjects.muut]);

  useEffect(() => {
    if (
      !constraintFlags.isSisaoppilaitosVisible &&
      props.changeObjects.opiskelijavuodet
    ) {
      const changesWithoutSisaoppilaitosChanges = R.filter(
        R.compose(
          R.not,
          R.contains("sisaoppilaitos"),
          R.prop("anchor")
        )
      )(props.changeObjects.opiskelijavuodet);
      if (
        !R.equals(
          changesWithoutSisaoppilaitosChanges,
          props.changeObjects.opiskelijavuodet
        )
      ) {
        onChangesUpdate({
          anchor: props.sectionId,
          changes: changesWithoutSisaoppilaitosChanges
        });
      }
    }
  }, [
    constraintFlags,
    onChangesUpdate,
    props.changeObjects.opiskelijavuodet,
    props.sectionId
  ]);

  useEffect(() => {
    if (
      !constraintFlags.isVaativaTukiVisible &&
      props.changeObjects.opiskelijavuodet
    ) {
      const changesWithoutVaativaTukiChanges = R.filter(
        R.compose(
          R.not,
          R.contains("vaativatuki"),
          R.prop("anchor")
        )
      )(props.changeObjects.opiskelijavuodet);
      if (
        !R.equals(
          changesWithoutVaativaTukiChanges,
          props.changeObjects.opiskelijavuodet
        )
      ) {
        onChangesUpdate({
          anchor: props.sectionId,
          changes: changesWithoutVaativaTukiChanges
        });
      }
    }
  }, [
    constraintFlags,
    onChangesUpdate,
    props.changeObjects.opiskelijavuodet,
    props.sectionId
  ]);

  useEffect(() => {
    const maarays = R.find(R.propEq("koodisto", "koulutussektori"))(
      props.lupa.maaraykset
    );
    if (maarays) {
      setKoodiarvot(prevState => {
        return {
          ...prevState,
          vahimmaisopiskelijavuodet: maarays.koodiarvo
        };
      });
    }
  }, [props.lupa.maaraykset]);

  useEffect(() => {
    if (props.kohde && props.maaraystyyppi && props.muut) {
      onStateUpdate({
        categories,
        kohde: props.kohde,
        maaraystyyppi: props.maaraystyyppi,
        muut: props.muut,
        koodiarvot
      });
    }
  }, [
    categories,
    onStateUpdate,
    props.kohde,
    props.maaraystyyppi,
    props.muut,
    koodiarvot
  ]);

  return (
    <React.Fragment>
      {!!R.path(["opiskelijavuodet", "categories"], props.stateObjects) ? (
        <ExpandableRowRoot
          anchor={props.sectionId}
          key={`expandable-row-root`}
          categories={R.path(
            ["opiskelijavuodet", "categories"],
            props.stateObjects
          )}
          changes={R.path(["opiskelijavuodet"], props.changeObjects)}
          onChangesRemove={onChangesRemove}
          onUpdate={onChangesUpdate}
          sectionId={props.sectionId}
          showCategoryTitles={true}
          title={""}
          isExpanded={true}
        />
      ) : null}
    </React.Fragment>
  );
});

MuutospyyntoWizardOpiskelijavuodet.defaultProps = {
  changeObjects: {},
  stateObjects: {}
};

MuutospyyntoWizardOpiskelijavuodet.propTypes = {
  changeObjects: PropTypes.object,
  kohde: PropTypes.object,
  lupa: PropTypes.object,
  lupaKohteet: PropTypes.object,
  maaraystyyppi: PropTypes.object,
  muut: PropTypes.array,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func,
  stateObjects: PropTypes.object
};

export default injectIntl(MuutospyyntoWizardOpiskelijavuodet);
