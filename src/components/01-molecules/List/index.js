import React from "react";
import { addIndex, map } from "ramda";
import Rajoite from "components/02-organisms/Rajoite";
import HtmlContent from "../HtmlContent";

const List = ({ items }) => {
  const itemsToRender = addIndex(map)(
    (item, index) => (
      <li key={`list-item-${index}`} className="leading-bulletList">
        {map(component => {
          const { properties } = component;
          if (properties) {
            if (component.name === "Rajoite") {
              return (
                <Rajoite
                  areTitlesVisible={properties.areTitlesVisible}
                  id={properties.id}
                  isReadOnly={properties.isReadOnly}
                  key={index}
                  locale={properties.locale}
                  rajoiteId={properties.rajoiteId}
                  rajoite={properties.rajoite}
                />
              );
            } else if (component.name === "HtmlContent") {
              return (
                <HtmlContent
                  key={index}
                  content={properties.content}
                ></HtmlContent>
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
