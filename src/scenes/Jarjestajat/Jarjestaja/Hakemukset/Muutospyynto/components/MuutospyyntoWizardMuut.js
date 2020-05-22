import React, { useMemo } from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import { parseLocalizedField } from "../../../../../../modules/helpers";
import wizardMessages from "../../../../../../i18n/definitions/wizard";
import common from "../../../../../../i18n/definitions/common";
import Lomake from "../../../../../../components/02-organisms/Lomake";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";
import { useChangeObjects } from "../../../../../../stores/changeObjects";

/**
 * If anyone of the following codes is active a notification (Alert comp.)
 * about moving to Opiskelijavuodet section must be shown.
 * 4 = sisäoppilaitos, other codes are code values of vaativa tuki.
 */
const koodiarvot = [2, 16, 17, 18, 19, 20, 21].concat(4);

const MuutospyyntoWizardMuut = props => {
  const [changeObjects] = useChangeObjects();
  const intl = useIntl();
  const sectionId = "muut";
  const { onChangesRemove, onChangesUpdate } = props;

  const osiota5koskevatMaaraykset = useMemo(() => {
    return R.filter(
      R.propEq("koodisto", "oivamuutoikeudetvelvollisuudetehdotjatehtavat")
    )(props.maaraykset || []);
  }, [props.maaraykset]);

  const divideArticles = useMemo(() => {
    return () => {
      const group = {};
      const flattenArrayOfChangeObjects = R.flatten(
        R.values(changeObjects.muut)
      );
      R.forEach(article => {
        const { metadata } = article;
        const kasite = parseLocalizedField(metadata, "FI", "kasite");
        const kuvaus = parseLocalizedField(metadata, "FI", "kuvaus");
        const isInLupa = !!R.find(R.propEq("koodiarvo", article.koodiArvo))(
          osiota5koskevatMaaraykset
        );
        /**
         * Article is Määräys and there will be as many rows in section 5
         * as there are articles. Alert component will be shown for articles
         * whose code value is one of the values in koodiarvot array. The array
         * has been defined before this (MuutospyyntoWizardMuut) component.
         */
        article.showAlert = !!R.find(changeObj => {
          const koodiarvo = R.nth(-2, R.split(".", changeObj.anchor));
          if (
            R.equals(koodiarvo, article.koodiArvo) &&
            changeObj.properties.isChecked &&
            R.includes(parseInt(koodiarvo, 10), koodiarvot)
          ) {
            return true;
          }
          return false;
        }, flattenArrayOfChangeObjects);
        if (
          (kuvaus || article.koodiArvo === "22") &&
          kasite &&
          (isInLupa || article.koodiArvo !== "15")
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
    return [
      {
        code: "01",
        key: "laajennettu",
        isInUse: !!dividedArticles["laajennettu"].length,
        title: "Laajennettu oppisopimuskoulutuksen järjestämistehtävä",
        categoryData: [
          {
            articles: dividedArticles.laajennettu || [],
            componentName: "CheckboxWithLabel",
            title: ""
          }
        ]
      },
      {
        code: "02",
        key: "vaativatuki",
        isInUse:
          !!dividedArticles["vaativa_1"].length ||
          !!dividedArticles["vaativa_2"].length,
        title: "Vaativan erityisen tuen tehtävä",
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
        title: "Sisäoppilaitosmuotoinen koulutus",
        categoryData: [
          {
            articles: dividedArticles.sisaoppilaitos || [],
            componentName: "CheckboxWithLabel",
            title: "",
            showAlert: true
          }
        ]
      },
      {
        code: "04",
        key: "vankila",
        isInUse: !!dividedArticles["vankila"].length,
        title: "Vankilaopetus",
        categoryData: [
          {
            articles: dividedArticles.vankila || [],
            componentName: "CheckboxWithLabel",
            title: ""
          }
        ]
      },
      {
        code: "05",
        key: "urheilu",
        isInUse: !!dividedArticles["urheilu"].length,
        title: "Urheilijoiden ammatillinen koulutus",
        categoryData: [
          {
            articles: dividedArticles.urheilu || [],
            componentName: "CheckboxWithLabel",
            title: ""
          }
        ]
      },
      {
        code: "06",
        key: "yhteistyo",
        isInUse: !!dividedArticles["yhteistyo"].length,
        title: "Yhteistyö",
        categoryData: [
          {
            componentName: "CheckboxWithLabel",
            title: "",
            articles: dividedArticles.yhteistyo || []
          }
        ]
      },
      {
        code: "07",
        key: "muumaarays",
        isInUse: !!dividedArticles["muumaarays"],
        title: "Muu määräys",
        categoryData: [
          {
            articles: dividedArticles.muumaarays || [],
            componentName: "CheckboxWithLabel",
            title: ""
          }
        ]
      }
    ];
  }, [divideArticles, intl]);

  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  }

  return (
    <React.Fragment>
      {R.addIndex(R.map)((configObj, i) => {
        return (
          <ExpandableRowRoot
            anchor={`${sectionId}_${configObj.code}`}
            key={`expandable-row-root-${i}`}
            categories={[]}
            changes={R.prop(configObj.code, changeObjects.muut)}
            hideAmountOfChanges={true}
            messages={changesMessages}
            code={configObj.code}
            index={i}
            onUpdate={onChangesUpdate}
            sectionId={sectionId}
            showCategoryTitles={true}
            title={configObj.title}
            onChangesRemove={onChangesRemove}>
            <Lomake
              action="modification"
              anchor={`${sectionId}_${configObj.code}`}
              changeObjects={R.prop(configObj.code, changeObjects.muut)}
              data={{
                configObj,
                osiota5koskevatMaaraykset
              }}
              onChangesUpdate={onChangesUpdate}
              path={["muut"]}
              rules={[]}
              showCategoryTitles={true}></Lomake>
          </ExpandableRowRoot>
        );
      }, R.filter(R.propEq("isInUse", true))(config))}
    </React.Fragment>
  );
};

MuutospyyntoWizardMuut.propTypes = {
  headingNumber: PropTypes.number,
  maaraykset: PropTypes.array,
  muut: PropTypes.array,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func
};

export default MuutospyyntoWizardMuut;
