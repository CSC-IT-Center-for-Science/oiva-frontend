import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import ConfirmDialog from "./index";
import {HAKEMUS_VIESTI} from "../../../scenes/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/uusiHakemusFormConstants";

storiesOf("Confirm Dialog", module)
  .addDecorator(withInfo)
  .add("Example 1",
    () =>
      <ConfirmDialog
        content={HAKEMUS_VIESTI.VARMISTUS.FI}
        title={"Poistetaanko?"}
        isConfirmDialogVisible={true}
        handleCancel={() => console.log('cancel')}
        handleOk={() => console.log('ok')}
      />);
