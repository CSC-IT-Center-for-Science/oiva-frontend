import React from "react";
import Table from "../../02-organisms/Table";
import { generateAvoimetAsiatTableStructure } from "../../../utils/asiatUtils";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

const KorjattavatAsiat = ({ korjauksessaOlevatAsiat, koulutusmuoto }) => {
  const history = useHistory();
  const intl = useIntl();

  const tableStructure = korjauksessaOlevatAsiat
    ? generateAvoimetAsiatTableStructure(
        korjauksessaOlevatAsiat.data,
        intl,
        history,
        koulutusmuoto.kebabCase
      )
    : [];

  return (
    <div
      style={{
        borderBottom: "0.05rem solid #E3E3E3"
      }}
    >
      <Table
        structure={tableStructure}
        sortedBy={{ columnIndex: 5, order: "desc" }}
      />
    </div>
  );
};

export default KorjattavatAsiat;
