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
  pathEq,
  propEq,
  toUpper
} from "ramda";
import { useIntl } from "react-intl";
import education from "../../../../i18n/definitions/education";
import { getLukioErityisetKoulutustehtavatFromStorage } from "helpers/lukioErityisetKoulutustehtavat/index";
import Typography from "@material-ui/core/Typography";
import { getRajoitteetFromMaarays } from "utils/rajoitteetUtils";
import { getLocalizedProperty } from "services/lomakkeet/utils";
import LisatiedotHtmlLupa from "../../../LisatiedotHtmlLupa";

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

  const erityinenkoulutustehtavaMaaraykset = filter(
    maarays =>
      maarays.kohde.tunniste === "erityinenkoulutustehtava" &&
      maarays.koodisto === "lukioerityinenkoulutustehtavauusi",
    maaraykset
  );

  const valtakunnallinenKehittamistehtavaMaaraykset = filter(
    maarays =>
      pathEq(
        ["kohde", "tunniste"],
        "valtakunnallinenkehittamistehtava",
        maarays
      ) && propEq("koodisto", "valtakunnallinenkehittamistehtava", maarays),
    maaraykset
  );

  const lisatietomaarays = find(
    maarays =>
      maarays.kohde.tunniste === "valtakunnallinenkehittamistehtava" &&
      maarays.koodisto === "lisatietoja",
    maaraykset
  );

  return !isEmpty(valtakunnallinenKehittamistehtavaMaaraykset) &&
    !isEmpty(erityinenkoulutustehtavaMaaraykset) &&
    !isEmpty(erityisetKoulutustehtavatKoodisto) ? (
    <div className="mt-4">
      <Typography component="h3" variant="h3">
        {intl.formatMessage(education.valtakunnallinenKehittamistehtava)}
      </Typography>

      <ul className="ml-8 list-disc mb-4">
        {addIndex(map)((maarays, index) => {
          const vastaavaErityinenKoulutustehtavaMaarays = find(
            eritMaarays =>
              propEq("koodiarvo", maarays.koodiarvo, eritMaarays) &&
              pathEq(
                ["meta", "ankkuri"],
                path(["meta", "ankkuri"], maarays),
                eritMaarays
              ),
            erityinenkoulutustehtavaMaaraykset
          );

          let naytettavaArvo = path(
            ["meta", "kuvaus"],
            vastaavaErityinenKoulutustehtavaMaarays
          );

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
                    "kuvaus"
                  )
                : ""}
            </React.Fragment>
          );
          return result;
        }, valtakunnallinenKehittamistehtavaMaaraykset)}
      </ul>
      <LisatiedotHtmlLupa lisatietomaarays={lisatietomaarays} />
    </div>
  ) : null;
}
