import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { useIntl } from "react-intl";
import commonMessages from "../../i18n/definitions/common";
import { useHistory } from "react-router-dom";

export default function TilastotCard() {
  const intl = useIntl();
  const history = useHistory();

  return (
    <Card>
      <CardActionArea
        onClick={() => {
          history.push("/tilastot");
        }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {intl.formatMessage(commonMessages.statistics)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
