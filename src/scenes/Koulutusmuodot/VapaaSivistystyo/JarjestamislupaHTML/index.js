import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import vapaaSivistystyo from "i18n/definitions/vapaaSivistystyo";
import { Typography } from "@material-ui/core";
import { parseGenericKujaLupa, parseVSTLupa } from "../utils/lupaParser";
import LupaSection from "./LupaSection";
import moment from "moment";

/**
 * Funktio rakentaa esi- ja perusopetuksen HTML-lupanäkymän.
 * @param {*} lupa - Lupa, jonka tietoja hyödyntäen lupanäkymä muodostetaan.
 */
const JarjestamislupaJSX = ({ lupa }) => {
  const { formatMessage, locale } = useIntl();

  const getTyyppiMessage = lupaData => {
    if (!lupaData) {
      return common.loading;
    }

    const koulutustyyppi = lupaData.koulutustyyppi;
    const vstTyyppi = lupaData.oppilaitostyyppi;

    if (!koulutustyyppi) {
      return common.lupaPageTitleAmmatillinen;
    }

    switch (koulutustyyppi) {
      case "1":
        return common.lupaPageTitleEsiJaPerusopeutus;
      case "2":
        return common.lupaPageTitleLukio;
      case "3":
        switch (vstTyyppi) {
          case "1":
            return common.lupaPageTitleVSTKansanopisto;
          case "2":
            return common.lupaPageTitleVSTKansalaisopisto;
          case "3":
            return common.lupaPageTitleVSTOpintokeskus;
          case "4":
            return common.lupaPageTitleVSTKesayliopisto;
          case "5":
            return common.lupaPageTitleVSTLiikunnanKoulutuskeskus;
          case "6":
            return common.lupaPageTitleVSTMuut;
          default:
            return "undefined";
        }
      default:
        return "undefined";
    }
  };

  const dateString = new moment().format("D.M.YYYY");

  const lupaTitle = formatMessage(getTyyppiMessage(lupa), {
    date: dateString
  });

  const sections = useMemo(() => {
    if (!lupa) {
      return {};
    } else {
      switch (lupa.koulutustyyppi) {
        case "3":
          return parseVSTLupa(lupa, formatMessage, locale);
        default:
          return parseGenericKujaLupa(lupa, locale);
      }
    }
  }, [formatMessage, locale, lupa]);

  return (
    <div>
      <Typography variant="h2" component="h2">
        {lupaTitle}
      </Typography>
      <p className="mb-4">{formatMessage(vapaaSivistystyo.esittelyteksti)}</p>
      <div>
        {sections.map((sectionData, i) => {
          return <LupaSection key={i} kohde={sectionData || {}} />;
        })}
      </div>
    </div>
  );
};

JarjestamislupaJSX.propTypes = {
  lupa: PropTypes.object.isRequired,
  lupakohteet: PropTypes.array
};

export default JarjestamislupaJSX;
