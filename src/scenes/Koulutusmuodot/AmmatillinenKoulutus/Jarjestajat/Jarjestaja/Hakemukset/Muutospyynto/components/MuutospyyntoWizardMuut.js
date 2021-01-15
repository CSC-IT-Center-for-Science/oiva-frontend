import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import {
  filter,
  groupBy,
  omit,
  path,
  pipe,
  propEq,
  reduce,
  toUpper
} from "ramda";
import Laajennettu from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Esittelijat/Lupanakyma/Osiot/Muut/01-Laajennettu";
import VaativaTuki from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Esittelijat/Lupanakyma/Osiot/Muut/02-VaativaTuki";
import Sisaoppilaitos from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Esittelijat/Lupanakyma/Osiot/Muut/03-Sisaoppilaitos";
import Vankila from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Esittelijat/Lupanakyma/Osiot/Muut/04-Vankila";
import Urheilu from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Esittelijat/Lupanakyma/Osiot/Muut/05-Urheilu";
import Yhteistyo from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Esittelijat/Lupanakyma/Osiot/Muut/06-Yhteistyo";
import Yhteistyosopimus from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Esittelijat/Lupanakyma/Osiot/Muut/08-Yhteistyosopimus";
import Selvitykset from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Esittelijat/Lupanakyma/Osiot/Muut/09-Selvitykset";
import MuuMaarays from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Esittelijat/Lupanakyma/Osiot/Muut/07-MuuMaarays";
import { Typography } from "@material-ui/core";

const defaultProps = {
  maaraykset: [],
  muut: []
};

const MuutospyyntoWizardMuut = React.memo(
  ({
    code,
    maaraykset = defaultProps.maaraykset,
    muut = defaultProps.muut,
    sectionId,
    title
  }) => {
    const intl = useIntl();
    const localeUpper = toUpper(intl.locale);

    const maarayksetByKoodiarvo = useMemo(
      () =>
        pipe(
          filter(
            propEq("koodisto", "oivamuutoikeudetvelvollisuudetehdotjatehtavat")
          ),
          reduce((maaraysByKoodiarvo, maarays) => {
            maaraysByKoodiarvo[maarays.koodiarvo] = maarays;
            return maaraysByKoodiarvo;
          }, {})
        )(maaraykset),
      [maaraykset]
    );

    const items = useMemo(() => {
      const group = omit(
        [undefined],
        groupBy(item => {
          const kasite = path(["metadata", localeUpper, "kasite"], item);
          if (item.koodiarvo === "9") {
            return "selvitykset";
          } else {
            return kasite;
          }
        }, muut)
      );
      return group;
    }, [localeUpper, muut]);

    const vaativaTukiItems = useMemo(
      () => ({
        vaativa_1: items.vaativa_1,
        vaativa_2: items.vaativa_2
      }),
      [items]
    );

    return (
      <React.Fragment>
        <Typography component="h2" variant="h2">
          {code ? `${code}. ` : ""}
          {title}
        </Typography>
        {!!items.laajennettu && items.laajennettu.length > 0 ? (
          <Laajennettu
            items={items.laajennettu}
            localeUpper={localeUpper}
            maarayksetByKoodiarvo={maarayksetByKoodiarvo}
            sectionId={`${sectionId}_01`}
          ></Laajennettu>
        ) : null}

        {(!!items.vaativa_1 && items.vaativa_1.length > 0) ||
        (!!items.vaativa_2 && items.vaativa_2.length > 0) ? (
          <VaativaTuki
            items={vaativaTukiItems}
            localeUpper={localeUpper}
            maarayksetByKoodiarvo={maarayksetByKoodiarvo}
            sectionId={`${sectionId}_02`}
          ></VaativaTuki>
        ) : null}

        {!!items.sisaoppilaitos && items.sisaoppilaitos.length > 0 ? (
          <Sisaoppilaitos
            items={items.sisaoppilaitos}
            localeUpper={localeUpper}
            maarayksetByKoodiarvo={maarayksetByKoodiarvo}
            sectionId={`${sectionId}_03`}
          ></Sisaoppilaitos>
        ) : null}

        {!!items.vankila && items.vankila.length > 0 ? (
          <Vankila
            items={items.vankila}
            localeUpper={localeUpper}
            maarayksetByKoodiarvo={maarayksetByKoodiarvo}
            sectionId={`${sectionId}_04`}
          ></Vankila>
        ) : null}

        {!!items.urheilu && items.urheilu.length > 0 ? (
          <Urheilu
            items={items.urheilu}
            localeUpper={localeUpper}
            maarayksetByKoodiarvo={maarayksetByKoodiarvo}
            sectionId={`${sectionId}_05`}
          ></Urheilu>
        ) : null}

        {!!items.yhteistyo && items.yhteistyo.length > 0 ? (
          <Yhteistyo
            items={items.yhteistyo}
            localeUpper={localeUpper}
            maarayksetByKoodiarvo={maarayksetByKoodiarvo}
            sectionId={`${sectionId}_06`}
          ></Yhteistyo>
        ) : null}

        {!!items.yhteistyosopimus && items.yhteistyosopimus.length > 0 ? (
          <Yhteistyosopimus
            items={items.yhteistyosopimus}
            localeUpper={localeUpper}
            maarayksetByKoodiarvo={maarayksetByKoodiarvo}
            sectionId={`${sectionId}_08`}
          ></Yhteistyosopimus>
        ) : null}

        {!!items.selvitykset && items.selvitykset.length > 0 ? (
          <Selvitykset
            items={items.selvitykset}
            localeUpper={localeUpper}
            maarayksetByKoodiarvo={maarayksetByKoodiarvo}
            sectionId={`${sectionId}_09`}
          ></Selvitykset>
        ) : null}

        {!!items.muumaarays && items.muumaarays.length > 0 ? (
          <MuuMaarays
            items={items.muumaarays}
            localeUpper={localeUpper}
            maarayksetByKoodiarvo={maarayksetByKoodiarvo}
            sectionId={`${sectionId}_07`}
          ></MuuMaarays>
        ) : null}
      </React.Fragment>
    );
  }
);

MuutospyyntoWizardMuut.propTypes = {
  headingNumber: PropTypes.number,
  maaraykset: PropTypes.array,
  muut: PropTypes.array
};

export default MuutospyyntoWizardMuut;
