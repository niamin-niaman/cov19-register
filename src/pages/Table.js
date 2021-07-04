import { props } from "bluebird";
import React, { useEffect, useMemo, useState } from "react";

import {
  useCollectionDataOnce,
} from "react-firebase-hooks/firestore";

import firebase from "./../firebase";

import { useTable, useGlobalFilter, useFilters } from "react-table";

const COLUMNS = [
  //   {
  //     Header: "Id",
  //     accessor: "id",
  //   },
  {
    Header: "Citizen Id",
    accessor: "citizen_id",
  },
  {
    Header: "Firstname",
    accessor: "firstname",
  },
  {
    Header: "Lastname",
    accessor: "lastname",
  },
  {
    Header: "Citizen image",
    accessor: "citizen_image",
  },
  {
    Header: "Destinaion",
    columns: [
      {
        Header: "Province",
        accessor: "destination_province",
      },
      {
        Header: "District",
        accessor: "destination_district",
      },
      {
        Header: "Sub-district",
        accessor: "destination_sub_district",
      },
    ],
  },
  {
    Header: "Origin",
    columns: [
      {
        Header: "Country",
        accessor: "origin_country",
      },
      {
        Header: "Province",
        accessor: "origin_province",
      },
      {
        Header: "District",
        accessor: "origin_district",
      },
      {
        Header: "Sub-district",
        accessor: "origin_sub_district",
      },
    ],
  },
  {
    Header: "Timstamp",
    accessor: "time_stamp",
    Cell: ({ value }) => {
      var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
      d.setUTCSeconds(value);
      console.log(d);
      return <div>{d.toUTCString()}</div>;
    },
  },
];

const Table = () => {
  const db = firebase.firestore();
  const peopleRef = db.collection("people");
  const [people] = useCollectionDataOnce(peopleRef, { idField: "id" });

  //   setData(people);
  const columns = useMemo(() => COLUMNS, []);

  console.log(people);

  return (
    <div>{people && <TableContainer columns={columns} data={people} />}</div>
  );
};

const TableContainer = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useGlobalFilter
  );

  const { globalFilter } = state;

  return (
    <>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <table className='w-full border-2' {...getTableProps()}>
        <thead className='py-2'>
          {headerGroups.map((headerGroup) => (
            <tr className='py-2' {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className='padding-0.5 border-b-2 border-r-2'
                  {...column.getHeaderProps()}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                className='h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-b border-t border-gray-100'
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => (
                  <td
                    className='p-0.5 border-b-2 border-r-2'
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <span>
      Search : {""}
      <input value={filter || ""} onChange={(e) => setFilter(e.target.value)} />
    </span>
  );
};
const ColumnFilter = (column) => {
  const { filter, setFilter } = column;
  return (
    <span>
      Search : {""}
      <input value={filter || ""} onChange={(e) => setFilter(e.target.value)} />
    </span>
  );
};
export default Table;
