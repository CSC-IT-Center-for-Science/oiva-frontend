import React from "react";
import { Td, Td2, Tr } from "../../../../modules/Table";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

const JarjestamislupaAsiakirjatItem = props => {
  const { rowItems, onClick = () => {} } = props;

  return (
    <Tr rolse="row" onClick={onClick}>
      {rowItems.map((val, idx) =>
        idx === 0 ? (
          <Td2 role="cell" key={idx}>
            <Typography>{val}</Typography>
          </Td2>
        ) : (
          <Td role="cell" key={idx}>
            <Typography>{val}</Typography>
          </Td>
        )
      )}
    </Tr>
  );
};

JarjestamislupaAsiakirjatItem.propTypes = {
  rowItems: PropTypes.array,
  onClick: PropTypes.func
};

export default JarjestamislupaAsiakirjatItem;
