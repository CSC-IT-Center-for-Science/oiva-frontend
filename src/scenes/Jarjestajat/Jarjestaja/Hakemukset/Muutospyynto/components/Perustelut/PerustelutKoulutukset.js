import React from "react";
import PerustelutValmentavatKoulutukset from "./PerustelutValmentavatKoulutukset";
import PerustelutATVKoulutukset from "./PerustelutATVKoulutukset";
import PerustelutTyovoimakoulutukset from "./PerustelutTyovoimakoulutukset";
import PerustelutKuljettajakoulutukset from "./PerustelutKuljettajakoulutukset";
import PropTypes from "prop-types";
import * as R from "ramda";

const PerustelutKoulutukset = React.memo(props => {
  return (
    <React.Fragment>
      {props.kohde && props.maaraystyyppi && props.muutoshakemus ? (
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
              kohde={props.kohde}
              koulutukset={props.koulutukset}
              maaraystyyppi={props.maaraystyyppi}
              onChangesRemove={props.onChangesRemove}
              onChangesUpdate={props.onChangesUpdate}
              onStateUpdate={props.onStateUpdate}
            />
          ) : null}

          {!R.isEmpty(
            R.path(["koulutukset", "atvKoulutukset"], props.changeObjects)
          ) ? (
            <PerustelutATVKoulutukset
              changeObjects={{
                koulutukset: {
                  atvKoulutukset: props.changeObjects.koulutukset.atvKoulutukset
                },
                perustelut: {
                  koulutukset: {
                    atvKoulutukset:
                      props.changeObjects.perustelut.koulutukset.atvKoulutukset
                  }
                }
              }}
              isReadOnly={props.isReadOnly}
              kohde={props.kohde}
              koulutukset={props.koulutukset}
              maaraystyyppi={props.maaraystyyppi}
              onChangesRemove={props.onChangesRemove}
              onChangesUpdate={props.onChangesUpdate}
              onStateUpdate={props.onStateUpdate}
            />
          ) : null}

          {!!R.path(
            ["koulutukset", "tyovoimakoulutukset"],
            props.changeObjects
          ) ? (
            <PerustelutTyovoimakoulutukset
              changeObjects={{
                koulutukset: {
                  tyovoimakoulutukset:
                    props.changeObjects.koulutukset.tyovoimakoulutukset
                },
                perustelut: {
                  koulutukset: {
                    tyovoimakoulutukset:
                      props.changeObjects.perustelut.koulutukset
                        .tyovoimakoulutukset
                  }
                }
              }}
              elykeskukset={props.elykeskukset}
              isReadOnly={props.isReadOnly}
              kohde={props.kohde}
              koulutukset={props.koulutukset}
              maaraystyyppi={props.maaraystyyppi}
              onChangesRemove={props.onChangesRemove}
              onChangesUpdate={props.onChangesUpdate}
              onStateUpdate={props.onStateUpdate}
            />
          ) : null}

          {!!R.path(
            ["koulutukset", "kuljettajakoulutukset"],
            props.changeObjects
          ) ? (
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
              kohde={props.kohde}
              koulutukset={props.koulutukset}
              lomakkeet={props.lomakkeet}
              maaraystyyppi={props.maaraystyyppi}
              onChangesRemove={props.onChangesRemove}
              onChangesUpdate={props.onChangesUpdate}
              onStateUpdate={props.onStateUpdate}
            />
          ) : null}
        </div>
      ) : null}
    </React.Fragment>
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
  kohde: PropTypes.object,
  koulutukset: PropTypes.object,
  maaraystyyppi: PropTypes.object,
  muutoshakemus: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func
};

export default PerustelutKoulutukset;
