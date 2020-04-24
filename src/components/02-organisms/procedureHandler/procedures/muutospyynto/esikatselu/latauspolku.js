// muutospyynto.esikatselu.latauspolku
export const latauspolku = {
  label: "Muutospyynnön latauspolun määrittäminen",
  input: ["uuid"],
  run: ({ uuid }) => {
    return uuid ? `/api/pdf/esikatsele/muutospyynto/${uuid}` : null;
  },
  next: url => {
    return url
      ? ["muutospyynto.esikatselu.polkuOK"]
      : ["muutospyynto.esikatselu.polkuvirhe"];
  }
};
