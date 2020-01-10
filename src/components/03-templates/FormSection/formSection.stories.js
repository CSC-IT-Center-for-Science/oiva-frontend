import React from "react";
import { storiesOf } from "@storybook/react";
import FormSection from "./index";
import { simpleStory } from "../../02-organisms/CategorizedListRoot/storydata/simpleStory";
import { complexStory } from "../../02-organisms/CategorizedListRoot/storydata/complexStory";
import ExpandableRowRoot from "../../02-organisms/ExpandableRowRoot";
import { withInfo } from "@storybook/addon-info";

const handleChanges = (sectionId, payload) => {
  console.info("Passing the changes on...", sectionId, payload);
};

storiesOf("FormSection", module)
  .addDecorator(withInfo)
  .add("Code and title are visible", () => (
    <FormSection
      id="tutkinnot-ja-koulutukset"
      code={1}
      title="Title of a section"
    >
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
    </FormSection>
  ))
  .add("Only the title is set", () => (
    <FormSection
      id="kielet"
      title="Title of a section"
    >
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
    </FormSection>
  ))
  .add("Usage with ExpandableRowRoot", () => (
    <FormSection
      id="kielet"
      sectionChanges={{ simple :simpleStory.changes}}
      code={3}
      title="Title of a section"
      runOnChanges={handleChanges}
      render={props => (
        <ExpandableRowRoot
          anchor={"simple"}
          categories={simpleStory.categories}
          changes={props.sectionChanges.simple}
          code="1"
          disableReverting={true}
          hideAmountOfChanges={false}
          isExpanded={true}
          title={"Simple story"}
          {...props}
        />
      )}
    />
  ))
  .add("Usage with multiple ExpandableRowRoots", () => (
    <FormSection
      id="muut"
      sectionChanges={{
        simple: simpleStory.changes,
        complex: complexStory.changes
      }}
      code={3}
      title="Title of a section"
      runOnChanges={handleChanges}
      render={props => (
        <React.Fragment>
          <ExpandableRowRoot
            anchor={"simple"}
            categories={simpleStory.categories}
            changes={props.sectionChanges.simple}
            code="1"
            disableReverting={true}
            hideAmountOfChanges={false}
            showCategoryTitles={false}
            isExpanded={true}
            title={"Simple story"}
            {...props}
          />
          <ExpandableRowRoot
            anchor={"complex"}
            categories={complexStory.categories}
            changes={props.sectionChanges.complex}
            code="2"
            disableReverting={true}
            hideAmountOfChanges={false}
            isExpanded={true}
            showCategoryTitles={true}
            title={"Complex story"}
            {...props}
          />
        </React.Fragment>
      )}
    />
  ));
