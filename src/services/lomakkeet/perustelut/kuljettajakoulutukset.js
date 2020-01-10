import getDefaultRemovalForm from "./lomakeosiot/poistolomake";
import { getAdditionForm as getAdditionFormJatkokoulutus } from "./kuljettajakoulutukset/jatkokoulutus";
import { getAdditionForm as getAdditionFormPeruskoulutus } from "./kuljettajakoulutukset/peruskoulutus/";

export function getKuljettajienJatkokoulutuslomake(
  action,
  data,
  isReadOnly,
  locale,
  prefix
) {
  switch (action) {
    case "addition":
      return getAdditionFormJatkokoulutus(isReadOnly, locale, data);
    case "removal":
      return getDefaultRemovalForm(prefix);
    default:
      return [];
  }
}

export function getKuljettajienPeruskoulutuslomake(
  action,
  data,
  isReadOnly,
  locale,
  prefix
) {
  switch (action) {
    case "addition":
      return getAdditionFormPeruskoulutus(isReadOnly, locale, data);
    case "removal":
      return getDefaultRemovalForm(prefix);
    default:
      return [];
  }
}
