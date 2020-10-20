import React from "react";
import Datepicker from "./index";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import {withState} from "@dump247/storybook-state";

let initialState = {value: new Date(Date.now()), payload: {}};

storiesOf("Datepicker", module)
  .addDecorator(withInfo)
  .add("Simple example",  withState(initialState)(({store}) => {
    const onChanges = (payload, { value }) => {
      store.set({value, payload});
    };

    const messages = {
      ok: "ok",
      cancel: "cancel",
      clear: "clear",
      today: "today",
      datemax: "datemax",
      datemin: "datemin",
      dateinvalid: "dateinvalid"
    };

    return (
      <div>
        <p>Normal</p>
        <Datepicker
          value={store.state.value}
          payload={store.state.payload}
          onChanges={onChanges}
          messages={messages}
          locale={"fi"}
        />
        <p>Error + clearable</p>
        <Datepicker
          label="Datepicker"
          value={store.state.value}
          payload={store.state.payload}
          onChanges={onChanges}
          error={true}
          clearable={true}
          showTodayButton={false}
          messages={messages}
          locale={"fi"}
        />
        <p>Read only</p>
        <Datepicker
          label="Datepicker"
          value={store.state.value}
          payload={store.state.payload}
          showTodayButton={false}
          messages={messages}
          locale={"fi"}
          isReadonly
        />
        <p>Required</p>
        <Datepicker
          label="Datepicker"
          showTodayButton={false}
          messages={messages}
          onChanges={onChanges}
          locale={"fi"}
          isRequired
        />
        <Datepicker
          label="requiredMessage"
          showTodayButton={false}
          messages={messages}
          onChanges={onChanges}
          locale={"fi"}
          isRequired
          requiredMessage="Pakollinen"
        />
        <p>Wide given</p>
        <Datepicker
          label="Datepicker"
          value={store.state.value}
          onChanges={onChanges}
          messages={messages}
          locale={"fi"}
          width="30rem"
        />
      </div>
    );
  }));
