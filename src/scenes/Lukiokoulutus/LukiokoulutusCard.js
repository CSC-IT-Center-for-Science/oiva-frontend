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

export default function LukiokoulutusCard() {
  const history = useHistory();
  const intl = useIntl();

  return (
    <Card>
      <CardActionArea
        onClick={() => {
          history.push("/lukiokoulutus");
        }}>
        <CardMedia
          component="img"
          alt={intl.formatMessage(educationMessages.highSchoolEducation)}
          height="200"
          image="https://picsum.photos/id/1040/600/400/"
          title={intl.formatMessage(educationMessages.highSchoolEducation)}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {intl.formatMessage(educationMessages.highSchoolEducation)}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Praesent tristique sem a ex rhoncus, id porttitor felis commodo.
            Integer tristique ligula id risus eleifend, nec pellentesque lorem
            vulputate. Sed auctor felis eu imperdiet sagittis.
          </Typography>
        </CardContent>
      </CardActionArea>
      {sessionStorage.getItem("role") === ROLE_ESITTELIJA ? (
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              history.push("/lukiokoulutus/asianhallinta/avoimet");
            }}>
            {intl.formatMessage(commonMessages.asianhallinta)}
          </Button>
        </CardActions>
      ) : null}
    </Card>
  );
}
