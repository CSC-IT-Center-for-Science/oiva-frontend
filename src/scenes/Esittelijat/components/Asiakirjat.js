import React, { useMemo, useEffect, useState } from "react";
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
import Loading from "../../../modules/Loading";
import { asiaEsittelijaStateToLocalizationKeyMap } from "../../Jarjestajat/Jarjestaja/modules/constants";
import Link from "@material-ui/core/Link";
import BackIcon from "@material-ui/icons/ArrowBack";
import { useHistory, useParams } from "react-router-dom";
import RemovalDialogOfAsiakirja from "../RemovalDialogOfAsiakirja";
import { useMuutospyynnot } from "../../../stores/muutospyynnot";
import PDFAndStateDialog from "../PDFAndStateDialog";

const WrapTable = styled.div``;

const colWidths = {
  0: "w-2/12",
  1: "w-2/12",
  2: "w-3/12",
  3: "w-4/12",
  4: "w-1/12"
};

const columnTitles = [
  common.document,
  common.documentStatus,
  common.author,
  common.sent,
  common["asiaTable.headers.actions"]
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

const Asiakirjat = React.memo(() => {
  const history = useHistory();
  const { uuid } = useParams();
  const intl = useIntl();
  const t = intl.formatMessage;
  const [organisation] = useOrganisation();
  const [
    muutospyynnonLiitteet,
    muutospyynnonLiitteetAction
  ] = useMuutospyynnonLiitteet();
  const [muutospyynto, muutospyyntoActions] = useMuutospyynto();
  const [isRemovalDialogVisible, setIsRemovalDialogVisible] = useState(false);
  const [
    isDownloadPDFAndChangeStateDialogVisible,
    setIsDownloadPDFAndChangeStateDialogVisible
  ] = useState(false);
  const [documentIdForAction, setDocumentIdForAction] = useState();
  const [, muutospyynnotActions] = useMuutospyynnot();

  // Let's fetch MUUTOSPYYNTÖ and MUUTOSPYYNNÖN LIITTEET
  useEffect(() => {
    let abortControllers = [];
    if (uuid) {
      abortControllers = [
        muutospyyntoActions.load(uuid, true),
        muutospyynnonLiitteetAction.load(uuid, true)
      ];
    }
    return function cancel() {
      R.forEach(abortController => {
        if (abortController) {
          abortController.abort();
        }
      }, abortControllers);
    };
  }, [muutospyyntoActions, muutospyynnonLiitteetAction, uuid]);

  const nimi = useMemo(
    () => muutospyynto.data && muutospyynto.data.jarjestaja.nimi.fi,
    [muutospyynto.data]
  );

  const ytunnus = useMemo(
    () => muutospyynto.data && muutospyynto.data.jarjestaja.ytunnus,
    [muutospyynto.data]
  );

  const removeAsiakirja = async () => {
    await muutospyynnotActions.remove(documentIdForAction);
    history.push(`/asiat?force=${new Date().getTime()}`);
  };

  const setStateOfMuutospyyntoAsEsittelyssa = async () => {
    setIsDownloadPDFAndChangeStateDialogVisible(false);
    /**
     * After calling esittelyyn function the state of muutospyyntö should be as
     * Esittelyssä.
     **/
    muutospyynnotActions.esittelyyn(documentIdForAction);
    // To download the path of the document must be known.
    const path = await muutospyyntoActions.getLupaPreviewDownloadPath(documentIdForAction);
    if (path) {
      // If path is defined we download the document.
      muutospyyntoActions.downloadAndShowInAnotherWindow(path);
    }
    // Let's move to Asiat view.
    history.push(`/asiat?force=${new Date().getTime()}`);
  };

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
          fileLinkFn: () => {
            muutospyyntoActions.download(`/liitteet/${liite.uuid}/raw`);
          }
        }),
        R.sortBy(R.prop("nimi"), muutospyynnonLiitteet.data || [])
      );
    }
    return [];
  }, [
    intl,
    muutospyynnonLiitteet.fetchedAt,
    muutospyynnonLiitteet.data,
    attachmentRow,
    muutospyyntoActions
  ]);

  const muutospyyntoRowItem = useMemo(() => {
    return {
      uuid,
      fileLinkFn: async () => {
        const path = await muutospyyntoActions.getLupaPreviewDownloadPath(uuid);
        if (path) {
          muutospyyntoActions.download(path);
        }
      },
      openInNewWindow: true,
      items: [intl.formatMessage(common.application), ...baseRow, ""],
      tila: muutospyynto.data ? muutospyynto.data.tila : ""
    };
  }, [baseRow, intl, muutospyynto.data, uuid, muutospyyntoActions]);

  const rows = [muutospyyntoRowItem, ...liitteetRowItems];

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
      rows
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
                  isSortable: ii === 4 ? false : true,
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
          rows: R.addIndex(R.map)((row, i) => {
            return {
              uuid: rows.length === 1 ? row.uuid : null,
              fileLinkFn: row.fileLinkFn,
              onClick: (row, action) => {
                if (action === "lataa" && row.fileLinkFn) {
                  row.fileLinkFn();
                } else if (action === "download-pdf-and-change-state") {
                  setIsDownloadPDFAndChangeStateDialogVisible(true);
                  setDocumentIdForAction(row.uuid);
                } else if (action === "edit") {
                  history.push(`${ytunnus}/${row.uuid}`);
                } else if (action === "remove") {
                  setIsRemovalDialogVisible(true);
                  setDocumentIdForAction(row.uuid);
                }
              },
              cells: R.addIndex(R.map)(
                (col, ii) => {
                  return {
                    truncate: true,
                    styleClasses: [colWidths[ii] + " cursor-default"],
                    text: col.text
                  };
                },
                [
                  { text: row.items[0] },
                  { text: row.items[1] },
                  { text: row.items[2] },
                  { text: row.items[3] }
                ]
              ).concat({
                menu: {
                  id: `simple-menu-${i}`,
                  actions: [
                    row.tila !== "ESITTELYSSA"
                      ? {
                          id: "edit",
                          text: t(common["asiaTable.actions.muokkaa"])
                        }
                      : null,
                    {
                      id: "lataa",
                      text: t(common["asiaTable.actions.lataa"])
                    },
                    row.tila !== "ESITTELYSSA"
                      ? {
                          id: "download-pdf-and-change-state",
                          text: t(
                            common["asiaTable.actions.lataaPDFJaMuutaTila"]
                          )
                        }
                      : null,
                    row.tila !== "ESITTELYSSA"
                      ? {
                          id: "remove",
                          text: t(common.poista)
                        }
                      : null
                  ].filter(Boolean)
                },
                styleClasses: ["w-1/12 cursor-default"]
              })
            };
          }, rows)
        }
      ]
    },
    {
      role: "tfoot"
    }
  ];

  if (
    muutospyynnonLiitteet.isLoading === false &&
    muutospyynto.isLoading === false &&
    muutospyynnonLiitteet.fetchedAt &&
    muutospyynto.fetchedAt
  ) {
    return (
      <div
        className="flex flex-col flex-1"
        style={{
          borderTop: "0.05rem solid #E3E3E3",
          background: "#FAFAFA"
        }}>
        <Helmet htmlAttributes={{ lang: intl.locale }}>
          <title>{`Oiva | ${t(common.asianAsiakirjat)}`}</title>
        </Helmet>
        <BreadcrumbsItem to="/">{t(common.frontpage)}</BreadcrumbsItem>
        <BreadcrumbsItem to="/asiat">{t(common.asiat)}</BreadcrumbsItem>
        <BreadcrumbsItem to="/asiakirjat">{nimi}</BreadcrumbsItem>
        <div
          className="flex flex-col justify-end w-full py-8 mx-auto px-3 lg:px-8"
          style={{
            maxWidth: "90rem"
          }}>
          <Link
            className="cursor-pointer"
            onClick={() => {
              history.push("/asiat");
            }}>
            <BackIcon
              style={{
                fontSize: 14,
                marginBottom: "0.1rem",
                marginRight: "0.4rem"
              }}
            />
            {t(common.asiakirjatTakaisin)}
          </Link>
          <div className="flex-1 flex items-center pt-8 pb-2">
            <div className="w-full flex flex-col">
              <h1>{nimi}</h1>
              <h5 className="text-lg mt-1">{ytunnus}</h5>
            </div>
          </div>
        </div>
        <div className="flex-1 flex w-full">
          <div
            style={{ maxWidth: "90rem" }}
            className="flex-1 flex flex-col w-full mx-auto px-3 lg:px-8 pb-12">
            <h4 className="mb-2">{t(common.asianAsiakirjat)}</h4>
            {isRemovalDialogVisible && (
              <RemovalDialogOfAsiakirja
                isVisible={isRemovalDialogVisible}
                removeAsia={rows.length === 1}
                onClose={() => setIsRemovalDialogVisible(false)}
                onOK={removeAsiakirja}></RemovalDialogOfAsiakirja>
            )}
            {isDownloadPDFAndChangeStateDialogVisible && (
              <PDFAndStateDialog
                isVisible={isDownloadPDFAndChangeStateDialogVisible}
                onClose={() =>
                  setIsDownloadPDFAndChangeStateDialogVisible(false)
                }
                onOK={setStateOfMuutospyyntoAsEsittelyssa}></PDFAndStateDialog>
            )}
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
                  render={() => (
                    <div
                      style={{
                        borderBottom: "0.05rem solid #E3E3E3"
                      }}>
                      <Table
                        structure={table}
                        sortedBy={{ columnIndex: 3, order: "descending" }}
                      />
                    </div>
                  )}
                />
              </WrapTable>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
});

Asiakirjat.propTypes = {
  uuid: PropTypes.object
};

export default Asiakirjat;
