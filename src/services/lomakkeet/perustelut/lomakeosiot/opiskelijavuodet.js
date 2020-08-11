export default function opiskelijavuodet(code, anchorNumber, isReadOnly) {
  const year = new Date().getFullYear();
  return {
    anchor: `${code}-${anchorNumber}`,
    code,
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    title: "Arvio koulutukseen suunnattavista opiskelijavuosista",
    categories: [
      {
        anchor: `${code}-${anchorNumber}`,
        components: [
          {
            anchor: "opiskelijavuodet-header",
            name: "StatusTextRow",
            styleClasses: ["font-semibold"],
            properties: {
              isReadOnly,
              labelStyles: {},
              title:
                "Merkitkää arvionne tehtävään kohdistettavista opiskelijavuosista po. vuosina."
            }
          }
        ],
        categories: [
          {
            anchor: "vuodet",
            layout: {
              indentation: "none"
            },
            styleClasses: ["flex sm:row"],
            components: [
              {
                anchor: "A",
                name: "Input",
                styleClasses: ["mr-8"],
                properties: {
                  forChangeObject: {
                    year: (year + 1).toString()
                  },
                  isReadOnly,
                  isRequired: true,
                  withoutMargin: true,
                  label: (year + 1).toString(),
                  type: "number",
                  width: "7em",
                  value: ""
                }
              },
              {
                anchor: "B",
                name: "Input",
                styleClasses: ["mr-8"],
                properties: {
                  forChangeObject: {
                    year: (year + 2).toString()
                  },
                  isReadOnly,
                  isRequired: true,
                  withoutMargin: true,
                  label: (year + 2).toString(),
                  type: "number",
                  width: "7em",
                  value: ""
                }
              },
              {
                anchor: "C",
                name: "Input",
                properties: {
                  forChangeObject: {
                    year: (year + 3).toString()
                  },
                  isReadOnly,
                  isRequired: true,
                  withoutMargin: true,
                  label: (year + 3).toString(),
                  type: "number",
                  width: "7em",
                  value: ""
                }
              }
            ]
          }
        ]
      }
    ]
  };
}
