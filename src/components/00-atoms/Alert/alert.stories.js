import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import AlertMessage from "./index";

storiesOf("AlertMessage", module)
  .addDecorator(withInfo)
  .add("info (default)", () => (
    <div className="mt-8">
      <AlertMessage title="Title is here" />
      <br />
      <AlertMessage message="Message is here" />
      <br />
      <AlertMessage title="Title is here" message="Message is here" />
      <br />
      <AlertMessage
        message="The long message is here."
        linkText="This is the link"
        handleLinkClick={() => console.log("Link pressed")}
      />
    </div>
  ))
  .add("warning", () => (
    <div className="mt-8">
      <AlertMessage type="warning" title="Title is here" />
      <br />
      <AlertMessage type="warning" message="Message is here" />
      <br />
      <AlertMessage
        type="warning"
        message="Message is here."
        linkText="This is the link"
        handleLinkClick={() => console.log("Link pressed")}
      />
      <br />
      <AlertMessage type="warning" title="Title" message="Message is here" />
    </div>
  ))
  .add("error", () => (
    <div className="mt-8">
      <AlertMessage type="error" title="Title is here" />
      <br />
      <AlertMessage type="error" message="Message is here" />
      <br />
      <AlertMessage
        type="error"
        message="Message is here."
        linkText="This is the link"
        handleLinkClick={() => console.log("Link pressed")}
      />
      <br />
      <AlertMessage
        type="error"
        title="Title is here"
        message="Message is here"
      />
    </div>
  ))
  .add("success", () => (
    <div className="mt-8">
      <AlertMessage type="success" title="Title is here" />
      <br />
      <AlertMessage type="success" message="Message is here" />
      <br />
      <AlertMessage
        type="success"
        message="Message is here."
        linkText="This is the link"
        handleLinkClick={() => console.log("Link pressed")}
      />
      <br />
      <AlertMessage
        type="success"
        title="Title is here"
        message="Message is here"
      />
    </div>
  ));
