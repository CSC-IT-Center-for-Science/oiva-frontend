import React from "react";
import PropTypes from "prop-types";

/**
 * Funktio rakentaa lukiokoulutuksen HTML-lupanäkymän.
 * @param {*} lupa - Lupa, jonka tietoja hyödyntäen lupanäkymä muodostetaan.
 */
const JarjestamislupaJSX = ({ lupa, lupakohteet, kielet }) => {
  return <div>Lukion HTML-lupanäkymä tulee tähän.</div>;
};

JarjestamislupaJSX.propTypes = {
  lupa: PropTypes.object.isRequired,
  lupakohteet: PropTypes.object
};

export default JarjestamislupaJSX;
