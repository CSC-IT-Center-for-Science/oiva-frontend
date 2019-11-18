import React, { useState, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import JarjestamislupaAsiatListItem from "./JarjestamislupaAsiatListItem";
import { LUPA_TEKSTIT } from "../../../Jarjestajat/Jarjestaja/modules/constants";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/AddCircleOutline";
import ArrowBack from "@material-ui/icons/ArrowBack";
import _ from "lodash";
import JarjestamislupaAsiakirjat from "./JarjestamislupaAsiakirjat";
import { Typography } from "@material-ui/core";
import { MEDIA_QUERIES } from "../../../../modules/styles";
import Media from "react-media";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { injectIntl } from "react-intl";
import common from "../../../../i18n/definitions/common";
import {
  Table,
  Tbody,
  Thead,
  Thn,
  Trn,
  ThButton,
  Thn2
} from "../../../../modules/Table";

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

const columnTitles = [
  LUPA_TEKSTIT.ASIAT.ASIAT_TAULUKKO.DNRO.FI,
  LUPA_TEKSTIT.ASIAT.ASIAT_TAULUKKO.ASIA.FI,
  LUPA_TEKSTIT.ASIAT.ASIAT_TAULUKKO.TILA.FI,
  LUPA_TEKSTIT.ASIAT.ASIAT_TAULUKKO.MAARAAIKA.FI,
  LUPA_TEKSTIT.ASIAT.ASIAT_TAULUKKO.PAATETTY.FI
];

const JarjestamislupaAsiatList = ({
  match,
  muutospyynnot = [],
  newApplicationRouteItem,
  organisaatio,
  intl
}) => {
  const { url } = match;
  const classes = useStyles();
  const [muutospyynto, setMuutospyynto] = useState(null);

  const jarjestamislupaAsiatList = useMemo(() => {
    const data = _.orderBy(muutospyynnot, ["voimassaalkupvm"], ["desc"]);
    return _.map(data, historyData => (
      <JarjestamislupaAsiatListItem
        url={url}
        muutospyynto={historyData}
        key={historyData.uuid}
        setOpened={() => setMuutospyynto(historyData)}
      />
    ));
  }, [url, muutospyynnot]);

  return (
    <React.Fragment>
      <div className="mb-2">
        {muutospyynto ? (
          <Button color="primary" onClick={() => setMuutospyynto(null)}>
            <ArrowBack />
            <span className="pl-2">
              {intl.formatMessage(common.backFromAsiakirjat)}
            </span>
          </Button>
        ) : (
          <NavLink
            className="mb-2"
            to={newApplicationRouteItem.path}
            exact={newApplicationRouteItem.exact}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Button color="primary">
              <Add />
              <span className="pl-2">{newApplicationRouteItem.text}</span>
            </Button>
          </NavLink>
        )}
      </div>

      {muutospyynto && (
        <div>
          <h3 className="mt-4 mb-2">
            {intl.formatMessage(common.hakemusAsiakirjat)}
          </h3>
          <Paper className={classes.root}>
            <JarjestamislupaAsiakirjat
              organisaatio={organisaatio}
              muutospyynto={muutospyynto}
              intl={intl}
            />
          </Paper>
        </div>
      )}

      {!muutospyynto && muutospyynnot && muutospyynnot.length > 0 && (
        <Paper className={classes.root}>
          <Media
            query={MEDIA_QUERIES.MOBILE}
            render={() => (
              <div>
                <div>{jarjestamislupaAsiatList}</div>
              </div>
            )}
          />
          <Media
            query={MEDIA_QUERIES.TABLET_MIN}
            render={() => (
              <Table className={classes.table}>
                <Thead role="rowgroup">
                  <Trn role="row">
                    {columnTitles.map((title, i) =>
                      i === 1 ? (
                        <Thn2 role="cell" key={`title-${i}`}>
                          <span className="text-white">
                            <Typography component="span">{title}</Typography>
                          </span>
                        </Thn2>
                      ) : (
                        <Thn role="cell" key={`title-${i}`}>
                          <span className="text-white">
                            <Typography component="span">{title}</Typography>
                          </span>
                        </Thn>
                      )
                    )}
                    <ThButton role="cell">
                      <span className="text-white">
                        <Typography component="span">
                          {intl.formatMessage(common.functions)}
                        </Typography>
                      </span>
                    </ThButton>
                  </Trn>
                </Thead>
                <Tbody>{jarjestamislupaAsiatList}</Tbody>
              </Table>
            )}
          />
        </Paper>
      )}
    </React.Fragment>
  );
};

JarjestamislupaAsiatList.propTypes = {
  lupahistory: PropTypes.array,
  match: PropTypes.object,
  muutospyynnot: PropTypes.array,
  newApplicationRouteItem: PropTypes.object
};

export default injectIntl(JarjestamislupaAsiatList);
