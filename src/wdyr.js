import React from "react";

if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender");
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: false
  });
}
