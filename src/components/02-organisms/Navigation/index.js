import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar, makeStyles } from "@material-ui/core";
import HorizontalLayout from "./HorizontalLayout";
import VerticalLayout from "./VerticalLayout";
import { NavLink } from "react-router-dom";
import * as R from "ramda";
import "../../../css/tailwind.css";

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: "none"
  }
}));

const Navigation = ({
  direction = "horizontal",
  links,
  theme = {
    backgroundColor: "vihrea",
    color: "white",
    hoverColor: "green-600"
  }
}) => {
  const classes = useStyles(theme);

  const items = R.addIndex(R.map)((link, index) => {
    const className = `px-4 font-medium uppercase
      py-2 flex-1 tracking-wider min-w-200 lg:max-w-xxs sm:min-w-initial mx-4
      hover:bg-${theme.hoverColor} hover:text-${theme.color} visited:text-${theme.color} text-${theme.color} text-center flex-wrap whitespace-no-wrap`;

    return link.url ? (
      <a href={link.url} key={`link-${index}`} className={className}>
        {link.text}
      </a>
    ) : (
      <NavLink
        key={`link-${index}`}
        exact={link.isExact}
        activeClassName={`font-bold md:bg-${theme.hoverColor} md:font-normal ml-xxs`}
        to={link.path}
        className={className}>
        {link.text}
      </NavLink>
    );
  }, links);

  return (
    <React.Fragment>
      {(!direction || direction === "horizontal") && (
        <AppBar position="static" classes={classes}>
          <nav className="border border-gray-300">
            <Toolbar
              variant="dense"
              className={`flex flex-wrap text-black text-sm overflow-auto hide-scrollbar bg-${theme.backgroundColor}`}
              disableGutters={true}>
              <HorizontalLayout items={items}></HorizontalLayout>
            </Toolbar>
          </nav>
        </AppBar>
      )}
      {direction === "vertical" && (
        <VerticalLayout items={items}></VerticalLayout>
      )}
    </React.Fragment>
  );
};

Navigation.propTypes = {
  links: PropTypes.array,
  direction: PropTypes.string,
  theme: PropTypes.object
};

export default Navigation;
