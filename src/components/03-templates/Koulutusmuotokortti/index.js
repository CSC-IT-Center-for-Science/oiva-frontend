import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import { ROLE_ESITTELIJA } from "modules/constants";
import { useHistory } from "react-router-dom";

export default function Koulutusmuotokortti({ koulutusmuoto }) {
  const history = useHistory();
  const intl = useIntl();

  return (
    <Card>
      <CardActionArea
        onClick={() => {
          history.push(`/${koulutusmuoto.kebabCase}`);
        }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {koulutusmuoto.sivunOtsikko}
          </Typography>
          <Typography gutterBottom component="p">
            {koulutusmuoto.kuvausteksti}
          </Typography>
        </CardContent>
      </CardActionArea>
      {sessionStorage.getItem("role") === ROLE_ESITTELIJA ? (
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              history.push(`/${koulutusmuoto.kebabCase}/asianhallinta/avoimet`);
            }}>
            {intl.formatMessage(common.asianhallinta)}
          </Button>
        </CardActions>
      ) : null}
    </Card>
  );
}
