import React from "react";
import {useIntl} from "react-intl";
import moment from 'moment';
import styled from "styled-components";
import Media from "react-media";

import { MEDIA_QUERIES } from "../../../../modules/styles";

import { API_BASE_URL } from "../../../../modules/constants";
import { Td, Tr } from "../../../../modules/Table";
import common from "../../../../i18n/definitions/common";
import Moment from "react-moment";

const LupaText = styled.span`
  @media ${MEDIA_QUERIES.MOBILE} {
    display: flex;
    flex-direction: column;
  }
`;

const LupaHistoryItem = props => {
  const {
    diaarinumero,
    voimassaoloalkupvm,
    voimassaololoppupvm,
    paatospvm,
    kumottupvm,
    uuid
  } = props.lupaHistoria;

  const intl = useIntl()
  const voimassaoloalkupvmFormatted = (new moment(voimassaoloalkupvm,'YYYY-MM-DD')).format('D.M.YYYY');
  const voimassaololoppupvmFormatted = (new moment(voimassaololoppupvm,'YYYY-MM-DD')).format('D.M.YYYY');
  const paatospvmFormatted = (new moment(paatospvm,'YYYY-MM-DD')).format('D.M.YYYY');

  const showValidityDates = !kumottupvm || kumottupvm >= voimassaoloalkupvm;

  return (
    <a
      href={`${API_BASE_URL}/pdf/historia/${uuid}`}
      target="_blank"
      rel="noopener noreferrer">
      <Media
        query={MEDIA_QUERIES.MOBILE}
        render={() => (
          <Tr role="row">
            <LupaText className="m-3">
              <span className="mr-3">{intl.formatMessage(common.diaarinumero)}: {diaarinumero}</span>
              <span className="mr-3">
                {intl.formatMessage(common.lupaHistoriaPaatosDateMobile, {
                  date: paatospvmFormatted
                })}
              </span>
                {!showValidityDates
                    ? <span className="mr-3">
                        {intl.formatMessage(common.lupaHistoriaKumottuDateMobile, {
                            date: voimassaololoppupvm
                      })}
                      </span>
                    : <span className="mr-3">
                        {intl.formatMessage(common.lupaHistoriaValidDateRangeMobile, {
                            date1: voimassaoloalkupvmFormatted,
                            date2: voimassaololoppupvmFormatted
                        })}
                      </span>
                }
            </LupaText>
          </Tr>
        )}
      />
      <Media
        query={MEDIA_QUERIES.TABLET_MIN}
        render={() => (
          <div>
              <Tr role="row">
                <Td role="cell">{diaarinumero}</Td>
                <Td role="cell">{paatospvmFormatted}</Td>
                <Td role="cell">{showValidityDates && <Moment format="DD.MM.YYYY">{voimassaoloalkupvm}</Moment>}</Td>
                <Td role="cell">{showValidityDates && <Moment format="DD.MM.YYYY">{voimassaololoppupvm}</Moment>}</Td>
                <Td role="cell">{!showValidityDates && <Moment format="DD.MM.YYYY">{kumottupvm}</Moment>}</Td>
              </Tr>
          </div>
        )}
      />
    </a>
  );
};

export default LupaHistoryItem;
