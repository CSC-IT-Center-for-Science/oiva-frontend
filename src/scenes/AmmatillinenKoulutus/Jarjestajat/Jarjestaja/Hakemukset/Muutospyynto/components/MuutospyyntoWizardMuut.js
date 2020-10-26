import React, { useEffect, useMemo, useState } from "react";
import { parseLocalizedField } from "../../../../../../../modules/helpers";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import {
  useLatestChanges,
  useLomakeSection
} from "scenes/AmmatillinenKoulutus/store";
import { useLomakedata } from "scenes/AmmatillinenKoulutus/lomakedata";
import * as R from "ramda";
import { getLatestChangesByAnchor } from "utils/common";

const constants = {
  formLocation: ["muut"]
};

/**
 * If anyone of the following codes is active a notification (Alert comp.)
 * about moving to Opiskelijavuodet section must be shown.
 * 4 = sisäoppilaitos, other codes are code values of vaativa tuki.
 */
const koodiarvot = [2, 16, 17, 18, 19, 20, 21].concat(4);

const MuutospyyntoWizardMuut = props => {
  const [changeObjects] = useLomakeSection({ anchor: "muut" });
  const [opiskelijavuodetChangeObjects] = useLomakeSection({
    anchor: "opiskelijavuodet"
  });
  const [latestChanges] = useLatestChanges();
  const [lomakedata, { setLomakedata }] = useLomakedata({
    anchor: "muut"
  });
  const [initialized, setInitialized] = useState(false);
  const intl = useIntl();
  const sectionId = "muut";

  const osiota5koskevatMaaraykset = R.filter(
    R.propEq("koodisto", "oivamuutoikeudetvelvollisuudetehdotjatehtavat"),
    props.maaraykset || []
  );

  const divideArticles = useMemo(() => {
    return () => {
      const group = {};
      const flattenArrayOfChangeObjects = R.flatten(R.values(changeObjects));
      R.forEach(article => {
        const { metadata } = article;
        const kasite =
          article.koodiarvo === "9"
            ? "selvitykset"
            : parseLocalizedField(metadata, "FI", "kasite");
        const kuvaus = parseLocalizedField(metadata, "FI", "kuvaus");
        const isInLupa = !!R.find(R.propEq("koodiarvo", article.koodiarvo))(
          osiota5koskevatMaaraykset
        );

        /**
         * Article is Määräys and there will be as many rows in section 5
         * as there are articles. Alert component will be shown for articles
         * whose code value is one of the values in koodiarvot array. The array
         * has been defined before this (MuutospyyntoWizardMuut) component.
         */
        article.showAlertBecauseOfSection5 =
          (isInLupa && R.includes(article.koodiarvo, koodiarvot)) ||
          !!R.find(changeObj => {
            const koodiarvo = R.nth(-2, R.split(".", changeObj.anchor));
            return (
              R.equals(koodiarvo, article.koodiarvo) &&
              changeObj.properties.isChecked &&
              R.includes(parseInt(koodiarvo, 10), koodiarvot)
            );
          }, flattenArrayOfChangeObjects);
        if (
          (kuvaus || R.includes(article.koodiarvo, ["22", "7", "8"])) &&
          kasite &&
          (isInLupa || article.koodiarvo !== "15")
        ) {
          group[kasite] = group[kasite] || [];
          group[kasite].push(article);
        }
      }, props.muut);
      return group;
    };
  }, [changeObjects, osiota5koskevatMaaraykset, props.muut]);

  /**
   * The config will be looped through and the forms of section 5
   * will be constructed using the data of this config.
   */
  const config = useMemo(() => {
    const dividedArticles = divideArticles();
    const localeUpper = R.toUpper(intl.locale);

    return [
      {
        code: "01",
        key: "laajennettu",
        isInUse: !!dividedArticles["laajennettu"],
        title: R.path(
          [0, "metadata", localeUpper, "nimi"],
          dividedArticles["laajennettu"]
        ),
        categoryData: [
          {
            articles: dividedArticles.laajennettu || [],
            componentName: "CheckboxWithLabel"
          }
        ]
      },
      {
        code: "02",
        key: "vaativatuki",
        isInUse:
          !!dividedArticles["vaativa_1"].length ||
          !!dividedArticles["vaativa_2"].length,
        title: R.path(
          [0, "metadata", localeUpper, "nimi"],
          dividedArticles["vaativa_1"]
        ),
        categoryData: [
          {
            articles: dividedArticles.vaativa_1 || [],
            componentName: "RadioButtonWithLabel",
            title: intl.formatMessage(wizardMessages.chooseOnlyOne)
          },
          {
            articles: dividedArticles.vaativa_2 || [],
            componentName: "CheckboxWithLabel",
            title: intl.formatMessage(wizardMessages.chooseAdditional)
          }
        ]
      },
      {
        code: "03",
        key: "sisaoppilaitos",
        isInUse: !!dividedArticles["sisaoppilaitos"].length,
        title: R.path(
          [0, "metadata", localeUpper, "nimi"],
          dividedArticles["sisaoppilaitos"]
        ),
        categoryData: [
          {
            articles: dividedArticles.sisaoppilaitos || [],
            componentName: "CheckboxWithLabel"
          }
        ]
      },
      {
        code: "04",
        key: "vankila",
        isInUse: !!dividedArticles["vankila"].length,
        title: R.path(
          [0, "metadata", localeUpper, "nimi"],
          dividedArticles["vankila"]
        ),
        categoryData: [
          {
            articles: dividedArticles.vankila || [],
            componentName: "CheckboxWithLabel"
          }
        ]
      },
      {
        code: "05",
        key: "urheilu",
        isInUse: !!dividedArticles["urheilu"].length,
        title: R.path(
          [0, "metadata", localeUpper, "nimi"],
          dividedArticles["urheilu"]
        ),
        categoryData: [
          {
            articles: dividedArticles.urheilu || [],
            componentName: "CheckboxWithLabel"
          }
        ]
      },
      {
        code: "06",
        key: "yhteistyo",
        isInUse: !!dividedArticles["yhteistyo"].length,
        title: R.path(
          [0, "metadata", localeUpper, "nimi"],
          dividedArticles["yhteistyo"]
        ),
        categoryData: [
          {
            componentName: "CheckboxWithLabel",
            articles: dividedArticles.yhteistyo || []
          }
        ]
      },
      {
        code: "08",
        key: "yhteistyosopimus",
        isInUse: !!dividedArticles["yhteistyosopimus"],
        title: R.path(
          [0, "metadata", localeUpper, "nimi"],
          dividedArticles["yhteistyosopimus"]
        ),
        categoryData: [
          {
            articles: dividedArticles.yhteistyosopimus || [],
            componentName: "CheckboxWithLabel"
          }
        ]
      },
      {
        code: "09",
        key: "selvitykset",
        isInUse: !!dividedArticles["selvitykset"],
        title: R.path(
          [0, "metadata", localeUpper, "nimi"],
          dividedArticles["selvitykset"]
        ),
        categoryData: [
          {
            articles: dividedArticles.selvitykset || [],
            componentName: "CheckboxWithLabel"
          }
        ]
      },
      {
        code: "07",
        key: "muumaarays",
        isInUse: !!dividedArticles["muumaarays"],
        title: R.path(
          [0, "metadata", localeUpper, "nimi"],
          dividedArticles["muumaarays"]
        ),
        categoryData: [
          {
            articles: dividedArticles.muumaarays || [],
            componentName: "CheckboxWithLabel"
          }
        ]
      }
    ];
  }, [divideArticles, intl]);

  useEffect(() => {
    R.map(configObj => {
      const latestSectionChanges = getLatestChangesByAnchor(
        `${sectionId}_${configObj.code}`,
        latestChanges
      );
      if (latestSectionChanges.length || !initialized) {
        setLomakedata(
          {
            configObj,
            opiskelijavuodetChangeObjects: opiskelijavuodetChangeObjects
          },
          `${sectionId}_${configObj.code}`
        );
      }
    }, R.filter(R.propEq("isInUse", true))(config));
    setInitialized(true);
  }, [latestChanges, setLomakedata]);

  return (
    <React.Fragment>
      {R.map(configObj => {
        const fullSectionId = `${sectionId}_${configObj.code}`;
        return !!lomakedata[configObj.code] ? (
          <Lomake
            action="modification"
            anchor={fullSectionId}
            data={lomakedata[configObj.code]}
            key={`lomake-${configObj.code}`}
            path={constants.formLocation}
            rowTitle={configObj.title}
            showCategoryTitles={true}
          />
        ) : null;
      }, R.filter(R.propEq("isInUse", true))(config)).filter(Boolean)}
    </React.Fragment>
  );
};

MuutospyyntoWizardMuut.propTypes = {
  headingNumber: PropTypes.number,
  maaraykset: PropTypes.array,
  muut: PropTypes.array
};

export default MuutospyyntoWizardMuut;
