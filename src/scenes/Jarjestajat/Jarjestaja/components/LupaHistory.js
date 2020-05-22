import React, { useEffect } from "react";
import Media from "react-media";
import styled from "styled-components";
import { Table as OldTable, Tbody } from "../../../../modules/Table";
import { MEDIA_QUERIES } from "../../../../modules/styles";
import LupaHistoryItem from "./LupaHistoryItem";
import Table from "okm-frontend-components/dist/components/02-organisms/Table";
import moment from "moment";
import PropTypes from "prop-types";
import { downloadFileFn } from "../../../../utils/common";
import { useLupahistoria } from "../../../../stores/lupahistoria";
import _ from "lodash";
import * as R from "ramda";
import {useIntl} from "react-intl";
import common from "../../../../i18n/definitions/common";

const WrapTable = styled.div``;

const colWidths = {
  0: "w-3/12",
  1: "w-2/12",
  2: "w-2/12",
  3: "w-2/12",
  4: "w-3/12"
};

const LupaHistory = ({ history, jarjestajaOid }) => {
  const intl = useIntl();
  const [lupahistoria, actions] = useLupahistoria();

  // Let's fetch LUPAHISTORIA
  useEffect(() => {
    if (jarjestajaOid) {
      actions.load(jarjestajaOid);
    }
  }, [actions, jarjestajaOid]);

  const tableStructure = [
    {
      role: "thead",
      rowGroups: [
        {
          rows: [
            {
              cells: R.addIndex(R.map)(
                (title, ii) => {
                  return {
                    isSortable: true,
                    truncate: false,
                    styleClasses: [colWidths[ii]],
                    text: title,
                    sortingTooltip: intl.formatMessage(common.sort)
                  };
                },
                [
                  intl.formatMessage(common.lupaHistoriaDiaarinumeroHeading),
                  intl.formatMessage(common.lupaHistoriaPaatosDateHeading),
                  intl.formatMessage(common.lupaHistoriaStartDateHeading),
                  intl.formatMessage(common.lupaHistoriaEndDateHeading),
                  intl.formatMessage(common.lupaHistoriaKumottuDateHeading)
                ]
              )
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
            const isKumottu = row.kumottupvm && row.kumottupvm < row.voimassaoloalkupvm;
            const voimassaoloalkupvm = moment(row.voimassaoloalkupvm).format(
              "DD.MM.YYYY"
            );
            const voimassaololoppupvm = moment(row.voimassaololoppupvm).format(
              "DD.MM.YYYY"
            );
            return {
              id: row.uuid,
              onClick: row => {
                const lupaHistoryObject = R.find(
                  R.propEq("uuid", row.id),
                  lupahistoria.data
                );
                if (lupaHistoryObject) {
                  downloadFileFn({
                    filename: lupaHistoryObject.filename,
                    openInNewWindow: true,
                    url: `/pdf/historia/${lupaHistoryObject.uuid}`
                  })();
                } else {
                  console.error(intl.formatMessage(common.errorFetchingRow));
                }
              },
              cells: R.addIndex(R.map)(
                (col, ii) => {
                  return {
                    truncate: true,
                    styleClasses: [colWidths[ii]],
                    text: col.text
                  };
                },
                [
                  { text: row.diaarinumero },
                  { text: moment(row.paatospvm).format("DD.MM.YYYY") },
                  { text: !isKumottu ? voimassaoloalkupvm : "" },
                  { text: !isKumottu ? voimassaololoppupvm : "" },
                  { text: isKumottu ? voimassaololoppupvm : "" }
                ]
              )
            };
          }, lupahistoria.data || [])
        }
      ]
    },
    {
      role: "tfoot"
    }
  ];

  const renderLupaHistoryList = data => {
    data = _.orderBy(data, ["paatospvm"], ["desc"]);
    return _.map(data, (historyData, index) => (
      <LupaHistoryItem
        lupaHistoria={historyData}
        key={`${historyData.uuid}-${index}`}
      />
    ));
  };

  return (
    <React.Fragment>
      {lupahistoria.data && (
        <WrapTable>
          <Media
            query={MEDIA_QUERIES.MOBILE}
            render={() => (
              <OldTable role="table">
                <Tbody role="rowgroup">
                  {renderLupaHistoryList(lupahistoria.data)}
                </Tbody>
              </OldTable>
            )}
          />
          <Media
            query={MEDIA_QUERIES.TABLET_MIN}
            render={() => (
              <Table
                structure={tableStructure}
                sortedBy={{ columnIndex: 1, order: "descending" }}></Table>
            )}
          />
        </WrapTable>
      )}
      {lupahistoria.fetchedAt && !lupahistoria.data && (
        <h2>{intl.formatMessage(common.errorLoadingLupaHistory)}</h2>
      )}
    </React.Fragment>
  );
};

LupaHistory.propTypes = {
  history: PropTypes.object,
  jarjestajaOid: PropTypes.string
};

export default LupaHistory;
