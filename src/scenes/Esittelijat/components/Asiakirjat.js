import React, { useMemo, useEffect } from "react";
import Media from "react-media";
import styled from "styled-components";
import { Table as OldTable, Tbody } from "../../../modules/Table";
import { MEDIA_QUERIES } from "../../../modules/styles";
import AsiakirjatItem from "./AsiakirjatItem";
import common from "../../../i18n/definitions/common";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { downloadFileFn } from "../../../utils/common";
import Table from "okm-frontend-components/dist/components/02-organisms/Table";
import { useOrganisation } from "../../../stores/organisation";
import { useIntl } from "react-intl";
import * as R from "ramda";
import { useMuutospyynnonLiitteet } from "../../../stores/muutospyynnonLiitteet";
import { useMuutospyynto } from "../../../stores/muutospyynto";
import { Helmet } from "react-helmet";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";

import { asiaEsittelijaStateToLocalizationKeyMap } from "../../Jarjestajat/Jarjestaja/modules/constants";

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

const Asiakirjat = ({ uuid }) => {
  const intl = useIntl();
  const t = intl.formatMessage;
  const [organisation] = useOrganisation();
  const [
    muutospyynnonLiitteet,
    muutospyynnonLiitteetAction
  ] = useMuutospyynnonLiitteet();
  const [muutospyynto, muutospyyntoAction] = useMuutospyynto();

  // Let's fetch MUUTOSPYYNNÖN LIITTEET
  useEffect(() => {
    console.log(uuid);
    if (uuid) {
      muutospyynnonLiitteetAction.load(uuid);
    }
  }, [muutospyynnonLiitteetAction, uuid]);

  // Let's fetch MUUTOSPYYNTÖ
  useEffect(() => {
    if (uuid) {
      muutospyyntoAction.load(uuid);
    }
  }, [muutospyyntoAction, uuid]);

  useEffect(() => {
    console.log(muutospyynnonLiitteet);
  }, [muutospyynnonLiitteet]);

  useEffect(() => {
    console.log(muutospyynto);
  }, [muutospyynto]);

  const attachmentRow = ["", R.path(["nimi", intl.locale], organisation.data)];

  const baseRow = [
    muutospyynto && muutospyynto.data && states.includes(muutospyynto.data.tila)
      ? intl.formatMessage(
          common[
            asiaEsittelijaStateToLocalizationKeyMap[muutospyynto.data.tila]
          ]
        )
      : "",
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
    fileLink: `/pdf/esikatsele/muutospyynto/${uuid}`,
    openInNewWindow: true,
    items: [intl.formatMessage(common.application), ...baseRow, ""]
  };

  const asiakirjatList = () => {
    return R.addIndex(R.map)(
      (row, idx) => (
        <AsiakirjatItem
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
    <div
      style={{
        borderTop: "0.05rem solid #E3E3E3",
        background: "#FAFAFA"
      }}>
      <Helmet>
        <title>{`Oiva | ${t(common.hakemusAsiakirjat)}`}</title>
      </Helmet>
      <BreadcrumbsItem to="/">{t(common.frontpage)}</BreadcrumbsItem>
      <BreadcrumbsItem to="/asiat">{t(common.asiat)}</BreadcrumbsItem>
      <BreadcrumbsItem to="/asiakirjat">
        {muutospyynto &&
          muutospyynto.data &&
          muutospyynto.data.jarjestaja.nimi.fi}
      </BreadcrumbsItem>
      <div
        className="flex flex-col justify-end w-full py-8 mx-auto px-3 lg:px-8"
        style={{
          maxWidth: "90rem"
        }}>
        <div className="flex-1 flex items-center">
          <div className="w-full flex flex-col">
            <h1>
              {muutospyynto &&
                muutospyynto.data &&
                muutospyynto.data.jarjestaja.nimi.fi}
            </h1>
            <p>
              {muutospyynto &&
                muutospyynto.data &&
                muutospyynto.data.jarjestaja.ytunnus}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex w-full">
        <div
          style={{ maxWidth: "90rem" }}
          className="flex-1 flex flex-col w-full mx-auto px-3 lg:px-8 py-12">
          <h4 className="mb-1">Järjestämisluvan muutos -asiakirjat</h4>
          <div
            className="flex-1 bg-white"
            style={{ border: "0.05rem solid #E3E3E3" }}>
            <WrapTable>
              <Media
                query={MEDIA_QUERIES.MOBILE}
                render={() => (
                  <OldTable role="table">
                    <Tbody role="rowgroup">{asiakirjatList()}</Tbody>
                  </OldTable>
                )}
              />
              <Media
                query={MEDIA_QUERIES.TABLET_MIN}
                render={() => <Table structure={table} />}
              />
            </WrapTable>
          </div>
        </div>
      </div>
    </div>
  );
};

Asiakirjat.propTypes = {
  muutospyynto: PropTypes.object
};

export default Asiakirjat;
