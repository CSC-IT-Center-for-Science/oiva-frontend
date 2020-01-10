import { parseLocalizedField, parsePostalCode, slugify } from "./helpers";

it("should return undefined", () => {
  const result = parseLocalizedField({}, "FI", "nimi", "kieli");
  expect(result).toEqual(undefined);
});

it("should parse a localized field", () => {
  const obj = [
    {
      kieli: "FI",
      nimi: "Test FI"
    },
    {
      kieli: "SV",
      nimi: "Test SV"
    }
  ];
  const result = parseLocalizedField(obj, "FI", "nimi", "kieli");
  expect(result).toBe("Test FI");
});

it("should work with defaults", () => {
  const obj = [
    {
      kieli: "FI",
      nimi: "Test FI"
    },
    {
      kieli: "SV",
      nimi: "Test SV"
    }
  ];
  const result = parseLocalizedField(obj);
  expect(result).toBe("Test FI");
});

it("should slugify", () => {
  const str = "Example text -- ^åbo 2é";
  expect(slugify(str)).toBe("example-text-bo-2e");
});

it("should return the original value", () => {
  expect(slugify(false)).toBe(false);
});

it("should return an empty string", () => {
  const postalCode = null;
  expect(parsePostalCode(postalCode)).toBe("");
});

it("should parse a postal code", () => {
  const postalCode = "FI-40100";
  expect(parsePostalCode(postalCode)).toBe("40100");
});
