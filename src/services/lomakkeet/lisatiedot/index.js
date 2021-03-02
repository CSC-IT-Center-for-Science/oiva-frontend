import React from "react";

const Lisatiedot = title => {
  return {
    anchor: "lisatiedot",
    components: [
      {
        anchor: "A",
        name: "StatusTextRow",
        styleClasses: ["pt-2"],
        properties: {
          title
        }
      }
    ]
  }
};

export default Lisatiedot;
