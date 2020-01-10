import React from "react";
import styled from "styled-components";
import { Td, Tr, TdButton, Td2 } from "../../../../modules/Table";
import { MEDIA_QUERIES } from "../../../../modules/styles";
import { LUPA_TEKSTIT } from "../../../Jarjestajat/Jarjestaja/modules/constants";
import Button from "@material-ui/core/Button";
import Edit from "@material-ui/icons/Edit";
import { Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { FIELDS } from "../../../../locales/uusiHakemusFormConstants";
import { injectIntl } from "react-intl";
import common from "../../../../i18n/definitions/common";

const LupaText = styled.span`
  margin: 10px;

  @media ${MEDIA_QUERIES.MOBILE} {
    display: flex;
    flex-direction: column;
  }
`;

const TextPartial = styled.span`
  margin-right: 10px;
`;

const JarjestamislupaAsiaListItem = props => {
  const { tila, uuid } = props.muutospyynto;
  const { intl, states } = props;
  return (
    <React.Fragment>
      <Tr className="lg:hidden" role="row" onClick={() => props.setOpened()}>
        <Td role="cell">
          <LupaText>
            <TextPartial>{intl.formatMessage(common.change)}</TextPartial>
            <TextPartial>
              {intl.formatMessage(common.stateAsia)}:&nbsp;
              {tila &&
                states.includes(tila) &&
                LUPA_TEKSTIT.MUUTOSPYYNTO.TILA[tila].FI}
            </TextPartial>
          </LupaText>
          {tila === FIELDS.TILA.VALUES.LUONNOS && (
            <LupaText>
              <NavLink to={`hakemukset-ja-paatokset/${uuid}/1`} exact={true}>
                <Button title={intl.formatMessage(common.edit)}>
                  <Edit />
                </Button>
              </NavLink>
            </LupaText>
          )}
        </Td>
      </Tr>
      <Tr
        className="hidden lg:block"
        role="row"
        onClick={() => props.setOpened(uuid)}>
        <Td role="cell" size="small">
          <Typography component="span">{}</Typography>
        </Td>
        <Td2 role="cell">
          <Typography component="span">
            {intl.formatMessage(common.change)}
          </Typography>
        </Td2>
        <Td role="cell" size="small">
          <Typography component="span">
            {LUPA_TEKSTIT.MUUTOSPYYNTO.TILA[tila].FI}
          </Typography>
        </Td>
        <Td role="cell" size="small">
          <Typography component="span" noWrap={true}></Typography>
        </Td>
        <Td role="cell" size="small">
          <Typography component="span" noWrap={true}></Typography>
        </Td>
        <TdButton role="cell" className="bg-transparent">
          {tila === FIELDS.TILA.VALUES.LUONNOS && (
            <div className="flex ml-auto">
              <NavLink to={`hakemukset-ja-paatokset/${uuid}/1`} exact={true}>
                <Button title={intl.formatMessage(common.edit)}>
                  <Edit />
                </Button>
              </NavLink>
            </div>
          )}
        </TdButton>
      </Tr>
      {/* )}
      /> */}
    </React.Fragment>
  );
};

export default injectIntl(JarjestamislupaAsiaListItem);
