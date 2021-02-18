import React, { useState, useMemo, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import JarjestamislupaAsiatListItem from "./JarjestamislupaAsiatListItem";
import { asiaStateToLocalizationKeyMap } from "./constants";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/AddCircleOutline";
import ArrowBack from "@material-ui/icons/ArrowBack";
import _ from "lodash";
import JarjestamislupaAsiakirjat from "./JarjestamislupaAsiakirjat";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import Table from "components/02-organisms/Table";
import moment from "moment";
import { ROLE_KATSELIJA } from "modules/constants";
import { FIELDS } from "locales/uusiHakemusFormConstants";
import { useMuutospyynnot } from "stores/muutospyynnot";
import * as R from "ramda";
import { Typography } from "@material-ui/core";
import { localizeRouteKey } from "utils/common";
import { AppRoute } from "const/index";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    overflowX: "auto",
    marginTop: 0
  },
  table: {
    minWidth: 650
  }
}));

const colWidths = {
  0: "w-2/12",
  1: "w-2/12",
  2: "w-2/12",
  3: "w-2/12",
  4: "w-2/12",
  5: "w-2/12 justify-center"
};

// States of hakemus
const states = [
  "LUONNOS",
  "AVOIN",
  "VALMISTELUSSA",
  "TAYDENNETTAVA",
  "PAATETTY",
  "PASSIVOITU"
];

const JarjestamislupaAsiatList = ({
  history,
  isForceReloadRequested,
  koulutusmuoto,
  lupa,
  match,
  newApplicationRouteItem,
  organisation
}) => {
  const intl = useIntl();

  const [muutospyynnot, muutospyynnotActions] = useMuutospyynnot();
  const { url } = match;
  const classes = useStyles();
  const [muutospyynto, setMuutospyynto] = useState(null);

  // Let's fetch MUUTOSPYYNNÖT
  useEffect(() => {
    let abortController;
    if (lupa && !R.isEmpty(lupa)) {
      const oid = R.path(["jarjestaja", "oid"], lupa);
      if (oid) {
        abortController = muutospyynnotActions.load(
          oid,
          isForceReloadRequested
        );
      }
    }
    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [isForceReloadRequested, lupa, muutospyynnotActions, match]);

  const tableData = useMemo(() => {
    if (muutospyynnot.fetchedAt && muutospyynnot.data) {
      return R.map(muutospyynto => {
        return {
          luontipvm: moment(muutospyynto.luontipvm).format(
            "DD.MM.YYYY HH:mm:ss"
          ),
          paatetty: R.path(["paatoskierros", "loppupvm"], muutospyynto),
          tila: muutospyynto.tila,
          uuid: muutospyynto.uuid
        };
      }, muutospyynnot.data);
    }
    return [];
  }, [muutospyynnot.fetchedAt, muutospyynnot.data]);

  const columnTitles = [
    intl.formatMessage(common.kjAsiaTableDnro),
    intl.formatMessage(common.kjAsiaTableAsia),
    intl.formatMessage(common.kjAsiaTableState),
    intl.formatMessage(common.kjAsiaTableDueDate),
    intl.formatMessage(common.kjAsiaTablePaatetty)
  ];

  const mainTable = [
    {
      role: "thead",
      rowGroups: [
        {
          rows: [
            {
              cells: R.addIndex(R.map)((title, ii) => {
                return {
                  truncate: false,
                  styleClasses: [colWidths[ii]],
                  text: "\xa0\xa0" + title,
                  sortingTooltip: intl.formatMessage(common.sort)
                };
              }, columnTitles).concat({
                text: "Toiminnot",
                styleClasses: [colWidths[5]]
              })
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
            const tilaText =
              row.tila && states.includes(row.tila)
                ? intl.formatMessage(
                    common[asiaStateToLocalizationKeyMap[row.tila]]
                  )
                : row.tila;
            let cells = R.addIndex(R.map)(
              (col, ii) => {
                return {
                  truncate: true,
                  styleClasses: [colWidths[ii]],
                  text: col.text
                };
              },
              [
                { text: "" },
                { text: intl.formatMessage(common.change) },
                { text: tilaText },
                { text: "" },
                { text: row.tila === "LUONNOS" ? "" : row.paatetty }
              ]
            );
            if (
              sessionStorage.getItem("role") !== ROLE_KATSELIJA &&
              row.tila !== FIELDS.TILA.VALUES.AVOIN
            ) {
              cells = R.append(
                {
                  menu: {
                    id: `simple-menu-${i}`,
                    actions: [
                      {
                        id: "edit",
                        text: intl.formatMessage(common.edit)
                      }
                    ]
                  },
                  styleClasses: [colWidths[5]]
                },
                cells
              );
            } else {
              cells = R.append({ styleClasses: [colWidths[5]] }, cells);
            }
            return {
              id: row.uuid,
              onClick: (row, action) => {
                if (action === "click" && row.id) {
                  setMuutospyynto(
                    R.find(R.propEq("uuid", row.id), muutospyynnot.data)
                  );
                } else if (action === "edit") {
                  history.push(
                    localizeRouteKey(
                      intl.locale,
                      AppRoute.Hakemus,
                      intl.formatMessage,
                      {
                        id: organisation.oid,
                        koulutusmuoto: koulutusmuoto.kebabCase,
                        page: 1,
                        uuid: row.id
                      }
                    )
                  );
                }
              },
              cells: cells
            };
          }, tableData)
        }
      ]
    },
    {
      role: "tfoot"
    }
  ];

  const jarjestamislupaAsiatList = useMemo(() => {
    const data = _.orderBy(muutospyynnot.data, ["voimassaalkupvm"], ["desc"]);
    return _.map(data, historyData => (
      <JarjestamislupaAsiatListItem
        url={url}
        muutospyynto={historyData}
        key={historyData.uuid}
        setOpened={() => setMuutospyynto(historyData)}
        states={states}
      />
    ));
  }, [url, muutospyynnot.data]);

  let hasRights = sessionStorage.getItem("role") !== ROLE_KATSELIJA;
  return (
    <React.Fragment>
      <div className="mb-6">
        {muutospyynto && (
          <Button color="primary" onClick={() => setMuutospyynto(null)}>
            <ArrowBack />
            <span className="pl-2">
              {intl.formatMessage(common.backFromAsiakirjat)}
            </span>
          </Button>
        )}
        {!muutospyynto && hasRights && (
          <NavLink
            className="mb-2"
            to={newApplicationRouteItem.path}
            exact={newApplicationRouteItem.exact}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Button color="primary" className="newHakemus">
              <Add />
              <span className="pl-2">{newApplicationRouteItem.text}</span>
            </Button>
          </NavLink>
        )}
      </div>

      {muutospyynto && (
        <div>
          <Typography component="h3" variant="h3">
            {intl.formatMessage(common.hakemusAsiakirjat)}
          </Typography>
          <Paper className={classes.root}>
            <JarjestamislupaAsiakirjat
              muutospyynto={muutospyynto}
              organisation={organisation}
            />
          </Paper>
        </div>
      )}

      {!muutospyynto && muutospyynnot.fetchedAt && (
        <Paper className={classes.root}>
          <div className="lg:hidden">
            <div>{jarjestamislupaAsiatList}</div>
          </div>
          <div className="hidden lg:block">
            <Table structure={mainTable}></Table>
          </div>
        </Paper>
      )}
    </React.Fragment>
  );
};

JarjestamislupaAsiatList.propTypes = {
  history: PropTypes.object,
  lupahistory: PropTypes.array,
  match: PropTypes.object,
  muutospyynnot: PropTypes.array,
  newApplicationRouteItem: PropTypes.object,
  organisation: PropTypes.object
};

export default JarjestamislupaAsiatList;
