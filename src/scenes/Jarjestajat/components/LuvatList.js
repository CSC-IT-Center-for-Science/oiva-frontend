import React from "react";
import * as R from "ramda";
import Table from "../../../components/02-organisms/Table";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";

const colWidths = {
  0: "w-4/6",
  1: "w-2/6"
};

function LuvatList({ history, luvat = [] }) {
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
                  { text: "Koulutuksen järjestäjä" },
                  { text: "Kotipaikan maakunta" }
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
              row.jarjestaja.nimi.fi ||
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
  history: PropTypes.object,
  luvat: PropTypes.array
};

export default LuvatList;
