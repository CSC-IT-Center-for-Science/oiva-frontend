import { SET_LOCALE } from "./actionTypes";
import reducer from "./reducer";

it("has correct action types", () => {
  expect(SET_LOCALE).toBe("SET_LOCALE");
});

it("handles to setting of a locale", () => {
  const oldState = {
    locale: "sv"
  };
  const newState = {
    ...oldState,
    locale: "fi"
  };
  expect(reducer(oldState, { type: SET_LOCALE, locale: "fi" })).toStrictEqual(
    newState
  );
});
