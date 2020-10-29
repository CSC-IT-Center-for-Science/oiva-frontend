import React from "react";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";

const constants = {
  formLocation: ["muut"]
};

const Muu = ({ configObj, koodiarvo, sectionId, title }) => {

  // const []

  // useEffect(() => {
  //   R.forEach(configObj => {
  //     const latestSectionChanges = getLatestChangesByAnchor(
  //       `${sectionId}_${configObj.code}`,
  //       latestChanges
  //     );
  //     if (latestSectionChanges.length || !initialized) {
  //       setLomakedata(
  //         {
  //           configObj,
  //           opiskelijavuodetChangeObjects: opiskelijavuodetChangeObjects
  //         },
  //         `${sectionId}_${configObj.code}`
  //       );
  //     }
  //   }, R.filter(R.propEq("isInUse", true))(config));
  //   setInitialized(true);
  // }, [
  //   config,
  //   initialized,
  //   latestChanges,
  //   opiskelijavuodetChangeObjects,
  //   setLomakedata
  // ]);

  return (
    <div>{sectionId}</div>
    // <Lomake
    //   action="modification"
    //   anchor={sectionId}
    //   data={lomakedata[configObj.code]}
    //   key={`lomake-${configObj.code}`}
    //   path={constants.formLocation}
    //   rowTitle={configObj.title}
    //   showCategoryTitles={true}
    // />
  );
};

Muu.propTypes = {
  koodiarvo: PropTypes.string,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default Muu;
