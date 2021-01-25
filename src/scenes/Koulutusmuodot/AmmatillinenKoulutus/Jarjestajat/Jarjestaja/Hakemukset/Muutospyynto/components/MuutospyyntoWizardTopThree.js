import React, { useMemo } from "react";
import Lomake from "components/02-organisms/Lomake";
import { useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";

const MuutospyyntoWizardTopThree = React.memo(() => {
  const { uuid } = useParams();
  const intl = useIntl();
  const formLocations = {
    kolmeEnsimmaistaKenttaa: ["esittelija", "topThree"]
  };
  const sectionId = "topthree";

  const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

  const lomakedata = useMemo(
    () => ({
      formatMessage: intl.formatMessage,
      uuid
    }),
    [intl, uuid]
  );

  return (
    <Lomake
      anchor={sectionId}
      changeObjects={changeObjects}
      data={lomakedata}
      isInExpandableRow={false}
      isReadOnly={false}
      mode="addition"
      path={formLocations.kolmeEnsimmaistaKenttaa}
    ></Lomake>
  );
});

MuutospyyntoWizardTopThree.propTypes = {};

export default MuutospyyntoWizardTopThree;
