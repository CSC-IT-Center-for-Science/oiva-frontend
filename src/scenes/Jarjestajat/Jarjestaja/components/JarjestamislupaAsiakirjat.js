import React, { useMemo, useEffect } from "react";
import Media from "react-media";
import styled from "styled-components";
import { Table as OldTable, Tbody } from "../../../../modules/Table";
import { MEDIA_QUERIES } from "../../../../modules/styles";
import JarjestamislupaAsiakirjatItem from "./JarjestamislupaAsiakirjatItem";
import common from "../../../../i18n/definitions/common";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { downloadFileFn } from "../../../../utils/common";
import Table from "okm-frontend-components/dist/components/02-organisms/Table";
import { useOrganisation } from "../../../../stores/organisation";
import { useIntl } from "react-intl";
import * as R from "ramda";
import { useMuutospyynnonLiitteet } from "../../../../stores/muutospyynnonLiitteet";
import {asiaStateToLocalizationKeyMap} from "../modules/constants";

const WrapTable = styled.div``;

const colWidths = {
  0: "w-4/12",
  1: "w-3/12",
  2: "w-3/12",
  3: "w-2/12"
};

const columnTitles = [
  common.document,
  common.documentStatus,
  common.author,
  common.sent
];

// States of hakemus
const states = [
  "LUONNOS",
  "AVOIN",
  "VALMISTELUSSA",
  "TAYDENNETTAVA",
  "PAATETTY",
  "PASSIVOITU"
];

const JarjestamislupaAsiakirjat = ({ muutospyynto }) => {
  const intl = useIntl();

  const [organisation] = useOrganisation();
  const [muutospyynnonLiitteet, actions] = useMuutospyynnonLiitteet();

  // Let's fetch MUUTOSPYYNNÖN LIITTEET
  useEffect(() => {
    if (muutospyynto.uuid) {
      actions.load(muutospyynto.uuid);
    }
  }, [actions, muutospyynto.uuid]);

  const attachmentRow = ["", R.path(["nimi", intl.locale], organisation.data)];

  const baseRow = [
    muutospyynto.tila && states.includes(muutospyynto.tila)
      ? intl.formatMessage(common[asiaStateToLocalizationKeyMap[muutospyynto.tila]])
      : muutospyynto.tila,
    R.path(["nimi", intl.locale], organisation.data)
  ];

  const liitteetRowItems = useMemo(() => {
    if (muutospyynnonLiitteet.fetchedAt) {
      return R.map(
        liite => ({
          uuid: liite.uuid,
          items: [
            intl.formatMessage(
              liite.salainen ? common.secretAttachment : common.attachment
            ) +
              " " +
              R.prop("nimi", liite),
            ...attachmentRow,
            liite.luontipvm ? (
              <Moment format="D.M.YYYY">{liite.luontipvm}</Moment>
            ) : (
              ""
            )
          ],
          fileLink: `/liitteet/${liite.uuid}/raw`
        }),
        R.sortBy(R.prop("nimi"), muutospyynnonLiitteet.data || [])
      );
    }
    return [];
  }, [
    intl,
    muutospyynnonLiitteet.fetchedAt,
    muutospyynnonLiitteet.data,
    attachmentRow
  ]);

  const muutospyyntoRowItem = {
    fileLink: `/pdf/esikatsele/muutospyynto/${muutospyynto.uuid}`,
    openInNewWindow: true,
    items: [intl.formatMessage(common.application), ...baseRow, ""]
  };

  const jarjestamislupaAsiakirjatList = () => {
    return R.addIndex(R.map)(
      (row, idx) => (
        <JarjestamislupaAsiakirjatItem
          onClick={downloadFileFn({
            url: row.fileLink,
            openInNewWindow: row.openInNewWindow
          })}
          rowItems={row.items}
          key={idx}
        />
      ),
      [muutospyyntoRowItem, ...liitteetRowItems]
    );
  };

  const table = [
    {
      role: "thead",
      rowGroups: [
        {
          rows: [
            {
              cells: R.addIndex(R.map)((title, ii) => {
                return {
                  isSortable: true,
                  truncate: false,
                  styleClasses: [colWidths[ii]],
                  text: intl.formatMessage(title),
                  sortingTooltip: intl.formatMessage(common.sort)
                };
              }, columnTitles)
            }
          ]
        }
      ]
    },
    {
      role: "tbody",
      rowGroups: [
        {
          rows: R.addIndex(R.map)(
            row => {
              return {
                fileLink: row.fileLink,
                onClick: (row, action) => {
                  if (action === "click" && row.fileLink) {
                    downloadFileFn({
                      url: row.fileLink,
                      openInNewWindow: row.openInNewWindow
                    })();
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
                    { text: row.items[0] },
                    { text: row.items[1] },
                    { text: row.items[2] },
                    { text: row.items[3] }
                  ]
                )
              };
            },
            [muutospyyntoRowItem, ...liitteetRowItems]
          )
        }
      ]
    },
    {
      role: "tfoot"
    }
  ];

  return (
    <WrapTable>
      <Media
        query={MEDIA_QUERIES.MOBILE}
        render={() => (
          <OldTable role="table">
            <Tbody role="rowgroup">{jarjestamislupaAsiakirjatList()}</Tbody>
          </OldTable>
        )}
      />
      <Media
        query={MEDIA_QUERIES.TABLET_MIN}
        render={() => <Table structure={table} />}
      />
    </WrapTable>
  );
};

JarjestamislupaAsiakirjat.propTypes = {
  muutospyynto: PropTypes.object
};

export default JarjestamislupaAsiakirjat;
