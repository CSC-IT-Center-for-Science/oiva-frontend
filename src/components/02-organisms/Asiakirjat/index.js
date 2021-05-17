import React, { useMemo, useEffect, useState } from "react";
import Media from "react-media";
import styled from "styled-components";
import { Table as OldTable, Tbody } from "modules/Table";
import { COLORS, MEDIA_QUERIES } from "modules/styles";
import AsiakirjatItem from "./AsiakirjatItem";
import common from "i18n/definitions/common";
import PropTypes from "prop-types";
import Table from "components/02-organisms/Table/index";
import { downloadFileFn, localizeRouteKey } from "utils/common";
import { useIntl } from "react-intl";
import { useMuutospyynnonLiitteet } from "stores/muutospyynnonLiitteet";
import { useMuutospyynto } from "stores/muutospyynto";
import { Helmet } from "react-helmet";
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
import Typography from "@material-ui/core/Typography";
import { AppRoute } from "const/index";
import moment from "moment";
import languages from "i18n/definitions/languages";

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

const Asiakirjat = ({ koulutusmuoto }) => {
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

  const jarjestaja = useMemo(
    () => muutospyynto.data && muutospyynto.data.jarjestaja,
    [muutospyynto.data]
  );

  const nimi = useMemo(
    () => jarjestaja && (jarjestaja.nimi.fi || jarjestaja.nimi.sv),
    [jarjestaja]
  );

  const removeAsiakirja = async () => {
    await muutospyynnotActions.remove(documentIdForAction, intl.formatMessage);
    history.push(
      `${localizeRouteKey(intl.locale, AppRoute.AsianhallintaAvoimet, t, {
        koulutusmuoto: koulutusmuoto.kebabCase
      })}?force=${new Date().getTime()}`
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
    history.push(
      `${localizeRouteKey(intl.locale, AppRoute.AsianhallintaAvoimet, t, {
        koulutusmuoto: koulutusmuoto.kebabCase
      })}?force=${new Date().getTime()}`
    );
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
            R.prop("nimi", liite),
            intl.formatMessage(common.tilaValmis),
            liite.luoja,
            liite.luontipvm ? moment(liite.luontipvm).format("D.M.YYYY") : ""
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
    if (!muutospyynto.fetchedAt || !muutospyynto.data) {
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
      kieli: muutospyynto.data.kieli,
      openInNewWindow: true,
      items: [
        intl.formatMessage(common.application),
        ...baseRow,
        muutospyynto.data.luoja,
        muutospyynto.data.luontipvm
          ? moment(muutospyynto.data.luontipvm).format("D.M.YYYY")
          : ""
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
                  isSortable: ii !== 4,
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
                  history.push(
                    localizeRouteKey(
                      intl.locale,
                      AppRoute.Hakemus,
                      intl.formatMessage,
                      {
                        id: jarjestaja.oid,
                        koulutusmuoto: koulutusmuoto.kebabCase,
                        language: row.kieli || "fi",
                        page: 1,
                        uuid: row.uuid
                      }
                    )
                  );
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
                  {
                    text:
                      row.items[0] +
                      (row.kieli
                        ? ` (${intl.formatMessage(languages.ruotsinkielinen)})`
                        : "")
                  },
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
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: intl.locale }}>
          <title>{`Oiva | ${t(common.asianAsiakirjat)}`}</title>
        </Helmet>
        <div className="flex flex-col justify-end py-8 mx-auto w-4/5 max-w-8xl">
          <Link
            className="cursor-pointer"
            style={{ textDecoration: "underline" }}
            onClick={() => {
              history.push(
                localizeRouteKey(
                  intl.locale,
                  AppRoute.AsianhallintaAvoimet,
                  t,
                  {
                    koulutusmuoto: koulutusmuoto.kebabCase
                  }
                )
              );
            }}
          >
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
              <Typography component="h1" variant="h1">
                {nimi}
              </Typography>
              <Typography component="h5" variant="h5">
                {jarjestaja.ytunnus}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex-1 flex w-full">
          <div className="flex-1 flex flex-col w-full mx-auto">
            <div className="mx-auto w-4/5 max-w-8xl">
              <Typography component="h4" variant="h4" className="float-left">
                {t(common.asianAsiakirjat)}
              </Typography>
              <Typography
                component="h4"
                variant="h4"
                className="float-right"
                style={{ margin: 0 }}
              >
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
              </Typography>
            </div>
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
                onOK={removeAsiakirja}
              ></RemovalDialogOfAsiakirja>
            )}
            {isDownloadPDFAndChangeStateDialogVisible && (
              <PDFAndStateDialog
                isVisible={isDownloadPDFAndChangeStateDialogVisible}
                onClose={() =>
                  setIsDownloadPDFAndChangeStateDialogVisible(false)
                }
                onOK={setStateOfMuutospyyntoAsEsittelyssa}
              ></PDFAndStateDialog>
            )}
            <div className="flex-1 flex bg-gray-100 border-t border-solid border-gray-300">
              <div className="flex mx-auto w-4/5 max-w-8xl py-12">
                <div
                  className="flex-1 bg-white"
                  style={{ border: "0.05rem solid #E3E3E3" }}
                >
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
                          }}
                        >
                          <Table
                            structure={table}
                            sortedBy={{ columnIndex: 3, order: "desc" }}
                          />
                        </div>
                      )}
                    />
                  </WrapTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
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
  // Asiakirjan UUID
  uuid: PropTypes.object,
  koulutusmuoto: PropTypes.object
};

export default Asiakirjat;
