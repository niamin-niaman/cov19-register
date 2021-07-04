import React from "react";
import _ from "lodash";
import firebase from "./../firebase";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";

import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory";

const Chart = () => {
  const db = firebase.firestore();
  const peopleRef = db.collection("people");
  const [people] = useCollectionDataOnce(peopleRef, { idField: "id" });
  return (
    <div className='grid  grid-cols-12 gap-4'>
      <div className='flex flex-col justify-center items-center col-span-4 border-b-2 border-r-2 p-4  '>
        <p className='font-kanit text-sm '> จังหวัดที่มีคนเข้ามากที่สุด </p>
        {people && <Bar1 data={people} />}
      </div>

      <div className='flex flex-col justify-center items-center col-span-4 border-b-2 border-r-2 p-4'>
        <p className='font-kanit text-sm '> จังหวัดที่มีคนออกมากที่สุด </p>
        {people && <Bar2 data={people} />}
      </div>
      <div className='flex flex-col justify-center items-center col-span-4 border-b-2 border-r-2 p-4'>
        Chart 3
      </div>
    </div>
  );
};

const Bar2 = ({ data }) => {
  // console.log(data);
  const groupBy = _.groupBy(data, "destination_province");

  let res = [];
  for (const key in groupBy) {
    let o = {};
    o["province"] = key;
    o["number"] = groupBy[key].length;
    res.push(o);
  }

  // console.log(res);

  const sort = _.orderBy(res, ["number"], ["desc"]);
  // console.log(sort);
  return (
    <>
      <VictoryChart
        // domainPadding will add space to each side of VictoryBar to
        // prevent it from overlapping the axis
        domainPadding={20}
        // adding the material theme provided with Victory
        theme={VictoryTheme.material}
      >
        <VictoryAxis
          // tickValues specifies both the number of ticks and where
          // they are placed on the axis
          tickValues={[1, 2, 3, 4]}
          tickFormat={(y) => `${y}`}
        />
        <VictoryAxis
          dependentAxis
          // tickFormat specifies how ticks should be displayed
          tickFormat={(x) => `${x}`}
        />
        <VictoryBar data={sort} x='province' y='number' />
      </VictoryChart>
    </>
  );
};
const Bar1 = ({ data }) => {
  // console.log(data);
  const groupBy = _.groupBy(data, "origin_province");

  let res = [];
  for (const key in groupBy) {
    let o = {};
    o["province"] = key;
    o["number"] = groupBy[key].length;
    res.push(o);
  }

  // console.log(res);

  const sort = _.orderBy(res, ["number"], ["desc"]);
  // console.log(sort);
  return (
    <>
      <VictoryChart
        // domainPadding will add space to each side of VictoryBar to
        // prevent it from overlapping the axis
        domainPadding={20}
        // adding the material theme provided with Victory
        theme={VictoryTheme.material}
      >
        <VictoryAxis
          // tickValues specifies both the number of ticks and where
          // they are placed on the axis
          tickValues={[1, 2, 3, 4]}
          tickFormat={(y) => `${y}`}
        />
        <VictoryAxis
          dependentAxis
          // tickFormat specifies how ticks should be displayed
          tickFormat={(x) => `${x}`}
        />
        <VictoryBar data={sort} x='province' y='number' />
      </VictoryChart>
    </>
  );
};

const Bar = ({ data }) => {
  data = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 },
  ];
  return (
    <VictoryChart
      // domainPadding will add space to each side of VictoryBar to
      // prevent it from overlapping the axis
      domainPadding={20}
      // adding the material theme provided with Victory
      theme={VictoryTheme.material}
    >
      <VictoryAxis
        // tickValues specifies both the number of ticks and where
        // they are placed on the axis
        tickValues={[1, 2, 3, 4]}
        tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
      />
      <VictoryAxis
        dependentAxis
        // tickFormat specifies how ticks should be displayed
        tickFormat={(x) => `$${x / 1000}k`}
      />
      <VictoryBar data={data} x='quarter' y='earnings' />
    </VictoryChart>
  );
};

export default Chart;
