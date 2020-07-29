import React from "react";
import { Helmet } from "react-helmet";
import Card from "@material-ui/core/Card";
import { ContentContainer } from "../../modules/elements";
import { Typography } from "@material-ui/core";
import { useIntl } from "react-intl";
import homepage from "../../i18n/definitions/homepage";

const Home = () => {
  const intl = useIntl();
  const { formatMessage } = useIntl();
  return (
    <ContentContainer>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>Oiva | Etusivu</title>
      </Helmet>
      <Typography component="h2" variant="h4" className="p-4">
        {formatMessage(homepage.header)}
      </Typography>
      <Card className="p-4">
        <Typography paragraph={true}>
          {formatMessage(homepage.infotext)}
        </Typography>
      </Card>
    </ContentContainer>
  );
};

export default Home;
