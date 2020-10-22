import React from "react";

const JarjestajaBasicInfo = ({ jarjestaja }) => {
  return (
    <React.Fragment>
      <h1 className="mb-1">{jarjestaja.nimi}</h1>
      <p className="text-xl leading-tight m-0">{jarjestaja.ytunnus}</p>
    </React.Fragment>
  );
};

export default JarjestajaBasicInfo;
