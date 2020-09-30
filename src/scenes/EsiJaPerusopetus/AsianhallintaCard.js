import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { useIntl } from "react-intl";
import commonMessages from "../../i18n/definitions/common";
import { useHistory } from "react-router-dom";

export default function AsianhallintaCard() {
  const intl = useIntl();
  const history = useHistory();

  return (
    <Card>
      <CardActionArea
        onClick={() => {
          history.push("/esi-ja-perusopetus/asianhallinta/avoimet");
        }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {intl.formatMessage(commonMessages.asianhallinta)}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Olet sisäänkirjautunut esittelijänä. Näin ollen pääset hallinnoimaan
            eri koulutuksen järjestäjien asioita.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
