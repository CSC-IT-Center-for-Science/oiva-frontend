import React from "react";

if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender");
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: false
    // notifier: ({
    //   Component,
    //   displayName,
    //   prevProps,
    //   prevState,
    //   nextProps,
    //   nextState,
    //   reason,
    //   options
    // }) => {
    //   console.group();
    //   console.info("Component", Component);
    //   console.info("displayName", displayName);
    //   console.info("prevProps", prevProps);
    //   console.info("nextProps", nextProps);
    //   console.info("prevState", prevState);
    //   console.info("nextState", nextState);
    //   console.info("reason", reason);
    //   console.info("options", options);
    //   console.groupEnd();
    // }
  });
}
