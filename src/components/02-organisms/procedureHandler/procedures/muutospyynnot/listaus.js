// muutospyynnot.listaus
export const listaus = {
  label: "Muutospyyntölistaukseen siirtyminen",
  input: ["ytunnus"],
  run: ({ ytunnus }) => {
    return `/jarjestajat/${ytunnus}/jarjestamislupa-asia`;
  }
};
