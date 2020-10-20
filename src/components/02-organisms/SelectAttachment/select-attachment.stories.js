import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import SelectAttachment from "../../../../../src/lib/components/02-organisms/SelectAttachment";

storiesOf("SelectAttachment", module)
  .addDecorator(withInfo)
  .add("Example 1", () => (
    <SelectAttachment
      messages={{
        attachmentAdd: "Lisää liite",
        attachmentName: "Liitteen nimi",
        attachmentErrorName: "Nimi on pakollinen",
        attachmentError: "Virheellinen tiedostotyyppi",
        ok: "Ok",
        cancel: "Peruuta"
      }}/>
  ));
