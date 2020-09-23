import React from "react";
import PropTypes from "prop-types";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import Tutkinto from "./Tutkinto";
import _ from "lodash";
import { values, prop, map, length, compose, sum } from "ramda";

const SubAla = props => {
  const { nimi, koulutukset, renderCheckbox, lupaAlkuPvm } = props;
  return (
    <div className="p-4">
      <div>{nimi}</div>
      {_.map(koulutukset, (tutkinto, i) => {
        return (
          <Tutkinto
            {...tutkinto}
            key={i}
            renderCheckbox={renderCheckbox}
            lupaAlkuPvm={lupaAlkuPvm}
          />
        );
      })}
    </div>
  );
};

const Koulutusala = ({
  koodi,
  koulutusalat,
  lupaAlkuPvm,
  nimi,
  renderCheckbox
}) => {
  const amountOfTutkinnot = sum(
    map(compose(length, prop("koulutukset")), values(koulutusalat))
  );
  return (
    <ExpandableRowRoot
      code={koodi}
      title={`${nimi} (${amountOfTutkinnot} kpl)`}>
      {_.map(koulutusalat, (ala, i) => (
        <SubAla
          {...ala}
          key={i}
          renderCheckbox={renderCheckbox}
          lupaAlkuPvm={lupaAlkuPvm}
        />
      ))}
    </ExpandableRowRoot>
  );
};

Koulutusala.propTypes = {
  koulutusalat: PropTypes.object
};

export default Koulutusala;
