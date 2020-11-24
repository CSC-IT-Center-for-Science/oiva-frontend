import React, { useEffect, useState } from "react";
import { filter, find, map, toUpper, isEmpty, propEq } from "ramda";
import { useIntl } from "react-intl";
import { getOpetustehtavatFromStorage, getOpetustehtavaKoodistoFromStorage } from "../../../../helpers/opetustehtavat";

export default function PoOpetusJotaLupaKoskeeHtml({ maaraykset }) {
  const intl = useIntl();
  const locale = toUpper(intl.locale);
  const [opetustehtavatFromStorage, setOpetustehtavatFromStorage] = useState([]);
  const [opetustehtavaKoodisto, setOpetustehtavaKoodisto] = useState([]);

  /** Fetch opetustehtavat and opetustehtavaKoodisto from storage */
  useEffect(() => {
    getOpetustehtavaKoodistoFromStorage().then(opetustehtavaKoodisto => {
        setOpetustehtavaKoodisto(opetustehtavaKoodisto);
      }
    ).catch(err => {
      console.error(err);
    });

    getOpetustehtavatFromStorage().then(opetustehtavat => {
        setOpetustehtavatFromStorage(opetustehtavat);
      }
    ).catch(err => {
      console.error(err);
    });
  }, []);

  const opetustehtavat = filter(
    maarays => maarays.kohde.tunniste === "opetusjotalupakoskee" &&
    maarays.koodisto === "opetustehtava",
    maaraykset);

  const lisatietomaarays = find(maarays => maarays.kohde.tunniste === "opetusjotalupakoskee" &&
    maarays.koodisto === "lisatietoja", maaraykset);

  return !isEmpty(opetustehtavat) && !isEmpty(opetustehtavaKoodisto) && !isEmpty(opetustehtavatFromStorage) && (
    <div className="mt-4">
      <h3 className="font-medium mb-4">{opetustehtavaKoodisto.metadata[toUpper(intl.locale)].kuvaus}</h3>
      <ul className="ml-8 list-disc mb-4">
        {
          map(opetustehtava =>
            <li key={opetustehtava.koodiarvo} className="leading-bulletList">
              { find(propEq("koodiarvo", opetustehtava.koodiarvo), opetustehtavatFromStorage)
                .metadata[locale].nimi }
            </li>,
          opetustehtavat)
        }
      </ul>
    </div>
  )
}