import _ from "lodash";

export const addItemToChanges = (
  item,
  currentChanges,
  listId,
  operationType
) => {
  return {
    ...currentChanges,
    [listId]: _.concat(currentChanges[listId] || [], {
      koodiarvo: item.code,
      type: operationType,
      koodisto: "koulutus"
    })
  };
};

export const addSubItemToChanges = (
  subItem,
  currentChanges,
  listId,
  operationType
) => {
  return {
    ...currentChanges,
    [listId]: _.concat(currentChanges[listId] || [], {
      koodiArvo: subItem.code,
      type: operationType,
      koodisto: "osaamisala"
    })
  };
};

export const removeItemFromChanges = (item, currentChanges, listId) => {
  return {
    ...currentChanges,
    [listId]: _.filter(currentChanges[listId] || [], change => {
      return change.koodiarvo !== item.code;
    })
  };
};

export const removeSubItemFromChanges = (subItem, currentChanges, listId) => {
  return {
    ...currentChanges,
    [listId]: _.filter(currentChanges[listId] || [], change => {
      return change.koodiArvo !== subItem.code;
    })
  };
};
