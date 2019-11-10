import React from "react";
import { Td, Tr } from "../../../../modules/Table";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

const JarjestamislupaAsiakirjatItem = props => {
  const { rowItems, onClick } = props;

  return (
    <Tr onClick = { onClick }>
      {
        rowItems.map((val, idx) => (
          <Td key={idx}>
            <Typography>{val}</Typography>
          </Td>
        ))
      }
    </Tr>
  )
};

JarjestamislupaAsiakirjatItem.propTypes = {
  rowItems: PropTypes.array,
  onClick: PropTypes.func
};

export default JarjestamislupaAsiakirjatItem;
