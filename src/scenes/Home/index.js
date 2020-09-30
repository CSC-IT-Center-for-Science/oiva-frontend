import React from "react";
import { Helmet } from "react-helmet";
import { Typography } from "@material-ui/core";
import { useIntl } from "react-intl";
import common from "../../i18n/definitions/common";
import homepage from "../../i18n/definitions/homepage";
import AmmatillinenkoulutusCard from "scenes/AmmatillinenKoulutus/AmmatillinenkoulutusCard";
import LukiokoulutusCard from "scenes/Lukiokoulutus/LukiokoulutusCard";
import EsiJaPerusopetusCard from "scenes/EsiJaPerusopetus/EsiJaPerusopetusCard";
import TilastotCard from "scenes/Tilastot/TilastotCard";
import VapaaSivistystyoCard from "scenes/VapaaSivistystyo/VapaaSivistystyoCard";

const Home = () => {
  const { formatMessage, locale } = useIntl();
  return (
    <article className="px-8 py-16 md:px-12 lg:px-32 xxl:px-0 xxl:max-w-8xl mx-auto">
      <Helmet htmlAttributes={{ lang: locale }}>
        <title>Oiva - {formatMessage(common.frontpage)}</title>
      </Helmet>
      <Typography component="h1" variant="h1" className="py-4">
        {formatMessage(homepage.header)}
      </Typography>
      <Typography paragraph={true}>
        {formatMessage(homepage.infotext)}
      </Typography>
      <section>
        <Typography component="h2" variant="h2" className="py-4">
          Koulutus
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-auto">
          <EsiJaPerusopetusCard></EsiJaPerusopetusCard>
          <AmmatillinenkoulutusCard></AmmatillinenkoulutusCard>
          <LukiokoulutusCard></LukiokoulutusCard>
          <VapaaSivistystyoCard></VapaaSivistystyoCard>
        </div>
      </section>
      <section className="pt-12">
        <Typography component="h2" variant="h2" className="py-4">
          {formatMessage(common.statistics)}
        </Typography>
        <TilastotCard></TilastotCard>
      </section>
    </article>
  );
};

export default Home;
