import { addDecorator, configure } from "@storybook/react";
import { setIntlConfig, withIntl } from "storybook-addon-intl";

import "../src/css/tailwind.css";

if (!Intl.PluralRules) {
  require("@formatjs/intl-pluralrules/polyfill");
  require("@formatjs/intl-pluralrules/dist/locale-data/fi"); // Add locale data for fi
}

if (!Intl.RelativeTimeFormat) {
  require("@formatjs/intl-relativetimeformat/polyfill");
  require("@formatjs/intl-relativetimeformat/dist/locale-data/sv"); // Add locale data for sv
}

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
