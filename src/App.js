import React, { useState } from 'react';
import axios from 'axios';

import './App.css';
import env from './env';
import currencies from './currency.json';

const initialState = {
  price: '',
  formattedPrice: '',
  ip: '',
  country: '',
  currency: 'USD',
};

const App = () => {
  const [formData, setFormData] = useState(initialState);

  const { price, formattedPrice, ip, country, currency } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    let code = currency;
    let name = '';
    let ip = '';
    if (e.target.name === 'fromIp') {
      const { data } = await axios({
        url: `https://api.ipregistry.co/?key=${env.IPREG_KEY}`,
        method: 'GET',
      });

      code = data.currency.code;
      ip = data.ip;
      name = data.location.country.name;
    }

    const formattedPrice = new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: code,
    }).format(price);

    setFormData({
      ...formData,
      formattedPrice,
      ip,
      country: name,
      currency: code,
    });
  };

  return (
    <div className='App'>
      <form className='input-form'>
        <select
          className='currency-select'
          name='currency'
          value={currency}
          onChange={onChange}
          required
        >
          {Object.keys(currencies).map((item) => (
            <option
              className='currency-option'
              key={currencies[item].code}
              value={currencies[item].code}
            >
              {currencies[item].symbol} - {currencies[item].name}
            </option>
          ))}
        </select>
        <input
          className='price-input'
          type='number'
          name='price'
          placeholder='Enter price here'
          value={price}
          onChange={onChange}
          required
        ></input>

        <input
          className='submit-btn'
          type='submit'
          name='format'
          value='Format'
          onClick={onSubmit}
        ></input>
        <input
          className='submit-btn'
          type='submit'
          name='fromIp'
          value='Format using IP'
          onClick={onSubmit}
        ></input>
      </form>

      {formattedPrice && <p className='formatted-price'>{formattedPrice}</p>}

      {ip && country && currency ? (
        <div className='extra-details'>
          <p className='ip'>
            <b>IP:</b> {ip}
          </p>
          <p className='currency'>
            <b>Country:</b> {country}
          </p>
          <p className='country'>
            <b>Currency:</b> {currency}
          </p>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default App;
