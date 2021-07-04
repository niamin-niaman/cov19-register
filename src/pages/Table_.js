import React, { useEffect, useMemo, useState } from "react";

import { useCollectionDataOnce } from "react-firebase-hooks/firestore";

import firebase from "../firebase";

import { useTable, useGlobalFilter, useFilters } from "react-table";

import Modal from "../components/Modal";

const Table = () => {
  const db = firebase.firestore();
  const peopleRef = db.collection("people");
  const [people] = useCollectionDataOnce(peopleRef, { idField: "id" });
  const [open, setOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");

  //   setData(people);
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
      accessor: "first_name",
    },
    {
      Header: "Lastname",
      accessor: "last_name",
    },
    {
      Header: "Citizen image",
      accessor: "citizen_image",
      Cell: ({ value }) => (
        <button
          type='button'
          className='w-full font-kanit inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm'
          onClick={() => {
            setImgSrc(value);
            setOpen(true);
          }}
        >
          เปิดรูป
        </button>
      ),
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
  const columns = useMemo(() => COLUMNS, []);

  console.log(people);

  return (
    <>
      <div>{people && <TableContainer columns={columns} data={people} />}</div>
      <Modal open={open} setOpen={setOpen} imgSrc={imgSrc} />
    </>
  );
};

const ColumnFilter = ({ column }) => {
  const { filterValue, setFilter } = column;
  return (
    <span>
      Search : {""}
      <input
        value={filterValue || ""}
        onChange={(e) => setFilter(e.target.value)}
      />
    </span>
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

export default Table;
