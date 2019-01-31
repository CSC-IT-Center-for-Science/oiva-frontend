import React from 'react'
import Moment from 'react-moment'
import styled from 'styled-components'
import Media from 'react-media'
import { FaEdit} from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { Td, Tr, TdButton } from "../../../../modules/Table"
import { COLORS, MEDIA_QUERIES } from "../../../../modules/styles"
import { LUPA_TEKSTIT } from "../../../Jarjestajat/Jarjestaja/modules/constants"

const LupaText = styled.span`
  margin: 10px;
  
  @media ${MEDIA_QUERIES.MOBILE} {
    display: flex;
    flex-direction: column;
  }
`

const TextPartial = styled.span`
  margin-right: 10px;
`

const Button = styled.div`
  color: ${props => props.textColor ? props.textColor : COLORS.WHITE};
  background-color: ${props => props.disabled ? COLORS.LIGHT_GRAY : props.bgColor ? props.bgColor : COLORS.OIVA_GREEN};
  border: 1px solid ${props => props.disabled ? COLORS.LIGHT_GRAY : props.bgColor ? props.bgColor : COLORS.OIVA_GREEN};
  cursor: pointer;
  display: inline-block;
  position: relative;
  width: 40px;
  line-height: 36px;
  vertical-align: middle;
  text-align: center;
  border-radius: 2px;
  margin: 1px;
  z-index: 10;
  &:hover {
    color: ${props => props.disabled ? COLORS.WHITE : props.bgColor ? props.bgColor : COLORS.OIVA_GREEN};
    background-color: ${props => props.disabled ? COLORS.LIGHT_GRAY : props.textColor ? props.textColor : COLORS.WHITE};
    ${props => props.disabled ? 'cursor: not-allowed;' : null}
  }
  svg {
    margin-bottom: -2px;
  }
`

const JarjestamislupaAsiaListItem = (props) => {

  const { filename, diaarinumero, voimassaoloalkupvm, voimassaololoppupvm, paatospvm } = props.lupaHistoria;

  const asia = [
    "Järjestämisluvan muutos",
    "Järjestämisluvan peruutus",
    "Uusi järjestämislupa"
  ]

  const tila = [
    "Lähetetty",
    "Käsittelyssä",
    "Täydennettävä",
    "Vastattava",
    "Peruutettu",
    "Päätettävänä",
    "Päätetty"
  ]

  const open = (e,nro) => {
    e.stopPropagation();
    props.setOpened(nro);
  }

  const refill = (e,nro) => {
    e.stopPropagation();
    console.log("refill " + nro);
  }

  const cancel = (e,nro) => {
    e.stopPropagation();
    console.log("cancel " + nro);
  }

  return (
    <a onClick={(e) => open(e,diaarinumero)}>
      <Media query={MEDIA_QUERIES.MOBILE} render={() =>
          <Tr>
            <LupaText>
              <TextPartial>{LUPA_TEKSTIT.ASIAT.ASIAT_TAULUKKO.DNRO.FI}: OKM/{diaarinumero}</TextPartial>
              <TextPartial>
                {LUPA_TEKSTIT.ASIAT.ASIAT_TAULUKKO.ASIA.FI}:&nbsp;
                <Moment format="DD.MM.YYYY">{paatospvm}</Moment>
              </TextPartial>
                <TextPartial>{LUPA_TEKSTIT.ASIAT.ASIAT_TAULUKKO.MAARAAIKA.FI}:&nbsp;
                  <Moment format="DD.MM.YYYY">{voimassaoloalkupvm}</Moment>
                </TextPartial>
                <TextPartial>{LUPA_TEKSTIT.ASIAT.ASIAT_TAULUKKO.PAATETTY.FI}:&nbsp;
                  <Moment format="DD.MM.YYYY">{paatospvm}</Moment>
                </TextPartial>
            </LupaText>
          </Tr>
        } />
        <Media query={MEDIA_QUERIES.TABLET_MIN} render={() =>
          <Tr>
            <Td flex="3">OKM/{diaarinumero}</Td>
            <Td flex="3">
              {/* Mok */}
              { diaarinumero.endsWith("7") ? "Uusi järjestämislupa" : "Järjestämisluvan muutos" }
            </Td>
            <Td flex="2">
                {/* Mok */}
                { diaarinumero.endsWith("7") ? "Käsittelyssä" : "Täydennettävä" }
            </Td>
            <Td flex="2">
              <Moment format="DD.MM.YYYY">{voimassaololoppupvm}</Moment>
            </Td>
            <Td flex="2">
              <Moment format="DD.MM.YYYY">{paatospvm}</Moment>
            </Td>
            <TdButton>
              {/* Mok */}
              {/* { diaarinumero.endsWith("7") ? */}
              <Button 
                title="Täydennä hakemusta" 
                onClick={(e) => refill(e,diaarinumero)}>
                  <FaEdit />
                </Button>
              {/* :
                null
              } */}
            </TdButton>
            <TdButton>
            { diaarinumero.endsWith("7") ?
                <Button 
                title="Peruuta hakemus"
                onClick={(e) => cancel(e,diaarinumero)}>
                  <MdCancel />
                </Button>
              :
                null
              }
            </TdButton>
          </Tr>
        } />
    </a>
  )
}

export default JarjestamislupaAsiaListItem
