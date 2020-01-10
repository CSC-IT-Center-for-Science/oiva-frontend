import React, { useEffect, useMemo } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { parseLocalizedField } from "../../../../../../../modules/helpers";
import { getCategories } from "../../../../../../../services/muutoshakemus/utils/tutkinnotUtils";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";

const Tutkinnot = React.memo(props => {
  const sectionId = "tutkinnot";
  const { onStateUpdate } = props;

  const koulutusdata = useMemo(() => {
    return R.sortBy(R.prop("koodiArvo"), R.values(props.tutkinnot));
  }, [props.tutkinnot]);

  const getItems = useMemo(() => {
    const locale = R.toUpper(props.intl.locale);

    const getArticle = (areaCode, articles = []) => {
      return R.find(article => {
        return article.koodi === areaCode;
      }, articles);
    };
    const handleKoulutusdata = koulutusdata => {
      return R.addIndex(R.map)((koulutusala, i) => {
        const areaCode = koulutusala.koodiarvo || koulutusala.koodiArvo;
        const article = getArticle(areaCode, props.lupaKohteet[1].maaraykset);
        const categories = getCategories(
          i,
          article,
          koulutusala.koulutukset,
          props.kohde,
          props.maaraystyyppi,
          props.intl
        );
        const title = parseLocalizedField(koulutusala.metadata, locale);
        return { areaCode, article, categories, title };
      }, koulutusdata);
    };

    return handleKoulutusdata;
  }, [props.intl, props.kohde, props.lupaKohteet, props.maaraystyyppi]);

  useEffect(() => {
    const items = getItems(koulutusdata);
    onStateUpdate({
      items
    });
  }, [getItems, koulutusdata, onStateUpdate]);

  return (
    <React.Fragment>
      {props.stateObject.items &&
        R.addIndex(R.map)((stateItem, i) => {
          const anchorInitial = `${sectionId}_${stateItem.areaCode}`;
          return (
            <ExpandableRowRoot
              anchor={anchorInitial}
              key={`expandable-row-root-${i}`}
              categories={stateItem.categories}
              changes={R.prop(stateItem.areaCode, props.changeObjects)}
              code={stateItem.areaCode}
              onChangesRemove={props.onChangesRemove}
              onUpdate={props.onChangesUpdate}
              sectionId={sectionId}
              showCategoryTitles={true}
              title={stateItem.title}
            />
          );
        }, props.stateObject.items)}
    </React.Fragment>
  );
});

Tutkinnot.defaultProps = {
  changeObjects: {},
  maaraystyyppi: {},
  stateObject: {}
};

Tutkinnot.propTypes = {
  changeObjects: PropTypes.object,
  kohde: PropTypes.object,
  lupaKohteet: PropTypes.object,
  maaraystyyppi: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func,
  stateObject: PropTypes.object,
  tutkinnot: PropTypes.object
};

export default injectIntl(Tutkinnot);
