import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import common from "../../../i18n/definitions/common";

import { ContentContainer } from "../../../modules/elements";
import { useIntl } from "react-intl";

const Linkki = styled.div`
  margin-top: 15px;
`;

const Tilastot = () => {
  const intl = useIntl();

  const links =
    intl.locale === "fi"
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

  const pageTitle = intl.formatMessage(common.statistics);

  const title = `${pageTitle} - Oiva`;

  return (
    <ContentContainer>
      <Helmet height="50px" title={title}></Helmet>
      <h1>{pageTitle}</h1>
      <p>{intl.formatMessage(common.tilastosivunOhje)}</p>
      <Linkki>
        <a
          className="underline"
          href={links[0]}
          target="_blank"
          rel="noopener noreferrer">
          {intl.formatMessage(common.ammatillisenKoulutuksenJarjestamisluvat)}
        </a>
      </Linkki>
      <Linkki>
        <a
          className="underline"
          href={links[1]}
          target="_blank"
          rel="noopener noreferrer">
          {intl.formatMessage(common.vaestoennuste)}
        </a>
      </Linkki>
      <Linkki>
        <a
          className="underline"
          href={links[2]}
          target="_blank"
          rel="noopener noreferrer">
          {intl.formatMessage(common.vaestoAidinkielenMukaan)}
        </a>
      </Linkki>
      <Linkki>
        <a
          className="underline"
          href={links[3]}
          target="_blank"
          rel="noopener noreferrer">
          {intl.formatMessage(common.koulutusJaPaaasiallinenToiminta)}
        </a>
      </Linkki>
    </ContentContainer>
  );
};

export default Tilastot;
