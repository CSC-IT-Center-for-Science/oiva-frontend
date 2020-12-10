import React from "react";
import { addIndex, map } from "ramda";

const List = ({ items }) => {
  const itemsToRender = addIndex(map)(
    (item, index) => <li key={`list-item-${index}`}>{item.content}</li>,
    items
  );

  return <ul className="list-disc px-6">{itemsToRender}</ul>;
};

export default List;
