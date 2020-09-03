import * as R from "ramda";
import common from "../../../i18n/definitions/common";
import {resolveLocalizedOrganizerName, resolveVSTOppilaitosNameFromLupa} from "../../../modules/helpers";

const colWidths = {
  0: "w-5/12",
  1: "w-4/12",
  2: "w-3/12"
};

export const generateVSTTableStructure = (tableData = [], intl, vstMap, history) => {
  return [
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
                  { text: intl.formatMessage(common.yllapitaja) },
                  { text: intl.formatMessage(common.VSTOppilaitosTitle) },
                  { text: intl.formatMessage(common.oppilaitostyyppi) }
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
          rows: R.addIndex(R.map)(lupa => {
            const jarjestajanNimi =
              resolveLocalizedOrganizerName(lupa, intl.locale) ||
              "[nimi puuttuu]";
            return {
              id: lupa.jarjestajaYtunnus,

              onClick: row => {
                if (history) {
                  history.push(`/lupa/${lupa.uuid}`);
                } else {
                  console.error(
                    intl.formatMessage(common.errorLoadingLupa)
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
                [
                  { text: jarjestajanNimi },
                  { text: resolveVSTOppilaitosNameFromLupa(lupa, intl.locale)},
                  { text: vstMap[lupa.oppilaitostyyppi] }
                  ]
              )
            };
          }, tableData)
        }
      ]
    },
    {
      role: "tfoot"
    }
  ];
};
