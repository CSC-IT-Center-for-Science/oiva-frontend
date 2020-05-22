import React from "react";
import PerustelutValmentavatKoulutukset from "./PerustelutValmentavatKoulutukset";
import PerustelutATVKoulutukset from "./PerustelutATVKoulutukset";
import PerustelutTyovoimakoulutukset from "./PerustelutTyovoimakoulutukset";
import PerustelutKuljettajakoulutukset from "./PerustelutKuljettajakoulutukset";
import PropTypes from "prop-types";
import * as R from "ramda";

const PerustelutKoulutukset = React.memo(props => {
  return (
    <div className="py-4">
      {!!R.path(
        ["koulutukset", "valmentavatKoulutukset"],
        props.changeObjects
      ) ? (
        <PerustelutValmentavatKoulutukset
          changeObjects={{
            koulutukset: {
              valmentavatKoulutukset: R.path([
                "koulutukset",
                "valmentavatKoulutukset"
              ])(props.changeObjects)
            },
            perustelut: {
              koulutukset: {
                valmentavatKoulutukset: R.path([
                  "perustelut",
                  "koulutukset",
                  "valmentavatKoulutukset"
                ])(props.changeObjects)
              }
            }
          }}
          isReadOnly={props.isReadOnly}
          koulutukset={props.koulutukset}
          onChangesRemove={props.onChangesRemove}
          onChangesUpdate={props.onChangesUpdate}
        />
      ) : null}

      {!R.isNil(props.changeObjects.koulutukset.atvKoulutukset) &&
      !R.isEmpty(props.changeObjects.koulutukset.atvKoulutukset) ? (
        <PerustelutATVKoulutukset
          changeObjects={{
            koulutukset: {
              atvKoulutukset: R.path(
                ["koulutukset", "atvKoulutukset"],
                props.changeObjects
              )
            },
            perustelut: {
              koulutukset: {
                atvKoulutukset: R.path(
                  ["perustelut", "koulutukset", "atvKoulutukset"],
                  props.changeObjects
                )
              }
            }
          }}
          isReadOnly={props.isReadOnly}
          koulutukset={props.koulutukset}
          onChangesRemove={props.onChangesRemove}
          onChangesUpdate={props.onChangesUpdate}
        />
      ) : null}

      {!!R.path(["koulutukset", "tyovoimakoulutukset"], props.changeObjects) ? (
        <PerustelutTyovoimakoulutukset
          changeObjects={{
            koulutukset: {
              tyovoimakoulutukset:
                props.changeObjects.koulutukset.tyovoimakoulutukset
            },
            perustelut: {
              koulutukset: {
                tyovoimakoulutukset: R.path(
                  ["perustelut", "koulutukset", "tyovoimakoulutukset"],
                  props.changeObjects
                )
              }
            }
          }}
          elykeskukset={props.elykeskukset}
          isReadOnly={props.isReadOnly}
          koulutukset={props.koulutukset}
          onChangesRemove={props.onChangesRemove}
          onChangesUpdate={props.onChangesUpdate}
        />
      ) : null}

      {!R.isNil(props.changeObjects.koulutukset.kuljettajakoulutukset) &&
      !R.isEmpty(props.changeObjects.koulutukset.kuljettajakoulutukset) ? (
        <PerustelutKuljettajakoulutukset
          changeObjects={{
            koulutukset: {
              kuljettajakoulutukset: R.path([
                "koulutukset",
                "kuljettajakoulutukset"
              ])(props.changeObjects)
            },
            perustelut: R.path([
              "perustelut",
              "koulutukset",
              "kuljettajakoulutukset"
            ])(props.changeObjects)
          }}
          isReadOnly={props.isReadOnly}
          koulutukset={props.koulutukset}
          onChangesRemove={props.onChangesRemove}
          onChangesUpdate={props.onChangesUpdate}
        />
      ) : null}
    </div>
  );
});

PerustelutKoulutukset.defaultProps = {
  changeObjects: {},
  isReadOnly: false
};

PerustelutKoulutukset.propTypes = {
  changeObjects: PropTypes.object,
  elykeskukset: PropTypes.array,
  isReadOnly: PropTypes.bool,
  koulutukset: PropTypes.object,
  muutoshakemus: PropTypes.object,
  onChangesUpdate: PropTypes.func
};

export default PerustelutKoulutukset;
