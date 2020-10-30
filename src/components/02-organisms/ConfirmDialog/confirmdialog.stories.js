import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import ConfirmDialog from "./index";
import { withState } from "@dump247/storybook-state";


const messages = {
  ok: "Merkitse päätetyksi",
  cancel: "Peruuta",
  content: "Tähän kuvaava ohjeteksti varmistamaan, että muutokset on allekirjoitutettu ministerillä. Muutosta ei voi esittelijä kumota.",
  title: "Merkitäänkö asia päätetyksi?",
  noSave: "Älä tallenna"
}

storiesOf("Confirm Dialog", module)
  .addDecorator(withInfo)
  .add("Example 1", withState({clicked: false})(({store}) => (
    <ConfirmDialog
      isConfirmDialogVisible={true}
      handleCancel={() => console.log("cancel")}
      handleOk={() => store.set({clicked: true})}
      onClose={() => console.log("onClose clicked!")}
      messages={messages}
      loadingSpinner={store.state.clicked}
    />
  )))
  .add("With abandon changes", withState({clicked: false})(({store}) => (
    <ConfirmDialog
      isConfirmDialogVisible={true}
      handleCancel={() => console.log("cancel")}
      handleOk={() => store.set({clicked: true})}
      handleExitAndAbandonChanges={() => console.log("exit not saving")}
      onClose={() => console.log("onClose clicked!")}
      messages={messages}
      loadingSpinner={store.state.clicked}
    />
    )));
