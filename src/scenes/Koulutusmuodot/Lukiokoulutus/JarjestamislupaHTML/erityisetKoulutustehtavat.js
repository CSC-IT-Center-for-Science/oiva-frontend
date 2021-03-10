import React, { useEffect, useState } from "react";
import {
  addIndex,
  filter,
  find,
  isEmpty,
  length,
  map,
  path,
  propEq,
  toUpper
} from "ramda";
import { useIntl } from "react-intl";
import education from "../../../../i18n/definitions/education";
import { getLukioErityisetKoulutustehtavatFromStorage } from "helpers/lukioErityisetKoulutustehtavat/index";
import Typography from "@material-ui/core/Typography";
import { getRajoitteetFromMaarays } from "utils/rajoitteetUtils";
import { getLocalizedProperty } from "services/lomakkeet/utils";

export default function ErityisetKoulutustehtavatHtml({ maaraykset }) {
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

  const erityisetKoulutustehtavatMaaraykset = filter(
    maarays =>
      maarays.kohde.tunniste === "erityinenkoulutustehtava" &&
      maarays.koodisto === "lukioerityinenkoulutustehtavauusi",
    maaraykset
  );

  const lisatietomaarays = find(
    maarays =>
      maarays.kohde.tunniste === "erityinenkoulutustehtava" &&
      maarays.koodisto === "lisatietoja",
    maaraykset
  );

  return !isEmpty(erityisetKoulutustehtavatMaaraykset) &&
    !isEmpty(erityisetKoulutustehtavatKoodisto) ? (
    <div className="mt-4">
      <Typography component="h3" variant="h3">
        {intl.formatMessage(education.erityisetKoulutustehtavat)}
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
                    maarays.aliMaaraykset,
                    localeUpper,
                    "kuvaus"
                  )
                : ""}
            </React.Fragment>
          );
          return result;
        }, erityisetKoulutustehtavatMaaraykset)}
      </ul>
      {lisatietomaarays ? lisatietomaarays.meta.arvo : null}
    </div>
  ) : null;
}
