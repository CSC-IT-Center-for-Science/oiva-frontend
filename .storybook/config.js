import { addDecorator, configure } from "@storybook/react";
import { setIntlConfig, withIntl } from "storybook-addon-intl";
import { addLocaleData } from "react-intl";
import fiLocaleData from "react-intl/locale-data/fi";
import svLocaleData from "react-intl/locale-data/sv";

import "../src/css/tailwind.css";

addLocaleData(fiLocaleData);
addLocaleData(svLocaleData);

// Provide your messages
const messages = {
  fi: require("../src/i18n/locales/fi"),
  sv: require("../src/i18n/locales/sv")
};

const getMessages = locale => messages[locale];

// Set intl configuration
setIntlConfig({
  locales: ['fi', 'sv'],
  defaultLocale: 'fi',
  getMessages
});

// Register decorator
addDecorator(withIntl);

const req = require.context("../src/", true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
