import { getRajoiteListamuodossa } from "utils/rajoitteetUtils";

export const previewOfRajoite = (
  { changeObjects: rajoiteChangeObjects, rajoiteId },
  booleans,
  locale
) => {
  const rajoiteListamuodossa = getRajoiteListamuodossa(
    rajoiteChangeObjects,
    locale,
    rajoiteId
  );

  return [
    {
      anchor: rajoiteId,
      components: [
        {
          anchor: "sisalto",
          name: "HtmlContent",
          properties: {
            content: rajoiteListamuodossa
          }
        }
      ]
    }
  ];
};
