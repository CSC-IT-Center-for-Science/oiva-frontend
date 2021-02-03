import React from "react";
import { FormattedMessage } from "react-intl";

export const Home = () => (
  <section>
    <h1>
      <FormattedMessage id="home.title" />
    </h1>
    <div>
      <FormattedMessage id="home.content" />
    </div>
  </section>
);
