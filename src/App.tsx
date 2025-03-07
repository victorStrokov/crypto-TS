import React from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import moment from 'moment';

import './App.css';

import { Crypto } from './types/Types';
import CryptoSummary from './components/CryptoSummary';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [cryptos, setCryptos] = React.useState<Crypto[] | null>(null);
  const [selected, setSelected] = React.useState<Crypto | null>();

  const [range, setRange] = React.useState<number>(30);

  const [data, setData] = React.useState<ChartData<'line'>>();
  const [options, setOtions] = React.useState<ChartOptions<'line'>>({
    responsive: true,
    plugins: {
      legend: {
       display: false // position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  });
  React.useEffect(() => {
    const url =
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';
    axios.get(url).then((response) => {
      setCryptos(response.data);
    });
    //  .then().catch(err => {console.log(err);
    //  })
  }, []);

  React.useEffect(() => {
    if (!selected) return;// если ничего не выбрано не запрашивай 
    // запрос графика
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/${selected?.id}/market_chart?vs_currency=usd&days=${range}&${range}'interval=daily'`
      ) // 
      .then((response) => {
        console.log(response.data);
        setData({
          labels: response.data.prices.map((price: number[]) => {
            return moment
              .unix(price[0] / 1000)
              .format(range === 2 ? 'HH:MM' : 'DD:MM');
          }),
          datasets: [
            {
              label: 'Dataset 1',
              data: response.data.prices.map((price: number[]) => {
                return price[1].toFixed(2);
              }),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        });
        setOtions({
          responsive: true,
          plugins: {
            legend: {
              display: false, // position: 'top' as const,
            },
            title: {
              display: true,
              text: `Price Over Last ${range} Days.`, //+(range === 2 ? "Day." : "Days."),
            },
          },
        });
      });
  }, [selected, range]);

  return (
    <>
      <div className="App">
        <select
          onChange={(e) => {
            // выбор монеты по названию
            const c = cryptos?.find((x) => x.id === e.target.value);
            setSelected(c);
          }}
          defaultValue="default"
        >
          <option value="default">Choose an option</option>
          {/* создаем окно выбора */}
          {cryptos
            ? cryptos.map((crypto) => {
                return (
                  <option key={crypto.id} value={crypto.id}>
                    {crypto.name}
                  </option>
                );
              })
            : null}
        </select>
        <select
          onChange={(e) => {
            setRange(parseInt(e.target.value)); // конвертируем строку в число
          }}
        >
          <option value={30}>30 Days</option>
          <option value={7}>7 Days</option>
          <option value={2}>2 Days</option>
        </select>
      </div>
      {selected ? <CryptoSummary crypto={selected} /> : null}
      {/* выводим выбранную монету */}
      {data ? (
        <div style={{ width: 600, height: 400 }}>
          <Line options={options} data={data} />
        </div>
      ) : null}
    </>
  );
}

export default App;
// curl --request GET \ https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1&sparkline=false
//      --url https://pro-api.coingecko.com/api/v3/coins/id \
//      --header 'accept: application/json'
