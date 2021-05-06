import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import ConfirmDialog from "./index";

const messages = {
  ok: "Merkitse päätetyksi",
  cancel: "Peruuta",
  content:
    "Tähän kuvaava ohjeteksti varmistamaan, että muutokset on allekirjoitutettu ministerillä. Muutosta ei voi esittelijä kumota.",
  title: "Merkitäänkö asia päätetyksi?",
  noSave: "Älä tallenna"
};

storiesOf("Confirm Dialog", module)
  .addDecorator(withInfo)
  .add("Example 1", () => {
    const [state, setState] = useState({
      clicked: false
    });
    return (
      <ConfirmDialog
        isConfirmDialogVisible={true}
        handleCancel={() => console.log("cancel")}
        handleOk={() => setState({ clicked: true })}
        onClose={() => console.log("onClose clicked!")}
        messages={messages}
        loadingSpinner={state.clicked}
      />
    );
  })
  .add("With abandon changes", () => {
    const [state, setState] = useState({
      clicked: false
    });
    return (
      <ConfirmDialog
        isConfirmDialogVisible={true}
        handleCancel={() => console.log("cancel")}
        handleOk={() => setState({ clicked: true })}
        handleExitAndAbandonChanges={() => console.log("exit not saving")}
        onClose={() => console.log("onClose clicked!")}
        messages={messages}
        loadingSpinner={state.clicked}
      />
    );
  });
