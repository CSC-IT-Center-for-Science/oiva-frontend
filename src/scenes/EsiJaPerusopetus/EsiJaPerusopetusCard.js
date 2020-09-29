import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useIntl } from "react-intl";
import commonMessages from "../../i18n/definitions/common";
import educationMessages from "../../i18n/definitions/education";
import { ROLE_ESITTELIJA } from "modules/constants";
import { useHistory } from "react-router-dom";

export default function EsiJaPerusopetusCard() {
  const history = useHistory();
  const intl = useIntl();

  return (
    <Card>
      <CardActionArea
        onClick={() => {
          history.push("/esi-ja-perusopetus");
        }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {intl.formatMessage(educationMessages.preAndBasicEducation)}
          </Typography>
        </CardContent>
      </CardActionArea>
      {sessionStorage.getItem("role") === ROLE_ESITTELIJA ? (
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              history.push("/esi-ja-perusopetus/asianhallinta/avoimet");
            }}>
            {intl.formatMessage(commonMessages.asianhallinta)}
          </Button>
        </CardActions>
      ) : null}
    </Card>
  );
}
