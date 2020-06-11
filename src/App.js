import React, { useEffect, useState } from "react";
import "./App.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
const ba = require("bitcoinaverage");

var publicKey = "NGU0Mjk2ZjVkZDhkNDZjMzhhNzZmZDM3NzlkNGRhNWQ";
var secretKey =
  "ODYyZTMyZmU0OTFhNDJlNDhkZTA3ZDkyYmFmNmMwMWQ2OTUzMTQ3NzNmN2E0NWMwYmYxMjRmOWZhYTc2Y2E4Ng";

var restClient = ba.restfulClient(publicKey, secretKey);
var wsClient = ba.websocketClient(publicKey, secretKey);

function App() {
  const [data, setdata] = useState([]);
  const [date, setdate] = useState("");

  useEffect(() => {
    setInterval(() => {
      restClient.tickerLocalPerSymbol("BTCUSD", function (response) {
        var copyData = data;
        var json_res = JSON.parse(response);
        const { display_timestamp, last, bid } = json_res;
        copyData.push({
          time: display_timestamp.slice(17, 25),
          last,
          bid,
        });
        setdata([]);
        setdate(display_timestamp.slice(0, 16));
        setdata([...copyData]);
      });
    }, 5000);
  }, []);

  return (
    <div className="App">
      <h1>
        BTC - USD - <span>{date}</span>
      </h1>
      <AreaChart width={1000} height={500} data={data} className="area">
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="time" interval="preserveStart" />
        <YAxis domain={["dataMin - 20", "dataMax + 20"]} width={100} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="last"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="bid"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorPv)"
        />
      </AreaChart>
    </div>
  );
}

export default App;
