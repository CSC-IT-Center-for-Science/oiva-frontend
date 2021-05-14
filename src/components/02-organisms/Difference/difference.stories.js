import React, { useState } from "react";
import Difference from "./index";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { story1 } from "./storyData/story1";
import { story2 } from "./storyData/story2";
import { story3 } from "./storyData/story3";

storiesOf("Difference", module)
  .addDecorator(withInfo)
  .add("Modifiable and not required", () => {
    const [, setState] = useState({
      applyForValue: 0
    });
    const onChanges = (payload, { applyForValue }) => {
      console.info(payload);
      setState({ applyForValue });
    };

    return (
      <Difference
        initialValue={story1.initialValue}
        titles={story1.titles}
        onChanges={onChanges}
      />
    );
  })
  .add("Modifiable and required", () => {
    const [, setState] = useState({
      applyForValue: 0
    });
    const onChanges = (payload, { applyForValue }) => {
      console.info(payload);
      setState({ applyForValue });
    };

    return (
      <Difference
        initialValue={story2.initialValue}
        applyForValue={story2.applyForValue}
        titles={story2.titles}
        isRequired
        onChanges={onChanges}
      />
    );
  })
  .add("Read-only", () => {
    return (
      <Difference
        initialValue={story3.initialValue}
        applyForValue={story3.applyForValue}
        titles={story2.titles}
        isReadOnly={true}
      />
    );
  });
