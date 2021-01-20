import getDefaultRemovalForm from "./lomakeosiot/poistolomake";
import { getAdditionForm as getAdditionFormJatkokoulutus } from "./koulutukset/kuljettajakoulutukset/jatkokoulutus/";
import { getAdditionForm as getAdditionFormPeruskoulutus } from "./koulutukset/kuljettajakoulutukset/peruskoulutus/";

export function getKuljettajienJatkokoulutuslomake(action, isReadOnly, prefix) {
  switch (action) {
    case "addition":
      return getAdditionFormJatkokoulutus(isReadOnly);
    case "removal":
      return getDefaultRemovalForm(isReadOnly, prefix);
    default:
      return [];
  }
}

export function getKuljettajienPeruskoulutuslomake(action, isReadOnly, prefix) {
  console.info(isReadOnly);
  switch (action) {
    case "addition":
      return getAdditionFormPeruskoulutus(isReadOnly);
    case "removal":
      return getDefaultRemovalForm(isReadOnly, prefix);
    default:
      return [];
  }
}
