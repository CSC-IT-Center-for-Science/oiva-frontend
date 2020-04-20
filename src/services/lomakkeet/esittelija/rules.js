import { createRules } from "../utils";
import { requiredFields } from "./requiredFields";

export function getRules(_lomake) {
  // Rules for top three fields of muutospyyntö
  const rules = createRules(requiredFields);

  return rules;
}
