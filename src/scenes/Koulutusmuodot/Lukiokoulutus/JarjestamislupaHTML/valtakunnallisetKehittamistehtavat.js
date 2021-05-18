import React, { useEffect, useState } from "react";
import {
  addIndex,
  filter,
  find,
  hasPath,
  isEmpty,
  length,
  map,
  path,
  propEq,
  sortBy,
  toUpper
} from "ramda";
import { useIntl } from "react-intl";
import education from "../../../../i18n/definitions/education";
import { getLukioErityisetKoulutustehtavatFromStorage } from "helpers/lukioErityisetKoulutustehtavat/index";
import Typography from "@material-ui/core/Typography";
import { getRajoitteetFromMaarays } from "utils/rajoitteetUtils";
import { getLocalizedProperty } from "services/lomakkeet/utils";
import LisatiedotHtmlLupa from "../../../LisatiedotHtmlLupa";
import rajoitteet from "../../../../i18n/definitions/rajoitteet";
import { PropTypes } from "prop-types";

export default function ValtakunnallisetKehittamistehtavatHtml({ maaraykset }) {
  const intl = useIntl();
  const localeUpper = toUpper(intl.locale);
  const [
    erityisetKoulutustehtavatKoodisto,
    setErityisetKoulutustehtavatKoodisto
  ] = useState([]);

  /** Fetch opetuksenJarjestamismuodot from storage */
  useEffect(() => {
    getLukioErityisetKoulutustehtavatFromStorage()
      .then(erityisetKoulutustehtavat =>
        setErityisetKoulutustehtavatKoodisto(erityisetKoulutustehtavat)
      )
      .catch(err => {
        console.error(err);
      });
  }, []);

  const valtakunnallisetKehittamistehtavatMaaraykset = sortBy(
    m => parseFloat(`${m.koodiarvo}.${path(["meta", "ankkuri"], m)}`),
    filter(
      maarays =>
        maarays.kohde.tunniste === "erityinenkoulutustehtava" &&
        maarays.koodisto === "lukioerityinenkoulutustehtavauusi" &&
        maarays.meta.isValtakunnallinenKehitystehtava,
      maaraykset
    )
  );

  const lisatietomaarays = find(
    maarays =>
      maarays.kohde.tunniste === "valtakunnallinenkehittamistehtava" &&
      maarays.koodisto === "lisatietoja",
    maaraykset
  );

  return !isEmpty(valtakunnallisetKehittamistehtavatMaaraykset) &&
    !isEmpty(erityisetKoulutustehtavatKoodisto) ? (
    <div className="mt-4">
      <Typography component="h3" variant="h3">
        {intl.formatMessage(education.valtakunnallinenKehittamistehtava)}
      </Typography>

      <ul className="ml-8 list-disc mb-4">
        {addIndex(map)((maarays, index) => {
          let naytettavaArvo = path(["meta", "kuvaus"], maarays);

          if (!naytettavaArvo) {
            const koodistosta = find(
              propEq("koodiarvo", maarays.koodiarvo),
              erityisetKoulutustehtavatKoodisto
            );

            naytettavaArvo = getLocalizedProperty(
              koodistosta.metadata,
              localeUpper,
              "kuvaus"
            );
          }

          const result = (
            <React.Fragment key={`${maarays.koodiarvo}-${index}`}>
              <li className="leading-bulletList">{naytettavaArvo}</li>

              {length(maarays.aliMaaraykset)
                ? getRajoitteetFromMaarays(
                    filter(
                      aliMaarays =>
                        hasPath(
                          ["meta", "valtakunnallinenKehittamistehtava"],
                          aliMaarays
                        ),
                      maarays.aliMaaraykset
                    ),
                    localeUpper,
                    intl.formatMessage(rajoitteet.ajalla),
                    "kuvaus"
                  )
                : ""}
            </React.Fragment>
          );
          return result;
        }, valtakunnallisetKehittamistehtavatMaaraykset)}
      </ul>
      <LisatiedotHtmlLupa lisatietomaarays={lisatietomaarays} />
    </div>
  ) : null;
}

ValtakunnallisetKehittamistehtavatHtml.propTypes = {
  maaraykset: PropTypes.array
};
