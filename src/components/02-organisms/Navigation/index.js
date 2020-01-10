import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar, makeStyles } from "@material-ui/core";
import TemplateB from "../../03-templates/TemplateB";
import TemplateD from "../../03-templates/TemplateD";
import { NavLink } from "react-router-dom";
import * as R from "ramda";

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: "none"
  }
}));

const Navigation = ({
  direction = "horizontal",
  links,
  theme = {
    backgroundColor: "green-500",
    color: "white",
    hoverColor: "green-400"
  }
}) => {
  const classes = useStyles(theme);

  const items = R.addIndex(R.map)((link, index) => {
    return (
      <NavLink
        key={`link-${index}`}
        exact={link.isExact}
        activeClassName={`font-bold md:bg-green-800 md:font-normal`}
        to={link.path}
        className={`px-8 ${
          direction !== "vertical" ? "border-r border-green-600" : ""
        } py-4 flex-1 tracking-wider min-w-200 lg:max-w-xxs sm:min-w-initial
         hover:bg-${theme.hoverColor} text-${
          theme.color
        } text-center flex-wrap whitespace-no-wrap`}>
        {link.text}
      </NavLink>
    );
  }, links);

  return (
    <React.Fragment>
      {(!direction || direction === "horizontal") && (
        <AppBar position="static" classes={classes}>
          <Toolbar
            variant="dense"
            className={`flex flex-wrap text-black border 
        border-gray-300 text-sm overflow-auto hide-scrollbar bg-${theme.backgroundColor}`}
            disableGutters={true}>
            <TemplateB items={items}></TemplateB>
          </Toolbar>
        </AppBar>
      )}
      {direction === "vertical" && <TemplateD items={items}></TemplateD>}
    </React.Fragment>
  );
};

Navigation.propTypes = {
  links: PropTypes.array,
  direction: PropTypes.string,
  theme: PropTypes.object
};

export default Navigation;
