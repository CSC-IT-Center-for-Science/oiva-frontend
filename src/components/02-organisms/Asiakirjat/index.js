import React, { useMemo, useEffect, useState } from "react";
import Media from "react-media";
import styled from "styled-components";
import { Table as OldTable, Tbody } from "modules/Table";
import { COLORS, MEDIA_QUERIES } from "modules/styles";
import AsiakirjatItem from "./AsiakirjatItem";
import common from "i18n/definitions/common";
import PropTypes from "prop-types";
import Moment from "react-moment";
import Table from "components/02-organisms/Table";
import { downloadFileFn } from "utils/common";
import { useIntl } from "react-intl";
import { useMuutospyynnonLiitteet } from "stores/muutospyynnonLiitteet";
import { useMuutospyynto } from "stores/muutospyynto";
import { Helmet } from "react-helmet";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Loading from "modules/Loading";
import Link from "@material-ui/core/Link";
import BackIcon from "@material-ui/icons/ArrowBack";
import { useHistory, useParams } from "react-router-dom";
import RemovalDialogOfAsiakirja from "./RemovalDialogOfAsiakirja";
import { useMuutospyynnot } from "stores/muutospyynnot";
import PDFAndStateDialog from "./PDFAndStateDialog";
import { asiaEsittelijaStateToLocalizationKeyMap } from "utils/constants";
import error from "i18n/definitions/error";
import SelectAttachment from "components/02-organisms/SelectAttachment";
import ProcedureHandler from "components/02-organisms/procedureHandler";
import ConfirmDialog from "../ConfirmDialog";
import * as R from "ramda";

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
  "PASSIVOITU",
  "ESITTELYSSA"
];

const Asiakirjat = ({ koulutustyyppi }) => {
  const history = useHistory();
  const { uuid } = useParams();
  const intl = useIntl();
  const t = intl.formatMessage;
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
  const [isDeleteLiiteDialogVisible, setIsDeleteLiiteDialogVisible] = useState(
    false
  );
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
    await muutospyynnotActions.remove(documentIdForAction, intl.formatMessage);
    history.push(
      `/${koulutustyyppi}/asianhallinta/avoimet?force=${new Date().getTime()}`
    );
  };

  const removeLiite = async () => {
    const procedureHandler = new ProcedureHandler(intl.formatMessage);
    await procedureHandler.run("muutospyynto.poisto.poistaLiite", [
      documentIdForAction,
      true
    ]);
    setIsDeleteLiiteDialogVisible(false);
    muutospyynnonLiitteetAction.load(muutospyynto.data.uuid, true);
  };

  const setStateOfMuutospyyntoAsEsittelyssa = async () => {
    setIsDownloadPDFAndChangeStateDialogVisible(false);
    /**
     * After calling esittelyyn function the state of muutospyyntö should be as
     * Esittelyssä.
     **/
    muutospyynnotActions.esittelyyn(documentIdForAction, intl.formatMessage);
    // To download the path of the document must be known.
    const path = await muutospyyntoActions.getLupaPreviewDownloadPath(
      documentIdForAction
    );
    if (path) {
      // If path is defined we download the document.
      muutospyyntoActions.downloadAndShowInAnotherWindow(path);
    }
    // Let's move to Asiat view.
    history.push(`/asiat?force=${new Date().getTime()}`);
  };

  const baseRow = [
    muutospyynto && muutospyynto.data && states.includes(muutospyynto.data.tila)
      ? intl.formatMessage(
          common[
            asiaEsittelijaStateToLocalizationKeyMap[muutospyynto.data.tila]
          ]
        )
      : ""
  ];

  const liitteetRowItems = useMemo(() => {
    if (muutospyynnonLiitteet.fetchedAt) {
      return R.map(
        liite => ({
          uuid: liite.uuid,
          type: "liite",
          items: [
            intl.formatMessage(
              liite.salainen ? common.secretAttachment : common.attachment
            ) +
              " " +
              R.prop("nimi", liite),
            intl.formatMessage(common.tilaValmis),
            liite.luoja,
            liite.luontipvm ? (
              <Moment format="D.M.YYYY">{liite.luontipvm}</Moment>
            ) : (
              ""
            )
          ],
          fileLinkFn: () => {
            muutospyyntoActions.download(
              `/liitteet/${liite.uuid}/raw`,
              intl.formatMessage
            );
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
    muutospyyntoActions
  ]);

  const muutospyyntoRowItem = useMemo(() => {
    if (!muutospyynto.fetchedAt) {
      return { items: [] };
    }
    return {
      uuid,
      fileLinkFn: async () => {
        const path = await muutospyyntoActions.getLupaPreviewDownloadPath(uuid);
        if (path) {
          muutospyyntoActions.download(path, intl.formatMessage);
        }
      },
      openInNewWindow: true,
      items: [
        intl.formatMessage(common.application),
        ...baseRow,
        muutospyynto.data.luoja,
        muutospyynto.data.luontipvm ? (
          <Moment format="D.M.YYYY">{muutospyynto.data.luontipvm}</Moment>
        ) : (
          ""
        )
      ],
      tila: muutospyynto.data ? muutospyynto.data.tila : ""
    };
  }, [
    baseRow,
    intl,
    muutospyynto.data,
    muutospyynto.fetchedAt,
    uuid,
    muutospyyntoActions
  ]);

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
              uuid: row.uuid,
              type: row.type,
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
                  setDocumentIdForAction(row.uuid);
                  row.type === "liite"
                    ? setIsDeleteLiiteDialogVisible(true)
                    : setIsRemovalDialogVisible(true);
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
                    row.type !== "liite" && row.tila !== "ESITTELYSSA"
                      ? {
                          id: "edit",
                          text: t(common["asiaTable.actions.muokkaa"])
                        }
                      : null,
                    {
                      id: "lataa",
                      text:
                        row.type === "liite"
                          ? t(common["asiaTable.actions.lataaLiite"])
                          : t(common["asiaTable.actions.lataa"])
                    },
                    row.type !== "liite" && row.tila !== "ESITTELYSSA"
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

  const muutospyyntoLoaded =
    muutospyynnonLiitteet.isLoading === false &&
    muutospyynto.isLoading === false &&
    muutospyynnonLiitteet.fetchedAt &&
    muutospyynto.fetchedAt;

  const handleAddPaatoskirje = async attachment => {
    // Search for existing paatoskirje in muutospyynto
    let paatoskirje = R.find(
      pk => pk.tyyppi === "paatosKirje",
      muutospyynto.data.liitteet || []
    );
    // If paatoskirje exists, replace the existing file, otherwise append to liitteet array
    if (paatoskirje) {
      paatoskirje.nimi = attachment.nimi;
      paatoskirje.koko = attachment.koko;
      paatoskirje.tiedosto = attachment.tiedosto;
      paatoskirje.filename = attachment.filename;
    } else {
      muutospyynto.data.liitteet = R.append(attachment, muutospyynto.liitteet);
      paatoskirje = attachment;
    }

    const procedureHandler = new ProcedureHandler(intl.formatMessage);
    await procedureHandler.run("muutospyynto.tallennus.tallennaPaatoskirje", [
      paatoskirje,
      muutospyynto.data,
      true
    ]);
    muutospyyntoActions.load(uuid, true);
    muutospyynnonLiitteetAction.load(muutospyynto.data.uuid, true);
  };

  if (muutospyyntoLoaded && muutospyynto.data) {
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
        <BreadcrumbsItem to={`/${koulutustyyppi}/asianhallinta/${ytunnus}`}>
          {nimi}
        </BreadcrumbsItem>
        <div
          className="flex flex-col justify-end w-full py-8 mx-auto px-3 lg:px-8"
          style={{
            maxWidth: "90rem"
          }}>
          <Link
            className="cursor-pointer"
            style={{ textDecoration: "underline" }}
            onClick={() => {
              history.push(`/${koulutustyyppi}/asianhallinta/avoimet`);
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
            <span>
              <h4 className="mb-2 float-left">{t(common.asianAsiakirjat)}</h4>
              <h4 className="float-right">
                <SelectAttachment
                  attachmentAdded={handleAddPaatoskirje}
                  messages={{
                    attachmentAdd: t(common.attachmentAddPaatoskirje),
                    attachmentName: t(common.attachmentName),
                    attachmentErrorName: t(common.attachmentErrorName),
                    attachmentError: t(common.attachmentError),
                    ok: t(common.ok),
                    cancel: t(common.cancel)
                  }}
                  styles={{
                    fontSize: "1em",
                    backgroundColor: COLORS.BG_GRAY,
                    border: "none",
                    iconSize: "18",
                    svgMargin: "0.1em 0.1em 0.2em 0",
                    circleIcon: true,
                    disableHover: true,
                    normalCase: true
                  }}
                  fileType={"paatosKirje"}
                />
              </h4>
            </span>
            {isDeleteLiiteDialogVisible && (
              <ConfirmDialog
                isConfirmDialogVisible={isDeleteLiiteDialogVisible}
                messages={{
                  content: intl.formatMessage(common.poistetaankoAsiakirja),
                  ok: intl.formatMessage(common.poista),
                  cancel: intl.formatMessage(common.doNotRemove),
                  title: intl.formatMessage(common.titleOfPoistetaankoAsiakirja)
                }}
                handleOk={removeLiite}
                handleCancel={() => setIsDeleteLiiteDialogVisible(false)}
              />
            )}
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
  } else if (muutospyyntoLoaded && !muutospyynto.data) {
    return (
      <div className="flex-1 flex justify-center">
        {intl.formatMessage(error.muutospyyntoNotFound)}
      </div>
    );
  } else {
    return <Loading />;
  }
};

Asiakirjat.propTypes = {
  uuid: PropTypes.object,
  koulutustyyppi: PropTypes.string
};

export default Asiakirjat;
