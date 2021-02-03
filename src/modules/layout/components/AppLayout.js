import React from "react";
import Navigation from "components/02-organisms/Navigation";
import Header from "components/02-organisms/Header/index";

export const AppLayout = ({ localesByLang, children }) => {
  return (
    <React.Fragment>
      <Header>
        <Navigation localesByLang={localesByLang} />
      </Header>
      <main>{children}</main>
    </React.Fragment>
  );
};
