import React from "react";
import { FormattedMessage } from "react-intl";

export const GeneralError = () => (
  <section>
    <h1>
      <FormattedMessage id="common.errorFetchingRow" />
    </h1>
    <div>
      <FormattedMessage id="common.ok" />
    </div>
  </section>
);
