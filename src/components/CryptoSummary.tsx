import { JSX } from 'react';
import { Crypto } from '../types/Types'; // вытаскиваем только тип из функцианального компонента не весь компонент

export type AppProps = {
  // тепизируем объект крипто пропсами из Арр
  crypto: Crypto;
};

export default function CryptoSummary({ crypto }: AppProps): JSX.Element {
  return <p>{crypto.name + ' $' + crypto.current_price}</p>;
}
