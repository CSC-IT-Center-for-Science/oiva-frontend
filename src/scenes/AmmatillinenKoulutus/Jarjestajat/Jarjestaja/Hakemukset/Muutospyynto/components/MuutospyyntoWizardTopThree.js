import React, { useMemo, useState } from "react";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { useParams } from "react-router-dom";
import { useIntl } from "react-intl";

const MuutospyyntoWizardTopThree = React.memo(() => {
  const { uuid } = useParams();
  const intl = useIntl();
  const formLocations = {
    kolmeEnsimmaistaKenttaa: ["esittelija", "topThree"]
  };

  /** Last asianumero that was checked for duplicates */
  const [lastCheckedAsianumero, setLastCheckedAsianumero] = useState({
    asianumero: "",
    isDuplicate: false
  });

  const lomakedata = useMemo(
    () => ({
      formatMessage: intl.formatMessage,
      uuid,
      setLastCheckedAsianumero,
      lastCheckedAsianumero
    }),
    [intl, uuid, lastCheckedAsianumero]
  );

  return (
    <Lomake
      action="addition"
      anchor="topthree"
      data={lomakedata}
      isInExpandableRow={false}
      path={formLocations.kolmeEnsimmaistaKenttaa}></Lomake>
  );
});

MuutospyyntoWizardTopThree.defaultProps = {};

MuutospyyntoWizardTopThree.propTypes = {};

export default MuutospyyntoWizardTopThree;
