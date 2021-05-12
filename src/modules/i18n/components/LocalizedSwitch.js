import React from "react";
import { Redirect, Switch } from "react-router";
import { useIntl } from "react-intl";
import { has } from "ramda";
import { getLocalizedPath } from "./LocalizedSwitchUtils";
import { PropTypes } from "prop-types";

export const LocalizedSwitch = ({ children }) => {
  const { formatMessage, locale, messages } = useIntl();

  /**
   * Lokalisoidaan kaikki reitit tarkastaen samalla, ovatko kaikki
   * lapsielementit <Route /> -komponentteja, koska vain niiden
   * osalta lokalisointi on olennaista.
   */
  return (
    <Switch>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && messages[child.props.path]) {
          if (
            !has("authenticated", child.props) ||
            child.props.authenticated === true
          ) {
            const _path = getLocalizedPath(
              messages[child.props.path],
              locale,
              formatMessage
            );
            return React.cloneElement(child, {
              ...child.props,
              path: _path
            });
          } else {
            return <Redirect to="/" />;
          }
        } else {
          return child;
        }
      })}
    </Switch>
  );
};

LocalizedSwitch.propTypes = {
  children: PropTypes.array
};
