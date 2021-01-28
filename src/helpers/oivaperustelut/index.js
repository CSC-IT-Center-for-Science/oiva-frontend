import localforage from "localforage";

export function getOivaPerustelutFromStorage() {
  return localforage.getItem("oivaperustelut");
}
