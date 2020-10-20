import React from "react";
import { storiesOf } from "@storybook/react";
import Navigation from ".";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import "../../../css/tailwind.css";

storiesOf("Navigation", module).add("Basic layout", () => {
  const links = [
    {
      path: "/esi-ja-perusopetus",
      text: "Esi- ja perusopetus",
      isExact: false
    },
    { path: "/lukiokoulutus", text: "Lukiokoulutus" },
    { path: "/jarjestajat", text: "Ammatillinen koulutus" },
    { path: "/vapaa-sivistystyo", text: "Vapaa sivistystyö" },
    { path: "/tilastot", text: "Tilastot" },
    { url: "http://github.com", text: "External to Github" }
  ];
  return (
    <Router history={createBrowserHistory()}>
      <Navigation links={links}></Navigation>
    </Router>
  );
});
