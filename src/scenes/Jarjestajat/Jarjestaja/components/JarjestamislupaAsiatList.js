import React, { useState } from "react";
import _ from "lodash";
import Media from "react-media";
import styled from "styled-components";
import {
  Table,
  Thead,
  Tbody,
  Thn,
  Trn,
  ThButton
} from "../../../../modules/Table";
import { COLORS, MEDIA_QUERIES } from "../../../../modules/styles";
import { FaPlus, FaArrowLeft } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import JarjestamislupaAsiatListItem from "./JarjestamislupaAsiatListItem";
import Loading from "../../../../modules/Loading";
import JarjestamislupaAsiakirjat from "./JarjestamislupaAsiakirjat";

import { LUPA_TEKSTIT } from "../../../Jarjestajat/Jarjestaja/modules/constants";
import { LUPA_EXCEPTIONS } from "../../constants";

const WrapTable = styled.div``;
const Button = styled.div`
  color: ${props => (props.textColor ? props.textColor : COLORS.WHITE)};
  background-color: ${props =>
    props.disabled
      ? COLORS.LIGHT_GRAY
      : props.bgColor
      ? props.bgColor
      : COLORS.OIVA_GREEN};
  border: 1px solid
    ${props =>
      props.disabled
        ? COLORS.LIGHT_GRAY
        : props.bgColor
        ? props.bgColor
        : COLORS.OIVA_GREEN};
  cursor: pointer;
  display: inline-block;
  position: relative;
  width: auto;
  padding: 0 16px;
  line-height: 36px;
  vertical-align: middle;
  text-align: center;
  border-radius: 2px;
  min-width: 24px;
  margin: 0 10px 10px 0;
  &:hover {
    color: ${props =>
      props.disabled
        ? COLORS.WHITE
        : props.bgColor
        ? props.bgColor
        : COLORS.OIVA_GREEN};
    background-color: ${props =>
      props.disabled
        ? COLORS.LIGHT_GRAY
        : props.textColor
        ? props.textColor
        : COLORS.WHITE};
    ${props => (props.disabled ? "cursor: not-allowed;" : null)}
  }
  svg {
    margin-bottom: -2px;
  }
`;

const BackButton = styled(Button)`
  margin: 0 10px 10px 0;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
  h3 {
    margin: 0 0 10px 0;
  }
`;

const JarjestamislupaAsiatList = ({ lupahistory }) => {
  const { state, setState } = useState({
    opened: 0
  });

  const setOpened = dnro => {
    setState({ opened: dnro });
  };

  const renderJarjestamislupaAsiatList = data => {
    data = _.orderBy(data, ["paatospvm"], ["desc"]);
    return _.map(data, (historyData, i) => (
      <JarjestamislupaAsiatListItem
        lupaHistoria={historyData}
        key={`${historyData.diaarinumero}-${i}`}
        setOpened={setOpened}
      />
    ));
  };

  const { fetched, isFetching, hasErrored, data } = lupahistory || {};
  if (state && state.opened !== 0) {
    return (
      <WrapTable>
        <Header>
          <BackButton
            title={LUPA_TEKSTIT.ASIAT.PALAA.FI}
            onClick={e => setOpened(0)}
          >
            <FaArrowLeft />
          </BackButton>
          <h3>
            {LUPA_TEKSTIT.ASIAT.ASIAKIRJAT_OTSIKKO.FI} (OKM/{this.state.opened})
          </h3>
        </Header>
        <JarjestamislupaAsiakirjat lupaHistory={this.props.lupaHistory} />
      </WrapTable>
    );
  } else if (fetched) {
    return (
      <WrapTable>
        <h2>{LUPA_TEKSTIT.ASIAT.OTSIKKO.FI}</h2>
        <Button>
          <FaPlus /> {LUPA_TEKSTIT.ASIAT.UUSI_HAKEMUS.FI}
        </Button>
        <Button>
          <MdCancel /> {LUPA_TEKSTIT.ASIAT.JARJESTAMISLUVAN_PERUUTUS.FI}
        </Button>
        <Media
          query={MEDIA_QUERIES.MOBILE}
          render={() => (
            <Table>
              <Tbody>{renderJarjestamislupaAsiatList(data)}</Tbody>
            </Table>
          )}
        />
        <Media
          query={MEDIA_QUERIES.TABLET_MIN}
          render={() => (
            <Table>
              <Thead>
                <Trn>
                  <Thn flex="3">
                    {LUPA_TEKSTIT.ASIAT.ASIAT_TAULUKKO.DNRO.FI}
                  </Thn>
                  <Thn flex="3">
                    {LUPA_TEKSTIT.ASIAT.ASIAT_TAULUKKO.ASIA.FI}
                  </Thn>
                  <Thn flex="2">
                    {LUPA_TEKSTIT.ASIAT.ASIAT_TAULUKKO.TILA.FI}
                  </Thn>
                  <Thn flex="2">
                    {LUPA_TEKSTIT.ASIAT.ASIAT_TAULUKKO.MAARAAIKA.FI}
                  </Thn>
                  <Thn flex="2">
                    {LUPA_TEKSTIT.ASIAT.ASIAT_TAULUKKO.PAATETTY.FI}
                  </Thn>
                  <ThButton flex="1" />
                  <ThButton flex="1" />
                </Trn>
              </Thead>
              <Tbody>{renderJarjestamislupaAsiatList(data)}</Tbody>
            </Table>
          )}
        />
      </WrapTable>
    );
  } else if (isFetching) {
    return <Loading />;
  } else if (hasErrored) {
    return <h2>{LUPA_EXCEPTIONS}</h2>;
  } else {
    return null;
  }
};

export default JarjestamislupaAsiatList;
