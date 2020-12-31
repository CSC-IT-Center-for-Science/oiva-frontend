import { getRajoiteListamuodossa } from "utils/rajoitteetUtils";

export const previewOfRajoite = ({ lomakedata, rajoiteId }) => {
  const rajoiteListamuodossa = getRajoiteListamuodossa(
    rajoiteId,
    lomakedata,
    "list"
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
