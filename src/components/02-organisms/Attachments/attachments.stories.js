import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import Attachments from "./index";

storiesOf("Attachments", module)
  .addDecorator(withInfo)
  .add("Example 1", () => (
    <>
      <Attachments
        messages={{
          addAttachment: "Lisää liite",
          attachmentDownload: "Lataa koneelle"
        }}
        name="example"
      />
      <Attachments
        isRequired={true}
        messages={{
          addAttachment: "Lisää liite",
          attachmentDownload: "Lataa koneelle"
        }}
        name="example3"
        payload={null}
        requiredMessage="Liite vaaditaan"
        showValidationErrors={true}
      />
    </>
  ));
