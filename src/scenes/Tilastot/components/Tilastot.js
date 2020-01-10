import React, { Component } from "react";
import styled from "styled-components";
import { Helmet, Title } from "react-helmet";

import { ContentContainer } from "../../../modules/elements";

const Linkki = styled.div`
  margin-top: 15px;
`;

class Tilastot extends Component {
  render() {
    return (
      <ContentContainer>
        <Helmet height="50px">
          <Title>Oiva | Tilastot</Title>
        </Helmet>
        <h1>Tilastot</h1>
        <p>Linkkejä tilastodataan (beta-versio):</p>
        <Linkki>
          <a
            href="https://app.powerbi.com/view?r=eyJrIjoiN2M1YWZiYzUtOTEyYS00NTY2LTgzNDctNGZjOTVmOWQ4ZTlkIiwidCI6IjkxMDczODlkLTQ0YjgtNDcxNi05ZGEyLWM0ZTNhY2YwMzBkYiIsImMiOjh9"
            target="_blank"
            rel="noopener noreferrer">
            Ammatillisen koulutuksen järjestämisluvat
          </a>
        </Linkki>
        <Linkki>
          <a
            href="https://app.powerbi.com/view?r=eyJrIjoiNWNmNTU0MzgtOTljYS00ZjNlLTljOGQtMWQ0YWZjMGU2MDliIiwidCI6IjkxMDczODlkLTQ0YjgtNDcxNi05ZGEyLWM0ZTNhY2YwMzBkYiIsImMiOjh9"
            target="_blank"
            rel="noopener noreferrer">
            Väestöennuste
          </a>
        </Linkki>
        <Linkki>
          <a
            href="https://app.powerbi.com/view?r=eyJrIjoiN2Q2M2EwMjctMDU5Mi00YjFiLWE5MjItN2ExMDE1YjFlYTQyIiwidCI6IjkxMDczODlkLTQ0YjgtNDcxNi05ZGEyLWM0ZTNhY2YwMzBkYiIsImMiOjh9"
            target="_blank"
            rel="noopener noreferrer">
            Väestö äidinkielen mukaan
          </a>
        </Linkki>
        <Linkki>
          <a
            href="https://app.powerbi.com/view?r=eyJrIjoiMDI5MjMzZTAtZjVkYy00NTZkLTk1NDUtZDAxMDFkNjUwODJlIiwidCI6IjkxMDczODlkLTQ0YjgtNDcxNi05ZGEyLWM0ZTNhY2YwMzBkYiIsImMiOjh9"
            target="_blank"
            rel="noopener noreferrer">
            Koulutus ja pääasiallinen toiminta
          </a>
        </Linkki>
      </ContentContainer>
    );
  }
}

export default Tilastot;
