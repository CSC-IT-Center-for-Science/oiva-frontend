import React, { useEffect, useState } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { parseLocalizedField } from "../../../../../../../modules/helpers";
import Section from "../../../../../../../components/03-templates/Section";
import { getCategories } from "../../../../../../../services/muutoshakemus/utils/tutkinnotUtils";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";

const Tutkinnot = React.memo(props => {
  const sectionId = "tutkinnot";
  const [koulutusdata, setKoulutusdata] = useState([]);
  const [locale, setLocale] = useState([]);

  useEffect(() => {
    setKoulutusdata(
      R.sortBy(R.prop("koodiArvo"), R.values(props.koulutukset.koulutusdata))
    );
  }, [props.koulutukset]);

  useEffect(() => {
    setLocale(R.toUpper(props.intl.locale));
  }, [props.intl.locale]);

  const getArticle = (areaCode, articles = []) => {
    return R.find(article => {
      return article.koodi === areaCode;
    }, articles);
  };

  return (
    <Section
      code={props.lupa.kohteet[1].headingNumber}
      title={props.lupa.kohteet[1].heading}
    >
      {R.addIndex(R.map)((koulutusala, i) => {
        const areaCode = koulutusala.koodiarvo || koulutusala.koodiArvo;
        const article = getArticle(areaCode, props.lupa.kohteet[1].maaraykset);
        const categories = getCategories(
          i,
          article,
          koulutusala.koulutukset,
          locale
        );
        const title = parseLocalizedField(koulutusala.metadata, locale);
        return (
          <ExpandableRowRoot
            key={`expandable-row-root-${i}`}
            categories={categories}
            changes={props.changes[i]}
            code={areaCode}
            index={i}
            onUpdate={props.onUpdate}
            sectionId={sectionId}
            title={title}
          />
        );
      }, koulutusdata)}
    </Section>
  );
});

Tutkinnot.propTypes = {
  changes: PropTypes.object,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.object,
  koulutustyypit: PropTypes.array,
  lupa: PropTypes.object,
  onUpdate: PropTypes.func
};

export default injectIntl(Tutkinnot);
