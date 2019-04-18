import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";

import LuvatList from "./LuvatList";
import { ContentContainer } from "modules/elements";
import Loading from "modules/Loading";

class Jarjestajat extends Component {
  componentWillMount() {
    this.props.fetchLuvat();
  }

  render() {
    const { fetched, isFetching, hasErrored, data } = this.props.luvat;

    if (fetched) {
      return (
        <ContentContainer>
          <Helmet>
            <title>Oiva | Ammatillinen koulutus</title>
          </Helmet>
          <BreadcrumbsItem to="/">Etusivu</BreadcrumbsItem>
          <BreadcrumbsItem to="/jarjestajat">
            Ammatillinen koulutus
          </BreadcrumbsItem>

          <h1>Ammatillisen koulutuksen järjestäjät</h1>
          <p className="py-4">
            Voimassa olevat järjestämisluvat ({Object.keys(data).length} kpl)
          </p>
          <LuvatList luvat={data} />
        </ContentContainer>
      );
    } else if (isFetching) {
      return <Loading />;
    } else if (hasErrored) {
      return <div>&nbsp;&nbsp;Lupia ladattaessa tapahtui virhe</div>;
    } else {
      return null;
    }
  }
}

export default Jarjestajat;
