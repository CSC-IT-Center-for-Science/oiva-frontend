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
import { localizeRouteKey } from "utils/common";
import { AppRoute } from "const";
import { PropTypes } from "prop-types";

export default function Koulutusmuotokortti({ koulutusmuoto }) {
  const history = useHistory();
  const { formatMessage, locale } = useIntl();

  return (
    <Card>
      <CardActionArea
        onClick={() => {
          history.push(
            localizeRouteKey(
              locale,
              AppRoute.KoulutusmuodonEtusivu,
              formatMessage,
              { koulutusmuoto: koulutusmuoto.kebabCase }
            )
          );
        }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {koulutusmuoto.kortinOtsikko}
          </Typography>
          <Typography gutterBottom component="p">
            {koulutusmuoto.lyhytKuvaus}
          </Typography>
        </CardContent>
      </CardActionArea>
      {sessionStorage.getItem("role") === ROLE_ESITTELIJA ? (
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              history.push(
                localizeRouteKey(
                  locale,
                  AppRoute.AsianhallintaAvoimet,
                  formatMessage,
                  {
                    koulutusmuoto: koulutusmuoto.kebabCase
                  }
                )
              );
            }}>
            {formatMessage(common.asianhallinta)}
          </Button>
        </CardActions>
      ) : null}
    </Card>
  );
}

Koulutusmuotokortti.propTypes = {
  koulutusmuoto: PropTypes.object
};
