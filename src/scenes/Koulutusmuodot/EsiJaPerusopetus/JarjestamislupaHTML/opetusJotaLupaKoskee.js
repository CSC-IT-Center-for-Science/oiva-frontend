import React, { useEffect, useState } from "react";
import {
  filter,
  find,
  length,
  map,
  toUpper,
  isEmpty,
  propEq,
  path,
  addIndex,
  pathEq
} from "ramda";
import { useIntl } from "react-intl";
import {
  getOpetustehtavatFromStorage,
  getOpetustehtavaKoodistoFromStorage
} from "../../../../helpers/opetustehtavat";
import Typography from "@material-ui/core/Typography";
import { getRajoitteetFromMaarays } from "../../../../utils/rajoitteetUtils";
import rajoitteet from "i18n/definitions/rajoitteet";

const defaultProps = {
  maaraykset: []
};

export default function PoOpetusJotaLupaKoskeeHtml({
  maaraykset = defaultProps.opetustehtavaMaaraykset
}) {
  const intl = useIntl();
  const locale = toUpper(intl.locale);
  const [opetustehtavatFromStorage, setOpetustehtavatFromStorage] = useState(
    []
  );
  const [opetustehtavaKoodisto, setOpetustehtavaKoodisto] = useState([]);

  /** Fetch opetustehtavat and opetustehtavaKoodisto from storage */
  useEffect(() => {
    getOpetustehtavaKoodistoFromStorage()
      .then(opetustehtavaKoodisto => {
        setOpetustehtavaKoodisto(opetustehtavaKoodisto);
      })
      .catch(err => {
        console.error(err);
      });

    getOpetustehtavatFromStorage()
      .then(opetustehtavat => {
        setOpetustehtavatFromStorage(opetustehtavat);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const opetustehtavaMaaraykset = filter(
    maarays =>
      pathEq(["kohde", "tunniste"], "opetusjotalupakoskee", maarays) &&
      maarays.koodisto === "opetustehtava",
    maaraykset
  );

  const lisatietomaarays = find(
    maarays =>
      pathEq(["kohde", "tunniste"], "opetusjotalupakoskee", maarays) &&
      maarays.koodisto === "lisatietoja",
    maaraykset
  );

  return (
    !isEmpty(opetustehtavaMaaraykset) &&
    !isEmpty(opetustehtavaKoodisto) &&
    !isEmpty(opetustehtavatFromStorage) && (
      <div className="mt-4">
        <Typography component="h3" variant="h3">
          {opetustehtavaKoodisto.metadata[toUpper(intl.locale)].kuvaus}
        </Typography>
        <ul className="ml-8 list-disc mb-4">
          {addIndex(map)((maarays, index) => {
            const result = (
              <React.Fragment key={`${maarays.koodiarvo}-${index}`}>
                <li className="leading-bulletList">
                  {path(
                    ["metadata", locale, "nimi"],
                    find(
                      propEq("koodiarvo", maarays.koodiarvo),
                      opetustehtavatFromStorage
                    )
                  )}
                </li>

                {length(maarays.aliMaaraykset)
                  ? getRajoitteetFromMaarays(maarays.aliMaaraykset, locale, intl.formatMessage(rajoitteet.ajalla))
                  : ""}
              </React.Fragment>
            );
            return result;
          }, opetustehtavaMaaraykset)}
        </ul>
        {lisatietomaarays && lisatietomaarays.meta.arvo}
      </div>
    )
  );
}
