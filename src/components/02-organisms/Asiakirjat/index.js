import React, { useCallback, useEffect, useMemo, useState } from "react";
import Media from "react-media";
import styled from "styled-components";
import { Table as OldTable, Tbody } from "modules/Table";
import { COLORS, MEDIA_QUERIES } from "modules/styles";
import AsiakirjatItem from "./AsiakirjatItem";
import common from "i18n/definitions/common";
import PropTypes from "prop-types";
import Moment from "react-moment";
import Table from "components/02-organisms/Table/index";
import { downloadFileFn, localizeRouteKey } from "utils/common";
import { useIntl } from "react-intl";
import { useMuutospyynnonLiitteet } from "stores/muutospyynnonLiitteet";
import { useMuutospyynto } from "stores/muutospyynto";
import { Helmet } from "react-helmet";
import Loading from "modules/Loading";
import Link from "@material-ui/core/Link";
import BackIcon from "@material-ui/icons/ArrowBack";
import { useHistory, useLocation, useParams } from "react-router-dom";
import RemovalDialogOfAsiakirja from "./RemovalDialogOfAsiakirja/index";
import { useMuutospyynnot } from "stores/muutospyynnot";
import PDFAndStateDialog from "./PDFAndStateDialog";
import error from "i18n/definitions/error";
import SelectAttachment from "components/02-organisms/SelectAttachment";
import ProcedureHandler from "components/02-organisms/procedureHandler";
import ConfirmDialog from "../ConfirmDialog";
import Typography from "@material-ui/core/Typography";
import { AppRoute } from "const/index";
import moment from "moment";
import languages from "i18n/definitions/languages";
import SimpleButton from "components/00-atoms/SimpleButton/index";
import { FIELDS } from "locales/uusiHakemusFormConstants";
import { labelColorClassesByTila } from "../../../utils/asiatUtils";
import {
  addIndex,
  append,
  find,
  forEach,
  map,
  path,
  prop,
  sortBy
} from "ramda";

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
  "ESITTELYSSA",
  "KORJAUKSESSA"
];

const Asiakirjat = ({ koulutusmuoto }) => {
  const history = useHistory();
  const { uuid } = useParams();
  const intl = useIntl();
  const t = intl.formatMessage;
  const [muutospyynnonLiitteet, muutospyynnonLiitteetAction] =
    useMuutospyynnonLiitteet();
  const [muutospyynto, muutospyyntoActions] = useMuutospyynto();
  const [isRemovalDialogVisible, setIsRemovalDialogVisible] = useState(false);
  const [
    isDownloadPDFAndChangeStateDialogVisible,
    setIsDownloadPDFAndChangeStateDialogVisible
  ] = useState(false);
  const [isDeleteLiiteDialogVisible, setIsDeleteLiiteDialogVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [
    isPaatettyConfirmationDialogVisible,
    setPaatettyConfirmationDialogVisible
  ] = useState(false);
  const [
    isKorjaaLupaaConfirmationDialogVisible,
    setKorjaaLupaaConfirmationDialogVisible
  ] = useState(false);
  const [rowActionTargetId, setRowActionTargetId] = useState(null);
  const [documentIdForAction, setDocumentIdForAction] = useState();
  const [, muutospyynnotActions] = useMuutospyynnot();
  const location = useLocation();

  const muutospyynnonTila = path(["data", "tila"], muutospyynto);

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
      forEach(abortController => {
        if (abortController) {
          abortController.abort();
        }
      }, abortControllers);
    };
  }, [location.search, muutospyyntoActions, muutospyynnonLiitteetAction, uuid]);

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

  const baseRow = {
    tila: muutospyynnonTila,
    localizedTila:
      muutospyynto && muutospyynto.data && states.includes(muutospyynnonTila)
        ? `<span class="px-3 py-2 rounded-sm ${prop(
            muutospyynto.data.tila,
            labelColorClassesByTila
          )}">${
            t(common[`asiaStates.esittelija.${muutospyynto.data.tila}`]) || ""
          }</span>`
        : ""
  };

  const liitteetRowItems = useMemo(() => {
    if (muutospyynnonLiitteet.fetchedAt) {
      return map(
        liite => ({
          uuid: liite.uuid,
          type: "liite",
          items: [
            prop("nimi", liite),
            intl.formatMessage(common.tilaValmis),
            liite.luoja,
            liite.luontipvm ? moment(liite.luontipvm).format("D.M.YYYY") : ""
          ],
          fileLinkFn: (isGoingToDownload = false) => {
            if (isGoingToDownload) {
              muutospyyntoActions.download(
                `/liitteet/${liite.uuid}/raw?inline=false`,
                intl.formatMessage
              );
            } else {
              muutospyyntoActions.downloadAndShowInAnotherWindow(
                `/liitteet/${liite.uuid}/raw?inline=true`,
                intl.formatMessage
              );
            }
          }
        }),
        sortBy(prop("nimi"), muutospyynnonLiitteet.data || [])
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
      fileLinkFn: async () => {
        const path = await muutospyyntoActions.getLupaPreviewDownloadPath(uuid);
        if (path) {
          muutospyyntoActions.download(path, intl.formatMessage);
        }
      },
      isEsittelyssa: baseRow.tila === "ESITTELYSSA",
      kieli: muutospyynto.data.kieli,
      openInNewWindow: true,
      items: [
        intl.formatMessage(common.application),
        baseRow.localizedTila,
        muutospyynto.data.luoja,
        muutospyynto.data.luontipvm ? (
          <Moment format="D.M.YYYY">{muutospyynto.data.luontipvm}</Moment>
        ) : (
          ""
        )
      ],
      tila: muutospyynto.data ? muutospyynto.data.tila : "",
      uuid
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
    return addIndex(map)(
      (row, idx) => (
        <AsiakirjatItem
          onClick={() => {
            downloadFileFn({
              url: row.fileLink,
              openInNewWindow: row.openInNewWindow
            });
          }}
          rowItems={row.items}
          key={idx}
        />
      ),
      rows
    );
  };

  const tableStructure = [
    {
      role: "thead",
      rowGroups: [
        {
          rows: [
            {
              cells: addIndex(map)((title, ii) => {
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
          rows: addIndex(map)((row, i) => {
            return {
              isClickable: !row.isEsittelyssa,
              isHoverable: !row.isEsittelyssa,
              uuid: row.uuid,
              type: row.type,
              fileLinkFn: row.fileLinkFn,
              onClick: (row, action) => {
                if (action === "lataa" && row.fileLinkFn) {
                  row.fileLinkFn(true);
                } else if (action === "remove") {
                  setDocumentIdForAction(row.uuid);
                  row.type === "liite"
                    ? setIsDeleteLiiteDialogVisible(true)
                    : setIsRemovalDialogVisible(true);
                } else {
                  // Tässä on listattu rivin klikkaamisen oletustoiminnot.
                  if (row.type === "liite") {
                    // Liitteen tapauksessa oletustoiminto on liitteen
                    // lataaminen.
                    row.fileLinkFn();
                  } else {
                    // Muutospyynnön tapauksessa oletustoiminto on sen
                    // avaaminen muokkaustilaan.
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
                  }
                }
              },
              cells: addIndex(map)(
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
                    {
                      id: "edit",
                      isDisabled: row.tila === "ESITTELYSSA",
                      isHidden: row.type === "liite",
                      name: "edit",
                      text: t(common.edit)
                    },
                    {
                      id: "remove",
                      isDisabled: row.tila === "ESITTELYSSA",
                      name: "delete",
                      text: t(common.poista)
                    },
                    {
                      id: "lataa",
                      name: "download",
                      text:
                        row.type === "liite"
                          ? t(common["asiaTable.actions.lataaLiite"])
                          : t(common["asiaTable.actions.lataa"])
                    }
                  ].filter(Boolean),
                  isExpanded: true
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
    let paatoskirje = find(
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
      muutospyynto.data.liitteet = append(attachment, muutospyynto.liitteet);
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

  const triggerPaatettyActionProcedure = useCallback(async () => {
    const timestamp = new Date().getTime();
    setIsLoading(true);
    await new ProcedureHandler(t).run("muutospyynnot.tilanmuutos.paatetyksi", [
      rowActionTargetId
    ]);
    setIsLoading(false);
    setPaatettyConfirmationDialogVisible(false);
    setRowActionTargetId(null);
    history.push("?force=" + timestamp);
  }, [rowActionTargetId, history, t]);

  const triggerKorjaaLupaaActionProcedure = useCallback(async () => {
    const timestamp = new Date().getTime();
    setIsLoading(true);
    await new ProcedureHandler(t).run(
      "muutospyynnot.tilanmuutos.korjattavaksi",
      [rowActionTargetId]
    );
    setIsLoading(false);
    setKorjaaLupaaConfirmationDialogVisible(false);
    setRowActionTargetId(null);
    history.push("?force=" + timestamp);
  }, [rowActionTargetId, history, t]);

  /* TILANVAIHTOPAINIKKEIDEN TOIMINNOT */

  async function vieEsittelyyn() {
    const timestamp = new Date().getTime();
    await new ProcedureHandler(t).run("muutospyynnot.tilanmuutos.esittelyyn", [
      uuid
    ]);
    history.push("?force=" + timestamp);
  }

  async function palautaValmisteluun() {
    const timestamp = new Date().getTime();
    await new ProcedureHandler(t).run(
      "muutospyynnot.tilanmuutos.valmisteluun",
      [uuid]
    );
    history.push("?force=" + timestamp);
  }

  const onPaatettyActionClicked = () => {
    setRowActionTargetId(uuid);
    setPaatettyConfirmationDialogVisible(true);
  };

  const onKorjaaLupaaActionClicked = () => {
    setRowActionTargetId(uuid);
    setKorjaaLupaaConfirmationDialogVisible(true);
  };

  if (muutospyyntoLoaded && muutospyynto.data) {
    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: intl.locale }}>
          <title>{`Oiva | ${t(common.asianAsiakirjat)}`}</title>
        </Helmet>
        <div className="flex flex-col justify-end w-full py-8 mx-auto">
          <div className="flex-1 flex flex-col w-full mx-auto">
            <div className="mx-auto w-4/5 max-w-8xl">
              {/* Linkki, jolla pääsee Asiat-sivulle */}
              <Link
                className="cursor-pointer"
                style={{ textDecoration: "underline" }}
                onClick={() => {
                  history.push(
                    `${localizeRouteKey(
                      intl.locale,
                      AppRoute.AsianhallintaAvoimet,
                      t,
                      {
                        koulutusmuoto: koulutusmuoto.kebabCase
                      }
                    )}?force=${new Date().getTime()}`
                  );
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
                  <Typography component="h1" variant="h1">
                    {t(common["asiaTypes.lupaChange"])}
                  </Typography>
                  <p className="text-lg font-normal">{nimi}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex w-full">
          <div className="flex-1 flex flex-col w-full mx-auto">
            <div className="mx-auto w-4/5 max-w-8xl pb-4">
              {/* Painikkeet, joilla voidaan muutta dokumenttien tilaa. */}
              <div>
                {muutospyynnonTila === FIELDS.TILA.VALUES.ESITTELYSSA && (
                  <SimpleButton
                    text={t(common.palautaValmisteluun)}
                    onClick={palautaValmisteluun}
                    variant="outlined"
                  />
                )}
                {(muutospyynnonTila === FIELDS.TILA.VALUES.ESITTELYSSA ||
                  muutospyynnonTila === FIELDS.TILA.VALUES.KORJAUKSESSA) && (
                  <SimpleButton
                    text={t(common["asiaTable.actions.paatetty"])}
                    buttonStyles={
                      muutospyynnonTila !== FIELDS.TILA.VALUES.KORJAUKSESSA
                        ? { marginLeft: "1rem" }
                        : {}
                    }
                    onClick={onPaatettyActionClicked}
                  />
                )}
                {muutospyynnonTila === FIELDS.TILA.VALUES.VALMISTELUSSA && (
                  <SimpleButton
                    text={t(common.vieEsittelyyn)}
                    onClick={vieEsittelyyn}
                  />
                )}
                {muutospyynnonTila === FIELDS.TILA.VALUES.PAATETTY && (
                  <SimpleButton
                    text={t(common.korjaaLupaa)}
                    onClick={onKorjaaLupaaActionClicked}
                    variant="outlined"
                  />
                )}
              </div>
              {/* Liitteitä voi lisätä vain, kun  */}
              {(muutospyynnonTila === FIELDS.TILA.VALUES.VALMISTELUSSA ||
                muutospyynnonTila === FIELDS.TILA.VALUES.KORJAUKSESSA) && (
                <Typography
                  component="h4"
                  variant="h4"
                  className="float-right"
                  style={{ margin: 0, padding: 0 }}>
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
              )}
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
            {isPaatettyConfirmationDialogVisible && (
              <ConfirmDialog
                isConfirmDialogVisible={isPaatettyConfirmationDialogVisible}
                handleCancel={() => setPaatettyConfirmationDialogVisible(false)}
                handleOk={triggerPaatettyActionProcedure}
                onClose={() => setPaatettyConfirmationDialogVisible(false)}
                messages={{
                  content: intl.formatMessage(
                    common.asiaPaatettyConfirmationDialogContent
                  ),
                  ok: intl.formatMessage(
                    common.asiaPaatettyConfirmationDialogOk
                  ),
                  cancel: intl.formatMessage(common.cancel),
                  title: intl.formatMessage(
                    common.asiaPaatettyConfirmationDialogTitle
                  )
                }}
                loadingSpinner={isLoading}
              />
            )}
            {isKorjaaLupaaConfirmationDialogVisible && (
              <ConfirmDialog
                isConfirmDialogVisible={isKorjaaLupaaConfirmationDialogVisible}
                handleCancel={() =>
                  setKorjaaLupaaConfirmationDialogVisible(false)
                }
                handleOk={triggerKorjaaLupaaActionProcedure}
                onClose={() => setKorjaaLupaaConfirmationDialogVisible(false)}
                messages={{
                  content: intl.formatMessage(
                    common.korjaaLupaaConfirmationDialogContent
                  ),
                  ok: intl.formatMessage(
                    common.korjaaLupaaConfirmationDialogOk
                  ),
                  cancel: intl.formatMessage(common.cancel),
                  title: intl.formatMessage(
                    common.korjaaLupaaConfirmationDialogTitle
                  )
                }}
                loadingSpinner={isLoading}
              />
            )}
            <div className="flex-1 flex bg-gray-100 border-t border-solid border-gray-300">
              <div className="flex mx-auto w-4/5 max-w-8xl py-12">
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
                            structure={tableStructure}
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
