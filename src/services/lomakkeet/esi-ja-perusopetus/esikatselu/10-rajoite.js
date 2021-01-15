import { getRajoiteListamuodossa } from "utils/rajoitteetUtils";

export const previewOfRajoite = ({
  changeObjects: rajoiteChangeObjects,
  rajoiteId
}) => {
  const rajoiteListamuodossa = getRajoiteListamuodossa(
    rajoiteChangeObjects,
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
