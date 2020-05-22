// muutospyynto.esikatselu.latauspolku
export const luvanLatauspolku = {
  label: "Muutospyynnän perusteella generoidun luvan latauspolun määrittäminen",
  input: ["uuid"],
  run: ({ uuid }) => {
    return uuid ? `/api/muutospyynnot/pdf/esikatsele/${uuid}` : null;
  },
  next: url => {
    return url
      ? ["muutospyynto.esikatselu.polkuOK"]
      : ["muutospyynto.esikatselu.polkuvirhe"];
  }
};
