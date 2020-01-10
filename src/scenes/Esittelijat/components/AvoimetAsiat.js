import React, {useEffect, useMemo} from "react";
import Table from "../../../components/02-organisms/Table"
import {generateAsiatTableStructure} from "../modules/asiatUtils";
import {useIntl} from "react-intl";
import {PropTypes} from "prop-types";
import {useMuutospyynnotEsittelija} from "../../../stores/muutospyynnotEsittelija";

const AvoimetAsiat = () => {
  const intl = useIntl();
  const [muutospyynnotEsittelija, muutospyynnotEsittelijaActions] = useMuutospyynnotEsittelija();

  useEffect(() => {
    let abortController = muutospyynnotEsittelijaActions.load('avoimet');

    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [muutospyynnotEsittelijaActions]);

  const tableStructure = useMemo(() => {
    return !!muutospyynnotEsittelija.data ?
      generateAsiatTableStructure(muutospyynnotEsittelija.data, intl.formatMessage) :
      [];
  }, [muutospyynnotEsittelija.data]);

  return (
    <React.Fragment>
      <React.Fragment>
        <Table structure={tableStructure}></Table>
      </React.Fragment>
    </React.Fragment>)
  }
;

AvoimetAsiat.propTypes = {
  intl: PropTypes.object
};

export default AvoimetAsiat;
