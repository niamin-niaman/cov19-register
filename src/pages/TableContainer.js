import React, { useMemo, useState } from "react";
import { useTable, useGlobalFilter, useFilters } from "react-table";

import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import firebase from "../firebase";

import Modal from "../components/Modal";

const TableContainer = () => {
  const [open, setOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");

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
      Filter: NoneFiletr,
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
          Filter: SelectColumnFilter,
        },
        {
          Header: "District",
          accessor: "destination_district",
          Filter: SelectColumnFilter,
        },
        {
          Header: "Sub-district",
          accessor: "destination_sub_district",
          Filter: SelectColumnFilter,
        },
      ],
    },
    {
      Header: "Origin",
      columns: [
        {
          Header: "Country",
          accessor: "origin_country",
          Filter: SelectColumnFilter,
        },
        {
          Header: "Province",
          accessor: "origin_province",
          Filter: SelectColumnFilter,
        },
        {
          Header: "District",
          accessor: "origin_district",
          Filter: SelectColumnFilter,
        },
        {
          Header: "Sub-district",
          accessor: "origin_sub_district",
          Filter: SelectColumnFilter,
        },
      ],
    },
    {
      Header: "Timstamp",
      accessor: "time_stamp",
      Filter: NoneFiletr,
        Cell: ({ value }) => {
          var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
          d.setUTCSeconds(value / 1000);
          console.log(d);
          return <div>{d.toUTCString()}</div>;
        },
    },
  ];
  const columns = useMemo(() => COLUMNS, []);

  const db = firebase.firestore();
  const peopleRef = db.collection("people");
  const [people] = useCollectionDataOnce(peopleRef, { idField: "id" });
  return (
    <div>
      {people && <Table columns={columns} data={people} />}
      <Modal open={open} setOpen={setOpen} imgSrc={imgSrc} />
    </div>
  );
};

export default TableContainer;

function NoneFiletr() {
  return <div></div>;
}

function ColumnFilter({ column: { filterValue, setFilter } }) {
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
    />
  );
}
// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div className='flex justify-center'>
      <input
        className='rounded-md border border-gray-300 shadow-sm py-0'
        value={filterValue[0] || ""}
        type='number'
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [
            val ? parseInt(val, 10) : undefined,
            old[1],
          ]);
        }}
        placeholder={`Min (${min})`}
        style={{
          width: "70px",
          marginRight: "0.5rem",
        }}
      />
      to
      <input
        className='rounded-md border border-gray-300 shadow-sm py-0'
        value={filterValue[1] || ""}
        type='number'
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [
            old[0],
            val ? parseInt(val, 10) : undefined,
          ]);
        }}
        placeholder={`Max (${max})`}
        style={{
          width: "70px",
          marginLeft: "0.5rem",
        }}
      />
    </div>
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      className='rounded-md border border-gray-300 shadow-sm py-0 px-2'
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value=''>All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      style={{
        maxWidth: "100%",
      }}
      className='rounded-md border border-gray-300 shadow-sm py-0 px-2'
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search`}
    />
  );
}

const Table = ({ columns, data }) => {
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

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
      defaultColumn,
    },
    useFilters,
    useGlobalFilter
  );

  const { globalFilter } = state;

  return (
    <>
      <table className=' border-2 w-full' {...getTableProps()}>
        <thead className='py-2'>
          {headerGroups.map((headerGroup) => (
            <tr className='py-2' {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  style={{ maxWidth: "120px" }}
                  className='font-kanit max-w-xs border-b-2 border-r-2 '
                  {...column.getHeaderProps()}
                >
                  {column.render("Header")}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
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
                    className='p-0.5 border-b-2 border-r-2 font-kanit text-center'
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
