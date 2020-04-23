import React from "react";
import * as R from "ramda";
import Table from "okm-frontend-components/dist/components/02-organisms/Table";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import common from "../../../i18n/definitions/common";
import { useHistory } from "react-router-dom";

const colWidths = {
  0: "w-4/6",
  1: "w-2/6"
};

function LuvatList({ luvat = [] }) {
  const history = useHistory();
  const intl = useIntl();
  const tableStructure = [
    {
      role: "thead",
      rowGroups: [
        {
          rows: [
            {
              cells: R.addIndex(R.map)(
                (col, ii) => {
                  return {
                    isSortable: true,
                    truncate: true,
                    styleClasses: [colWidths[ii]],
                    text: col.text
                  };
                },
                [
                  { text: intl.formatMessage(common.jarjestaja) },
                  { text: intl.formatMessage(common.homeCounty) }
                ]
              )
            }
          ]
        }
      ]
    },
    {
      role: "tbody",
      rowGroups: [
        {
          rows: R.addIndex(R.map)(row => {
            const jarjestajanNimi =
              row.jarjestaja.nimi[intl.locale] ||
              R.head(R.values(row.jarjestaja.nimi)) ||
              "[nimi puuttuu]";
            const maakunta = R.find(
              R.propEq("kieli", R.toUpper(intl.locale)),
              row.jarjestaja.maakuntaKoodi.metadata
            );
            return {
              id: row.jarjestajaYtunnus,
              onClick: row => {
                if (history) {
                  history.push(`jarjestajat/${row.id}/jarjestamislupa`);
                } else {
                  console.error(
                    "Järjestämislupatietojen näyttäminen epäonnistui."
                  );
                }
              },
              cells: R.addIndex(R.map)(
                (col, ii) => {
                  return {
                    truncate: true,
                    styleClasses: [colWidths[ii]],
                    text: col.text
                  };
                },
                [{ text: jarjestajanNimi }, { text: maakunta.nimi }]
              )
            };
          }, luvat)
        }
      ]
    },
    {
      role: "tfoot"
    }
  ];

  return (
    <React.Fragment>
      <Table structure={tableStructure} />
    </React.Fragment>
  );
}

LuvatList.propTypes = {
  luvat: PropTypes.array
};

export default LuvatList;
