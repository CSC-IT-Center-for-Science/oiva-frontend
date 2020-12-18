import React from "react";
import { addIndex, map } from "ramda";
import Rajoite from "components/02-organisms/Rajoite";
import StatusTextRow from "../StatusTextRow/index";

const List = ({ items }) => {
  const itemsToRender = addIndex(map)(
    (item, index) => (
      <li key={`list-item-${index}`}>
        {map(component => {
          console.info(component);
          const { properties } = component;
          if (properties) {
            if (component.name === "Rajoite") {
              return (
                <Rajoite
                  areTitlesVisible={properties.areTitlesVisible}
                  id={properties.id}
                  isReadOnly={properties.isReadOnly}
                  key={index}
                  kriteerit={properties.kriteerit}
                  rajoite={properties.rajoite}
                  rajoitusPropValue={properties.rajoitusPropValue}
                />
              );
            } else if (component.name === "StatuxTextRow") {
              return (
                <StatusTextRow
                  key={index}
                  title={properties.title}
                ></StatusTextRow>
              );
            } else {
              return <div key={index}>[komponenttia ei osata käsitellä]</div>;
            }
          } else {
            return <div>[arvoa ei annettu]</div>;
          }
        }, item.components || [])}
      </li>
    ),
    items
  );

  return <ul className="list-disc px-6">{itemsToRender}</ul>;
};

export default List;
