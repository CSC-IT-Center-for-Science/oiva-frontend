import React, { useState, useRef } from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  usePagination
} from "react-table";

import { map, toUpper, head, values, find, propEq } from "ramda";
import { useIntl } from "react-intl";

import common from "../../../i18n/definitions/common";
import education from "../../../i18n/definitions/education";
import { Link } from "react-router-dom";

import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";

import matchSorter from "match-sorter";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  Input,
  FormLabel
} from "@material-ui/core";
import { styled } from "@material-ui/styles";
import { spacing } from "@material-ui/system";

const StyledButton = styled(Button)(spacing);

// Define a default UI for filtering
function DefaultColumnFilter({ column, intl }) {
  return (
    <React.Fragment>
      <FormLabel htmlFor={`filter-${column.id}`}>:</FormLabel>
      <Input
        id={`filter-${column.id}`}
        type="search"
        value={column.filterValue || ""}
        onChange={e => {
          column.setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={intl.formatMessage(common.filterRows)}
        style={{ fontSize: "0.875rem" }}
      />
    </React.Fragment>
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val;

function Table({ columns, data, intl, luvat, skipReset, updateMyData }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      }
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    headerGroups,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    prepareRow,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      initialState: {
        pageSize: 20,
        sortBy: [
          {
            id: "nimi",
            asc: true
          }
        ]
      },
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      // We also need to pass this so the page doesn't change
      // when we edit the data.
      autoResetPage: !skipReset,
      autoResetSelectedRows: !skipReset,
      disableMultiSort: true
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy,
    usePagination
  );

  // Render the UI for your table
  return (
    <React.Fragment>
      <MaUTable
        {...getTableProps()}
        className="border border-solid border-gray-400">
        <caption>
          {intl.formatMessage(common.voimassaOlevatJarjestamisluvat, {
            amount: `${rows.length} / ${luvat.length}`
          })}
        </caption>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => {
                return (
                  <TableCell {...column.getHeaderProps()}>
                    <span
                      {...column.getSortByToggleProps({
                        title: column.Header
                      })}>
                      {column.render("Header")}
                      {/* Add a sort direction indicator */}
                      {column.isSorted ? (
                        <span>
                          {column.isSortedDesc ? (
                            <ArrowDownwardIcon />
                          ) : (
                            <ArrowUpwardIcon />
                          )}
                        </span>
                      ) : null}
                    </span>
                    {/* Render the columns filter UI */}
                    <div>
                      {column.canFilter
                        ? column.render("Filter", { intl })
                        : null}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </MaUTable>
      {/*
        Pagination can be built however you'd like.
        This is just a very basic UI implementation:
      */}
      <nav
        role="navigation"
        aria-label={intl.formatMessage(common.navigationBetweenTablePages)}
        className="flex justify-evenly items-center">
        <div>
          <StyledButton
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            title={intl.formatMessage(
              common.siirryTaulukonEnsimmaiselleSivulleOhje,
              { pageIndex: pageIndex + 1 }
            )}
            variant="contained"
            mr={2}>
            <FirstPageIcon /> {intl.formatMessage(common.ensimmainenSivu)}
          </StyledButton>
          <StyledButton
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            title={intl.formatMessage(
              common.siirryTaulukonEdelliselleSivulleOhje,
              { pageIndex: pageIndex + 1 }
            )}
            variant="contained"
            mr={2}>
            <ArrowLeftIcon /> {intl.formatMessage(common.edellinen)}
          </StyledButton>
          <StyledButton
            onClick={() => nextPage()}
            disabled={!canNextPage}
            title={intl.formatMessage(
              common.siirryTaulukonSeuraavalleSivulleOhje,
              { pageIndex: pageIndex + 1 }
            )}
            variant="contained"
            mr={2}>
            {intl.formatMessage(common.seuraava)} <ArrowRightIcon />
          </StyledButton>
          <StyledButton
            title={intl.formatMessage(
              common.siirryTaulukonViimeiselleSivulleOhje,
              { pageIndex: pageIndex + 1 }
            )}
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            variant="contained">
            {intl.formatMessage(common.viimeinenSivu)} <LastPageIcon />
          </StyledButton>
        </div>
        <span>
          Sivu{" "}
          <strong>
            {pageIndex + 1} / {pageOptions.length}
          </strong>{" "}
        </span>
        <FormControl variant="outlined" className="w-32">
          <InputLabel htmlFor="move-on-to-page">
            {intl.formatMessage(common.siirrySivulle)}
          </InputLabel>
          <Input
            id="move-on-to-page"
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </FormControl>
        <FormControl variant="outlined" className="w-32">
          <InputLabel htmlFor="rows-per-page">
            {intl.formatMessage(common.rowsPerPage)}
          </InputLabel>
          <Select
            native
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
            }}
            label={intl.formatMessage(common.rowsPerPage)}
            inputProps={{
              name: "rows-per-page",
              id: "rows-per-page"
            }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
          </Select>
        </FormControl>
      </nav>
    </React.Fragment>
  );
}

function Jarjestajaluettelo({ luvat }) {
  const intl = useIntl();
  const [data, setData] = useState(() =>
    map(({ jarjestaja }) => {
      const localeUpper = toUpper(intl.locale);
      return {
        nimi: jarjestaja.nimi[intl.locale] || head(values(jarjestaja.nimi)),
        maakunta: (
          find(
            propEq("kieli", localeUpper),
            jarjestaja.maakuntaKoodi.metadata
          ) || {}
        ).nimi,
        ytunnus: jarjestaja.ytunnus,
        www: jarjestaja.yhteystiedot[1].www,
        toiminnot: ["info"]
      };
    }, luvat)
  );

  const columns = [
    {
      accessor: "nimi",
      Header: intl.formatMessage(common.jarjestaja),
      Cell: ({ row }) => {
        return (
          <Link
            className="underline"
            to={`jarjestajat/${row.values.ytunnus}/jarjestamislupa`}
            title={intl.formatMessage(common.siirryKJnTarkempiinTietoihin, {
              nimi: row.values.nimi
            })}>
            {row.values.nimi}
          </Link>
        );
      }
    },
    {
      accessor: "maakunta",
      Header: intl.formatMessage(common.homeCounty)
    },
    {
      accessor: "ytunnus",
      Header: intl.formatMessage(common.ytunnus)
    },
    {
      accessor: "www",
      Cell: ({ row }) => {
        return (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={row.values.www}
            className="underline">
            {row.values.www}
          </a>
        );
      },
      Header: intl.formatMessage(common.www)
    }
  ];

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.
  const skipResetRef = useRef(false);

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    skipResetRef.current = true;
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value
          };
        }
        return row;
      })
    );
  };

  // After data changes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    skipResetRef.current = false;
  }, [data]);

  return (
    <div className="mx-auto w-full sm:w-3/4 mb-16">
      <h1>{intl.formatMessage(education.vocationalEducation)}</h1>
      <p className="mt-4 mb-8">
        {intl.formatMessage(common.kjSivuinfo, { kpl: luvat.length })}
      </p>
      <CssBaseline />
      <Table
        columns={columns}
        data={data}
        intl={intl}
        luvat={luvat}
        skipReset={skipResetRef.current}
        updateMyData={updateMyData}
      />
    </div>
  );
}

export default Jarjestajaluettelo;
