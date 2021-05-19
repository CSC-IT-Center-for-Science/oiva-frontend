const Lisatiedot = title => {
  return {
    anchor: "lisatiedot",
    components: [
      {
        anchor: "A",
        name: "StatusTextRow",
        styleClasses: ["pt-2 whitespace-pre-wrap"],
        properties: {
          title
        }
      }
    ]
  };
};

export default Lisatiedot;
