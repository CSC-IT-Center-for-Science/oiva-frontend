import { path } from "ramda";
import React from "react";

const LisatiedotHtmlLupa = ({ lisatietomaarays }) => {
  return (
    <p className="whitespace-pre-wrap">
      {path(["meta", "arvo"], lisatietomaarays)}
    </p>
  );
};

export default LisatiedotHtmlLupa;
