import React, { useMemo } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { parseLocalizedField } from "../../../../../../../modules/helpers";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { useChangeObjects } from "../../../../../../../stores/changeObjects";
import * as R from "ramda";

const getArticle = (areaCode, articles = []) => {
  return R.find(article => {
    return article.koodi === areaCode;
  }, articles);
};

const Tutkinnot = props => {
  const [changeObjects] = useChangeObjects();
  const intl = useIntl();
  const sectionId = "tutkinnot";

  const koulutusdata = useMemo(() => {
    return R.sortBy(R.prop("koodiArvo"), R.values(props.tutkinnot));
  }, [props.tutkinnot]);

  return (
    <React.Fragment>
      {R.addIndex(R.map)((koulutusala, i) => {
        const locale = R.toUpper(intl.locale);
        const areaCode = koulutusala.koodiarvo || koulutusala.koodiArvo;
        const anchorInitial = `${sectionId}_${areaCode}`;
        const title = parseLocalizedField(koulutusala.metadata, locale);
        const article = getArticle(areaCode, props.lupaKohteet[1].maaraykset);
        return (
          <ExpandableRowRoot
            anchor={anchorInitial}
            key={`expandable-row-root-${i}`}
            changes={changeObjects.tutkinnot[areaCode]}
            code={areaCode}
            onChangesRemove={props.onChangesRemove}
            onUpdate={props.onChangesUpdate}
            sectionId={sectionId}
            showCategoryTitles={true}
            title={title}>
            <Lomake
              action="modification"
              anchor={anchorInitial}
              changeObjects={changeObjects.tutkinnot[areaCode]}
              data={{
                areaCode,
                index: i,
                article,
                koulutustyypit: koulutusala.koulutukset,
                title
              }}
              onChangesUpdate={props.onChangesUpdate}
              path={["tutkinnot"]}
              rules={[]}
              showCategoryTitles={true}></Lomake>
          </ExpandableRowRoot>
        );
      }, koulutusdata)}
    </React.Fragment>
  );
};

Tutkinnot.propTypes = {
  lupaKohteet: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  tutkinnot: PropTypes.object
};

export default Tutkinnot;
