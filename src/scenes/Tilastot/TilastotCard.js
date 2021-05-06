import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { useIntl } from "react-intl";
import commonMessages from "../../i18n/definitions/common";
import { useHistory } from "react-router-dom";
import { localizeRouteKey } from "utils/common";
import { AppRoute } from "const";

export default function TilastotCard() {
  const { formatMessage, locale } = useIntl();
  const history = useHistory();

  return (
    <Card>
      <CardActionArea
        onClick={() => {
          history.push(
            localizeRouteKey(locale, AppRoute.Tilastot, formatMessage)
          );
        }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {formatMessage(commonMessages.statistics)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
