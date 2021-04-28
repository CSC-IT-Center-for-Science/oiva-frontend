// muutospyynnot.tilanmuutos.korjattavaksi
export const korjattavaksi = {
  label: "Muutospyynnön asettaminen korjaustilaan",
  input: ["id"],
  run: async () => {
    // TODO: Tee backendiin kutsu, jonka myötä muutospyynnön tila vaihtuu
    // tilaksi KORJATTAVANA. Voit katsoa mallia paatetyksi.js:stä.
    return {
      inform: true
    };
  },
  next: output => {
    if (output.inform !== false) {
      if (output.status === 200) {
        return ["muutospyynnot.tilanmuutos.onnistui"];
      } else if (output.status !== 200) {
        return [
          "muutospyynnot.tilanmuutos.korjaustilaanSiirtyminenEpaonnistui"
        ];
      }
    }
  }
};
