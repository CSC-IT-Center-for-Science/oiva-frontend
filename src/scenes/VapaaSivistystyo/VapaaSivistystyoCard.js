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

const useStyles = makeStyles({
  root: {
    // maxWidth: 345
  }
});

export default function VapaaSivistystyoCard() {
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={intl.formatMessage(educationMessages.vstEducation)}
          height="200"
          image="https://picsum.photos/id/442/600/400/"
          title={intl.formatMessage(educationMessages.vstEducation)}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {intl.formatMessage(educationMessages.vstEducation)}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Maecenas consequat vitae dui a ultrices. Fusce libero enim,
            tincidunt non sapien eget, accumsan auctor lorem. Duis mauris metus,
            iaculis ac magna eu, egestas placerat odio. Curabitur hendrerit
            consequat viverra. Maecenas id sollicitudin risus, non tristique ex.
            Nam sagittis porttitor felis, sit amet auctor libero vehicula
            accumsan. Nam eleifend maximus.
          </Typography>
        </CardContent>
      </CardActionArea>
      {sessionStorage.getItem("role") === ROLE_ESITTELIJA ? (
        <CardActions>
          <Button size="small" color="primary">
            {intl.formatMessage(commonMessages.asianhallinta)}
          </Button>
        </CardActions>
      ) : null}
    </Card>
  );
}
