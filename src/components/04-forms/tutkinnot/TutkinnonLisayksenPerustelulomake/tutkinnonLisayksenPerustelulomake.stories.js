import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import TutkinnonLisayksenPerustelulomake from "./index";
import { exampleStory } from "./storydata/exampleStory";

storiesOf("Lomakkeet/Tutkinnot/", module)
  .addDecorator(withInfo)
  .add("Lisäyksen perustelulomake", () => {
    return (
      <TutkinnonLisayksenPerustelulomake
        checkboxItems={exampleStory.checkboxItems}
        changes={exampleStory.changes}
      ></TutkinnonLisayksenPerustelulomake>
    );
  });
