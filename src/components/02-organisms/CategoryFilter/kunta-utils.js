export function getAnchor(baseAnchor, maakuntaKey, koodiarvo) {
  return `${baseAnchor}.${maakuntaKey}.kunnat.${koodiarvo}`;
}

export function getAdditionChangeObj(
  baseAnchor,
  maakuntaKey,
  title,
  koodiarvo
) {
  return {
    anchor: getAnchor(baseAnchor, maakuntaKey, koodiarvo),
    properties: {
      isChecked: true,
      metadata: {
        title,
        koodiarvo,
        maakuntaKey
      }
    }
  };
}

export function getRemovalChangeObj(baseAnchor, maakuntaKey, koodiarvo, title) {
  return {
    anchor: getAnchor(baseAnchor, maakuntaKey, koodiarvo),
    properties: {
      isChecked: false,
      isIndeterminate: false,
      metadata: {
        koodiarvo,
        maakuntaKey,
        title
      }
    }
  };
}
