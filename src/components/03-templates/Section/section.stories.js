import React from "react";
import { storiesOf } from "@storybook/react";
import Section from "./index";
import { withInfo } from "@storybook/addon-info";

storiesOf("Section", module)
  .addDecorator(withInfo)
  .add("Code and title are visible", () => (
    <Section code={1} title="Title of a section">
      Cupidatat excepteur Lorem cupidatat nulla dolore nulla ex. Voluptate amet
      anim nisi ipsum. Consectetur tempor consequat in quis elit culpa
      reprehenderit aliqua ut deserunt dolor. Reprehenderit cillum elit laborum
      minim ex. Commodo nostrud fugiat do enim est excepteur sint ad
      exercitation nostrud fugiat. Ipsum enim consequat sunt dolore mollit sit
      aute deserunt occaecat consequat adipisicing. Cupidatat minim
      reprehenderit proident consectetur ullamco. Eu Lorem exercitation labore
      occaecat consequat cupidatat nostrud aliquip adipisicing irure aliquip
      aute elit ad. Consequat aliquip mollit magna magna nostrud consectetur et
      eiusmod. Nulla anim sunt eu quis nulla eu amet anim. Sunt magna ullamco et
      officia elit excepteur eiusmod. Ut do cupidatat mollit reprehenderit. Sit
      labore id est ullamco do. Ullamco laboris officia non nulla labore labore
      in commodo adipisicing commodo incididunt veniam. Incididunt Lorem minim
      amet qui nulla aute enim. Adipisicing sunt magna sunt magna mollit qui
      esse velit. Elit laboris ex excepteur ullamco ea velit eiusmod. Mollit ea
      enim ea quis sit eiusmod amet laborum duis Lorem consequat. Adipisicing
      eiusmod consequat mollit ut eu deserunt pariatur.
    </Section>
  ))
  .add("Only the title is set", () => (
    <Section title="Title of a section">
      Fugiat adipisicing ullamco nostrud occaecat sunt do sit ex esse. In et
      aliqua nostrud esse incididunt consequat adipisicing. Quis magna id id
      quis est. Ipsum sit eiusmod magna veniam nostrud pariatur velit enim
      dolore elit occaecat. Cillum in ipsum ex amet ea occaecat aute pariatur
      commodo deserunt id. Ad laborum dolor nostrud eiusmod irure. Magna enim
      laborum dolore est sint commodo ut occaecat. Est commodo cillum do veniam
      nulla voluptate culpa consectetur nostrud sint adipisicing incididunt non.
      Cillum aliquip non id quis commodo incididunt commodo commodo in ad. Ut
      magna enim dolor consectetur occaecat reprehenderit nulla veniam Lorem
      enim id elit. Pariatur aliqua dolor est consectetur mollit ut est. Dolor
      ex reprehenderit tempor excepteur cupidatat culpa ullamco excepteur magna
      reprehenderit Lorem aliquip mollit.
    </Section>
  ));
