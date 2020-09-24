import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
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
        <CardMedia
          component="img"
          alt={intl.formatMessage(commonMessages.statistics)}
          height="200"
          image="https://picsum.photos/id/1073/1200/400/"
          title={intl.formatMessage(commonMessages.statistics)}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {intl.formatMessage(commonMessages.statistics)}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Sed eget suscipit tortor, sit amet lacinia ex. Donec sed arcu vel
            odio gravida commodo. Pellentesque sit amet lacus aliquet lectus
            rhoncus congue eu quis neque. Pellentesque ac ligula ex. Sed sit
            amet erat scelerisque, aliquet lectus sed, euismod felis. Nullam
            lobortis turpis eu ipsum iaculis aliquet. Phasellus quis convallis
            nulla. Pellentesque.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
