import React, { useState, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import JarjestamislupaAsiatListItem from "./JarjestamislupaAsiatListItem";
import { LUPA_TEKSTIT } from "../../../Jarjestajat/Jarjestaja/modules/constants";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/Add";
import ArrowBack from "@material-ui/icons/ArrowBack";
import _ from "lodash";
import JarjestamislupaAsiakirjat from "./JarjestamislupaAsiakirjat";
import { Typography } from "@material-ui/core";
import { MEDIA_QUERIES } from "../../../../modules/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Media from "react-media";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { Table, Tbody, Thead, Thn, Trn } from "../../../../modules/Table";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
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
  muutospyynnot,
  newApplicationRouteItem,
  organisaatio,
  intl
}) => {
  const { url } = match;
  const breakpointTabletMin = useMediaQuery(MEDIA_QUERIES.TABLET_MIN);
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
      {muutospyynto
        ? (
          <Button variant="contained" color="primary" onClick={() => setMuutospyynto(null)}>
            <ArrowBack/>
            <span className="pl-2">{LUPA_TEKSTIT.ASIAT.PALAA.FI}</span>
          </Button>
        )
        : (
          <NavLink
            to={newApplicationRouteItem.path}
            exact={newApplicationRouteItem.exact}
            className="pl-2"
            style={{textDecoration: "none", color: "inherit"}}
          >
            <Button variant="contained" color="primary">
              {breakpointTabletMin && <Add/>}

              <span className="pl-2">{newApplicationRouteItem.text}</span>
            </Button>
          </NavLink>
        )}

      {muutospyynto && (
        <Paper className={classes.root}>
          <JarjestamislupaAsiakirjat
            organisaatio={organisaatio}
            muutospyynto={muutospyynto}
            intl={intl}
          />
        </Paper>)}

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
                <Thead>
                  <Trn>
                    {columnTitles.map((title, i) => (
                      <Thn key={`title-${i}`}>
                    <span className="text-white">
                      <Typography component="span">{title}</Typography>
                    </span>
                      </Thn>
                    ))}
                    <Thn>&nbsp;</Thn>
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

export default JarjestamislupaAsiatList;
