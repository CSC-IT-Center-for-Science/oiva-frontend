// muutospyynto.muutokset.poista
export const poista = {
  label: "Muutosten poistaminen",
  input: ["storeActions"],
  run: async ({ storeActions }) => {
    if (storeActions && storeActions.reset) {
      storeActions.reset();
    }
    return storeActions;
  }
};
