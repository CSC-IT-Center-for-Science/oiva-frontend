import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
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
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="200"
          image="https://picsum.photos/id/403/600/400/"
          title={intl.formatMessage(educationMessages.preAndBasicEducation)}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {intl.formatMessage(educationMessages.preAndBasicEducation)}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Vestibulum rhoncus orci lacus, vitae faucibus enim pulvinar quis.
            Pellentesque velit ligula, porttitor in luctus sed, facilisis vel
            elit. Suspendisse pulvinar condimentum nibh non elementum. Ut
            hendrerit purus risus, ac viverra metus venenatis id.
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
