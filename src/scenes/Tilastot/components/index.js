import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import common from "../../../i18n/definitions/common";
import { useIntl } from "react-intl";
import SivupohjaA from "components/03-templates/SivupohjaA";
import { Typography } from "@material-ui/core";
import { localizeRouteKey } from "utils/common";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { AppRoute } from "const/index";

const Linkki = styled.div`
  margin-top: 15px;
`;

const Tilastot = () => {
  const { formatMessage, locale } = useIntl();

  const links =
    locale === "fi"
      ? [
          "https://app.powerbi.com/view?r=eyJrIjoiOTJmNzE2YjctNDYzNS00NjkyLTlkZTMtMTI2ZGUwNmFhNGJjIiwidCI6IjkxMDczODlkLTQ0YjgtNDcxNi05ZGEyLWM0ZTNhY2YwMzBkYiIsImMiOjh9",
          "https://app.powerbi.com/view?r=eyJrIjoiNWNmNTU0MzgtOTljYS00ZjNlLTljOGQtMWQ0YWZjMGU2MDliIiwidCI6IjkxMDczODlkLTQ0YjgtNDcxNi05ZGEyLWM0ZTNhY2YwMzBkYiIsImMiOjh9",
          "https://app.powerbi.com/view?r=eyJrIjoiN2Q2M2EwMjctMDU5Mi00YjFiLWE5MjItN2ExMDE1YjFlYTQyIiwidCI6IjkxMDczODlkLTQ0YjgtNDcxNi05ZGEyLWM0ZTNhY2YwMzBkYiIsImMiOjh9",
          "https://app.powerbi.com/view?r=eyJrIjoiMDI5MjMzZTAtZjVkYy00NTZkLTk1NDUtZDAxMDFkNjUwODJlIiwidCI6IjkxMDczODlkLTQ0YjgtNDcxNi05ZGEyLWM0ZTNhY2YwMzBkYiIsImMiOjh9"
        ]
      : [
          "https://app.powerbi.com/view?r=eyJrIjoiZWM3MjYyNjMtOGFmNS00ZDY2LTgzOTUtMjJhZmU1NjJmZmMxIiwidCI6IjkxMDczODlkLTQ0YjgtNDcxNi05ZGEyLWM0ZTNhY2YwMzBkYiIsImMiOjh9",
          "https://app.powerbi.com/view?r=eyJrIjoiNWUyY2YxMjktMzI3NS00NDU0LTkwOWEtZjgwYTBiYjI1NmY4IiwidCI6IjkxMDczODlkLTQ0YjgtNDcxNi05ZGEyLWM0ZTNhY2YwMzBkYiIsImMiOjh9",
          "https://app.powerbi.com/view?r=eyJrIjoiY2VkMjI0MjAtOWZlZS00ODA0LTkxYzQtOGQyNDg0MzdmMTFlIiwidCI6IjkxMDczODlkLTQ0YjgtNDcxNi05ZGEyLWM0ZTNhY2YwMzBkYiIsImMiOjh9",
          "https://app.powerbi.com/view?r=eyJrIjoiMTI2NzU5NDYtMmUyNy00NDNiLTlmZjEtNTNmNjVhY2U4Y2MwIiwidCI6IjkxMDczODlkLTQ0YjgtNDcxNi05ZGEyLWM0ZTNhY2YwMzBkYiIsImMiOjh9"
        ];

  const pageTitle = formatMessage(common.statistics);

  const title = `${pageTitle} - Oiva`;

  return (
    <SivupohjaA>
      <Helmet height="50px" title={title}></Helmet>
      <BreadcrumbsItem
        to={localizeRouteKey(locale, AppRoute.Tilastot, formatMessage)}>
        {formatMessage(common.statistics)}
      </BreadcrumbsItem>
      <Typography component="h1" variant="h1">
        {pageTitle}
      </Typography>
      <p className="mb-6">{formatMessage(common.tilastosivunOhje)}</p>
      <Linkki>
        <a
          className="underline"
          href={links[0]}
          target="_blank"
          rel="noopener noreferrer">
          {formatMessage(common.ammatillisenKoulutuksenJarjestamisluvat)}
        </a>
      </Linkki>
      <Linkki>
        <a
          className="underline"
          href={links[1]}
          target="_blank"
          rel="noopener noreferrer">
          {formatMessage(common.vaestoennuste)}
        </a>
      </Linkki>
      <Linkki>
        <a
          className="underline"
          href={links[2]}
          target="_blank"
          rel="noopener noreferrer">
          {formatMessage(common.vaestoAidinkielenMukaan)}
        </a>
      </Linkki>
      <Linkki>
        <a
          className="underline"
          href={links[3]}
          target="_blank"
          rel="noopener noreferrer">
          {formatMessage(common.koulutusJaPaaasiallinenToiminta)}
        </a>
      </Linkki>
    </SivupohjaA>
  );
};

export default Tilastot;
