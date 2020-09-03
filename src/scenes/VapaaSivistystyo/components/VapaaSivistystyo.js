import React, { useEffect, useState } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { Helmet } from "react-helmet";

import common from "../../../i18n/definitions/common";
import { useIntl } from "react-intl";
import Table from "components/02-organisms/Table";
import Dropdown from "components/00-atoms/Dropdown";
import { useLuvat } from "../../../stores/luvat";
import { generateVSTTableStructure } from "../modules/utils";
import { useVSTTyypit } from "../../../stores/vsttyypit";
import {
  resolveKoodiLocalization,
  resolveLocalizedOrganizerName,
  resolveVSTOppilaitosNameFromLupa
} from "../../../modules/helpers";
import Loading from "../../../modules/Loading";
import { useLocation, useRouteMatch, useHistory } from "react-router-dom";
import queryString from "query-string";
import education from "../../../i18n/definitions/education";
import Input from "components/00-atoms/Input";

const VapaaSivistystyo = () => {
  console.info("Vapaa sivistystyö!");
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const intl = useIntl();
  const [luvatRaw, luvatActions] = useLuvat();
  const [vstRaw, vstActions] = useVSTTyypit();
  const [luvat, setLuvat] = useState([]);
  const [vstMap, setvstMap] = useState({
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6"
  });
  const [vstTypeOptions, setvstTypeOptions] = useState([]);
  const [vstYllapitajaFilter, setVstYllapitajaFilter] = useState("");
  const [vstOppilaitostyyppiFilter, setVstOppilaitostyyppiFilter] = useState(
    ""
  );
  const [allDataLength, setAllDataLength] = useState(0);
  const [filteredDataLength, setFilteredDataLength] = useState(0);

  useEffect(() => {
    const searchParams = queryString.parse(location.search);
    if (!!searchParams.yllapitaja) {
      setVstYllapitajaFilter(searchParams.yllapitaja);
    } else {
      setVstYllapitajaFilter("");
    }
    if (!!searchParams.oppilaitostyyppi) {
      setVstOppilaitostyyppiFilter(searchParams.oppilaitostyyppi);
    } else {
      setVstOppilaitostyyppiFilter("");
    }
  }, [location.search]);

  //fetch raw data for vst lupas
  useEffect(() => {
    const queryParameters = [
      {
        key: "koulutustyyppi",
        value: "3"
      }
    ];
    const abortController = luvatActions.load(queryParameters);
    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [luvatActions]);

  // fetch raw data for population vst oppilaitostyypi selections
  useEffect(() => {
    const abortController = vstActions.load();
    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [vstActions]);

  useEffect(() => {
    if (luvatRaw.data) {
      let filteredLuvat = luvatRaw.data;
      if (vstYllapitajaFilter.length > 0) {
        filteredLuvat = filteredLuvat.filter(lupa => {
          const nimi = resolveLocalizedOrganizerName(lupa, intl.locale);
          const oppilaitosnimi =
            resolveVSTOppilaitosNameFromLupa(lupa, intl.locale) || "";
          if (nimi) {
            return (
              nimi
                .toLocaleLowerCase()
                .includes(vstYllapitajaFilter.toLocaleLowerCase()) ||
              oppilaitosnimi
                .toLocaleLowerCase()
                .includes(vstYllapitajaFilter.toLocaleLowerCase())
            );
          } else {
            return false;
          }
        });
      }
      if (vstOppilaitostyyppiFilter) {
        filteredLuvat = filteredLuvat.filter(
          lupa => lupa.oppilaitostyyppi === vstOppilaitostyyppiFilter
        );
      }
      setLuvat(filteredLuvat);
      setAllDataLength(luvatRaw.data.length);
      setFilteredDataLength(filteredLuvat.length);
    }
  }, [luvatRaw, vstYllapitajaFilter, vstOppilaitostyyppiFilter, intl.locale]);

  useEffect(() => {
    // resolve names and selection options for vst oppilaitostyyppi
    if (vstRaw.data) {
      const vst = {};
      const vstOptions = [];
      vstRaw.data.forEach(item => {
        const name = resolveKoodiLocalization(item.metadata, intl.locale);
        vst[item.koodiArvo] = name;
        vstOptions.push({ value: item.koodiArvo, label: name });
      });
      setvstMap(vst);
      setvstTypeOptions(vstOptions);
    }
  }, [vstRaw, intl.locale]);

  const tableStructure = generateVSTTableStructure(
    luvat,
    intl,
    vstMap,
    history
  );

  const onOppilaitostyyppiSelectionChange = (_, { selectedOption }) => {
    const params = {};
    if (vstYllapitajaFilter !== "") {
      params.yllapitaja = vstYllapitajaFilter;
    }
    if (selectedOption.value !== "") {
      params.oppilaitostyyppi = selectedOption.value;
    }
    history.push(`${match.url}?${queryString.stringify(params)}`);
  };

  const onYllapitajaFilterChange = (_, { value }) => {
    const params = {};
    if (value.length > 0) {
      params.yllapitaja = value;
    }
    if (vstOppilaitostyyppiFilter !== "") {
      params.oppilaitostyyppi = vstOppilaitostyyppiFilter;
    }
    history.push(`${match.url}?${queryString.stringify(params)}`);
  };

  const vstTypeSelectionPlaceholder = intl.formatMessage(
    common.filterByOppilaitostyyppi
  );

  return (
    <React.Fragment>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>Kuja | Vapaa sivistystyö</title>
      </Helmet>
      <BreadcrumbsItem to="/">
        {intl.formatMessage(common.frontpage)}
      </BreadcrumbsItem>
      <BreadcrumbsItem to="/vapaa-sivistystyo">
        {intl.formatMessage(education.vstEducation)}
      </BreadcrumbsItem>
      <div className="mx-2 lg:mx-auto w-full sm:w-3/4 mb-16">
        <h1>{intl.formatMessage(common.vstYllapitajatHeading)}</h1>
        {luvatRaw.isLoading === false && luvatRaw.fetchedAt ? (
          <div>
            <div className="my-4">
              {intl.formatMessage(common.vstActiveLuvatCount, {
                count: allDataLength
              })}
            </div>
            <div className="flex flex-col lg:flex-row mb-6">
              <div className="lg:mr-4 w-2/6">
                <Input
                  onChanges={onYllapitajaFilterChange}
                  value={vstYllapitajaFilter}
                  label={intl.formatMessage(common.searchByYllapitaja)}
                />
              </div>
              <div className="mt-2 lg:mt-0 lg:mr-2 w-2/6">
                <Dropdown
                  onChanges={onOppilaitostyyppiSelectionChange}
                  isClearable={true}
                  options={vstTypeOptions}
                  value={vstOppilaitostyyppiFilter}
                  fullWidth={true}
                  label={vstTypeSelectionPlaceholder}
                  isTall={false}
                  className="w-full lg:w-20"
                  emptyMessage={intl.formatMessage(common.noSelection)}
                />
              </div>
              <div className="mt-2 lg:ml-4 lg:my-auto">
                {intl.formatMessage(common.displayingPortion, {
                  selectedCount: filteredDataLength,
                  allCount: allDataLength
                })}
              </div>
            </div>

            <Table structure={tableStructure} />
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </React.Fragment>
  );
};

export default VapaaSivistystyo;
