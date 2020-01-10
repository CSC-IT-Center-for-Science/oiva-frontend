export const heights = {
  LONG: "long",
  SHORT: "short"
};
export const autocompleteShortStyles = {
  dropdownIndicator: base => ({
    ...base,
    padding: 4
  }),
  clearIndicator: base => ({
    ...base,
    padding: 4
  }),
  valueContainer: base => ({
    ...base
  }),
  input: base => ({
    ...base,
    margin: 0,
    padding: 0
  }),
  control: styles => {
    return {
      ...styles,
      backgroundColor: "white",
      minHeight: "fit-content"
    };
  }
};
