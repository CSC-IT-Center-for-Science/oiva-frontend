import React from "react";
import { makeStyles } from "@material-ui/core/styles";
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

const useStyles = makeStyles({
  root: {
    // maxWidth: 345
  }
});

export default function AmmatillinenkoulutusCard() {
  const classes = useStyles();
  const intl = useIntl();
  const history = useHistory();

  return (
    <Card className={classes.root}>
      <CardActionArea
        onClick={() => {
          history.push("/ammatillinenkoulutus");
        }}>
        <CardMedia
          component="img"
          alt={intl.formatMessage(educationMessages.vocationalEducation)}
          height="200"
          image="https://picsum.photos/id/1/600/400/"
          title={intl.formatMessage(educationMessages.vocationalEducation)}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {intl.formatMessage(educationMessages.vocationalEducation)}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
            imperdiet ex ac justo ornare, et feugiat magna semper. Vestibulum
            non volutpat odio, et tincidunt metus. Proin sit amet risus ac risus
            ultricies tempus. Sed porta aliquam ante, sed dictum lectus.
          </Typography>
        </CardContent>
      </CardActionArea>
      {sessionStorage.getItem("role") === ROLE_ESITTELIJA ? (
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              history.push("/ammatillinenkoulutus/asianhallinta/avoimet");
            }}>
            {intl.formatMessage(commonMessages.asianhallinta)}
          </Button>
        </CardActions>
      ) : null}
    </Card>
  );
}
