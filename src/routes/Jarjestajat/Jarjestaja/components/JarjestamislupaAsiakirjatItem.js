import React from 'react'
import Moment from 'react-moment'
import styled from 'styled-components'
import Media from 'react-media'
import { FaEdit, FaTrash } from 'react-icons/fa';
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
  line-height: 36px;
  vertical-align: middle;
  text-align: center;
  border-radius: 2px;
  margin: 1px;
  padding: 8px 10px;
  z-index: 10;
  &:hover {
    color: ${props => props.disabled ? COLORS.WHITE : props.bgColor ? props.bgColor : COLORS.OIVA_GREEN};
    background-color: ${props => props.disabled ? COLORS.LIGHT_GRAY : props.textColor ? props.textColor : COLORS.WHITE};
    ${props => props.disabled ? 'cursor: not-allowed;' : null}
  }
  svg {
    margin: 0 auto;
  }
`

const JarjestamislupaAsiakirjatItem = (props) => {

  const { diaarinumero, voimassaoloalkupvm, paatospvm } = props.lupaHistoria;

  const state = {
    draft: "Luonnos",
    ready: "Valmis"
  }

  const type = {
    application: "Hakemus",
    attachement: "Liite",
    attachementConfidential: "Liite (salassa pidettävä)",
    supplement: "Täydennys",
    answer: "Vastaus kuulemispyyntöön",
    cancelation: "Hakemuksen peruutus",
    supplementRequest: "Täydennyspyyntö",
    auditionRequest: "Kuulemispyyntö",
    decision: "Päätös",
    correctionDecision: "Korjauspäätös",
    remediationDecision: "Oikaisupäätös",
    arrangementCancelation: "Järjestämisluvan peruutus",
    decisionArrangementCancelation: "Päätös järjestämisluvan peruuttamisesta"
  }

  const open = (e,nro) => {
    e.stopPropagation();
    console.log("open " + nro);
  }

  const refill = (e,nro) => {
    e.stopPropagation();
    console.log("refill " + nro);
  }

  const cancel = (e,nro) => {
    e.stopPropagation();
    console.log("cancel " + nro);
  }

  const remove = (e,nro) => {
    e.stopPropagation();
    console.log("delete " + nro);
  }

  return (
    <a onClick={(e) => open(e,diaarinumero)} href>
      <Media query={MEDIA_QUERIES.MOBILE} render={() =>
          <Tr>
            <LupaText>
              <TextPartial>{LUPA_TEKSTIT.ASIAT.ASIATKIRJAT_TAULUKKO.ASIAKIRJA.FI}</TextPartial>
              <TextPartial>
               {LUPA_TEKSTIT.ASIAT.ASIATKIRJAT_TAULUKKO.TILA.FI}:&nbsp;
              </TextPartial>
              <TextPartial>
               {LUPA_TEKSTIT.ASIAT.ASIATKIRJAT_TAULUKKO.LAATIJA.FI}:&nbsp;
              </TextPartial>
              <TextPartial>
                {LUPA_TEKSTIT.ASIAT.ASIATKIRJAT_TAULUKKO.VALMIS.FI}:&nbsp;
                <Moment format="DD.MM.YYYY">{paatospvm}</Moment>
              </TextPartial>
            </LupaText>
          </Tr>
        } />
        <Media query={MEDIA_QUERIES.TABLET_MIN} render={() =>
          <Tr>
            <Td flex="2">
              {/* Mok */}
              { diaarinumero.endsWith("7") ? type.application : type.supplement }
            </Td>
            <Td flex="2">
              {/* Mok */}
              { diaarinumero.endsWith("7") ? state.ready : state.draft }
            </Td>
            <Td flex="3">
              Jyväskylän koulutuskuntayhtymä
            </Td>
            <Td flex="2">
              <Moment format="DD.MM.YYYY">{voimassaoloalkupvm}</Moment>
            </Td>
            <TdButton>
              {/* Mok */}
              { diaarinumero.endsWith("7") ?
                <Button 
                  title="Täydennä hakemusta" 
                  onClick={(e) => refill(e,diaarinumero)}>
                    <FaEdit />
                </Button>
                :
                  null 
                }
            </TdButton>
            <TdButton>
            { !diaarinumero.endsWith("7") ?
                <Button 
                  title={LUPA_TEKSTIT.ASIAT.POISTA_TAYDENNYS.FI}
                  onClick={(e) => remove(e,diaarinumero)}>
                    <FaTrash />
                </Button>
              :
              <Button 
              title={LUPA_TEKSTIT.ASIAT.PERUUTA_HAKEMUS.FI}
                onClick={(e) => cancel(e,diaarinumero)}>
                  <MdCancel />
              </Button>
              }
            </TdButton>
          </Tr>
        } />
    </a>
  )
}

export default JarjestamislupaAsiakirjatItem
