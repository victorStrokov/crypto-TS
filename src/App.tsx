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
  ArcElement,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
// import moment from 'moment';

import './App.css';

import { Crypto } from './types/Types';
import CryptoSummary from './components/CryptoSummary';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
  // CategoryScale,
  // LinearScale,
  // PointElement,
  // LineElement,
  // Title,
);

function App() {
  const [cryptos, setCryptos] = React.useState<Crypto[] | null>(null);
  const [selected, setSelected] = React.useState<Crypto[]>([]);

  // const [range, setRange] = React.useState<number>(30);

  const [data, setData] = React.useState<ChartData<'pie'>>();

  React.useEffect(() => {
    const url =
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';
    axios.get(url).then((response) => {
      setCryptos(response.data);
    });
  }, []);
  /*
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
*/

  React.useEffect(() => {
    console.log('SELECTED', selected);
    if (selected.length === 0) return;
    setData({
      labels: selected.map((s) => s.name), // добавляем названия монет
      datasets: [
        {
          label: '# of Votes',
          data: selected.map((s) => s.owned * s.current_price), // добавляем кол-во монет отображаемых в графике 
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [selected]);
  function updateOwned(crypto: Crypto, amount: number): void {
    console.log('updateOwned', amount, crypto);
    let temp = [...selected];
    let tempObj = temp.find((c) => c.id === crypto.id);
    if (tempObj) {
      tempObj.owned = amount;
      setSelected(temp);
    }
    // ваша логика изменения количества у текущей монеты
    //...
  }

  return (
    <>
      <div className="App">
        <select
          onChange={(e) => {
            // выбор монеты по названию
            const c = cryptos?.find((x) => x.id === e.target.value) as Crypto;
            setSelected([...selected, c]);
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
        {/* <select
          onChange={(e) => {
            setRange(parseInt(e.target.value)); // конвертируем строку в число
          }}
        >
          <option value={30}>30 Days</option>
          <option value={7}>7 Days</option>
          <option value={2}>2 Days</option>
        </select> */}
      </div>

      {selected.map((s) => {
        return <CryptoSummary crypto={s} updateOwned={updateOwned} />;
      })}

      {/*selected ? <CryptoSummary crypto={selected} /> : null*/}
      {/* выводим выбранную монету */}
      {data ? (
        <div style={{ width: 600 }}>
          <Pie data={data} />
        </div>
      ) : null}

      {selected
        ? 'Your portfolio is worth: $ ' +
          selected
            .map((s) => {
              if (isNaN(s.owned)) {
                return 0;
              }
              return s.current_price * s.owned;
            })
            .reduce((prev, current) => {
              console.log('prev, current', prev, current);

              return prev + current;
            }, 0)
            .toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
        : null}
    </>
  );
}

export default App;
// curl --request GET \ https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1&sparkline=false
//      --url https://pro-api.coingecko.com/api/v3/coins/id \
//      --header 'accept: application/json'
