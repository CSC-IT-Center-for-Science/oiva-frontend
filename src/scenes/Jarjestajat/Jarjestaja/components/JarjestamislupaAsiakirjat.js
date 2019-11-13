import * as R from "ramda";
import React, { useContext, useMemo } from "react";
import Media from "react-media";
import styled from "styled-components";
import { Table, Tbody, Thead, Thn, Trn } from "../../../../modules/Table";
import { MEDIA_QUERIES } from "../../../../modules/styles";
import { LUPA_TEKSTIT } from "../../../Jarjestajat/Jarjestaja/modules/constants";
import JarjestamislupaAsiakirjatItem from "./JarjestamislupaAsiakirjatItem";
import { Typography } from "@material-ui/core";
import common from "../../../../i18n/definitions/common";
import PropTypes from "prop-types";
import FetchHandler from "../../../../FetchHandler";
import { BackendContext } from "../../../../context/backendContext";
import Moment from "react-moment";
import { downloadFileFn } from "../../../../components/02-organisms/Attachments";

const WrapTable = styled.div``;

const titleKeys = [
  common.document,
  common.documentStatus,
  common.author,
  common.sent
];

const JarjestamislupaAsiakirjat = ({muutospyynto, organisaatio, intl}) => {

  const { state: fromBackend, dispatch } = useContext(BackendContext);
  const fetchSetup = useMemo(() => {
    return muutospyynto && muutospyynto.uuid
      ? [{
          key: "muutospyynnonLiitteet",
          dispatchFn: dispatch,
          urlEnding: muutospyynto.uuid
        }]
      : [];
  }, [dispatch, muutospyynto]);

  const baseRow = [
    LUPA_TEKSTIT.MUUTOSPYYNTO.TILA[muutospyynto.tila][R.toUpper(intl.locale)],
    R.path(["nimi", intl.locale], organisaatio)
  ];

  const liitteetRowItems = useMemo(() => R.map((liite) =>
    ({
      items:
        [
          intl.formatMessage(liite.salainen ? common.secretAttachment : common.attachment) + " " + R.prop("nimi", liite),
          ...baseRow,
          liite.luontipvm
            ? (<Moment format="D.M.YYYY">{liite.luontipvm}</Moment>)
            : ""
        ],
      fileLink: `/liitteet/${liite.uuid}/raw`
    }), R.sortBy(R.prop("nimi"), R.pathOr([], ['muutospyynnonLiitteet', 'raw'], fromBackend))
  ), [intl, fromBackend, baseRow]);

  const muutospyyntoRowItem = {
    fileLink: `/pdf/esikatsele/muutospyynto/${muutospyynto.uuid}`,
    openInNewWindow: true,
    items: [
      intl.formatMessage(common.application),
      ...baseRow,
      ""
    ]
  };

  const jarjestamislupaAsiakirjatList = () => {
    return R.addIndex(R.map)((row, idx) => (
      <JarjestamislupaAsiakirjatItem
        onClick = { downloadFileFn({ url: row.fileLink, openInNewWindow: row.openInNewWindow }) }
        rowItems = { row.items }
        key = { idx }
      />
    ), [muutospyyntoRowItem, ...liitteetRowItems]);
  };

  return (
    <FetchHandler
      fetchSetup={fetchSetup}
      ready={
        <WrapTable>
          <Media
            query={MEDIA_QUERIES.MOBILE}
            render={() => (
              <Table>
                <Tbody>{jarjestamislupaAsiakirjatList()}</Tbody>
              </Table>
            )}
          />
          <Media
            query={MEDIA_QUERIES.TABLET_MIN}
            render={() => (
              <Table>
                <Thead>
                  <Trn>
                    {
                      titleKeys.map((title, ind) => (
                        <Thn key={ind}>
                          <Typography>{intl.formatMessage(title)}</Typography>
                        </Thn>)
                      )
                    }
                  </Trn>
                </Thead>
                <Tbody>{jarjestamislupaAsiakirjatList()}</Tbody>
              </Table>
            )}
          />
        </WrapTable>
      }
      />
  );
};

JarjestamislupaAsiakirjat.propTypes = {
  match: PropTypes.object,
  muutospyynto: PropTypes.object,
  organisaatio: PropTypes.object,
  intl: PropTypes.object
};

export default JarjestamislupaAsiakirjat;
