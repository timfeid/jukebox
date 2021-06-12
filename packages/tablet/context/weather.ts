import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs'
import { getIcon } from '../openweather/icon';

export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';

const initialState = {
  data: null,
  errorMessage: null,
};

function convertWindDegreesToHumanReadable(degrees: number) {
  if( (degrees >= 348.75) && (degrees <= 360) ||
    (degrees >= 0) && (degrees <= 11.25)    ){
    return "N";
  } else if( (degrees >= 11.25 ) && (degrees <= 33.75)){
    return "NNE";
  } else if( (degrees >= 33.75 ) &&(degrees <= 56.25)){
    return "NE";
  } else if( (degrees >= 56.25 ) && (degrees <= 78.75)){
    return "ENE";
  } else if( (degrees >= 78.75 ) && (degrees <= 101.25) ){
    return "E";
  } else if( (degrees >= 101.25) && (degrees <= 123.75) ){
    return "ESE";
  } else if( (degrees >= 123.75) && (degrees <= 146.25) ){
    return "SE";
  } else if( (degrees >= 146.25) && (degrees <= 168.75) ){
    return "SSE";
  } else if( (degrees >= 168.75) && (degrees <= 191.25) ){
    return "S";
  } else if( (degrees >= 191.25) && (degrees <= 213.75) ){
    return "SSW";
  } else if( (degrees >= 213.75) && (degrees <= 236.25) ){
    return "SW";
  } else if( (degrees >= 236.25) && (degrees <= 258.75) ){
    return "WSW";
  } else if( (degrees >= 258.75) && (degrees <= 281.25) ){
    return "W";
  } else if( (degrees >= 281.25) && (degrees <= 303.75) ){
    return "WNW";
  } else if( (degrees >= 303.75) && (degrees <= 326.25) ){
    return "NW";
  } else if( (degrees >= 326.25) && (degrees <= 348.75) ){
    return "NNW";
  } else {
    return "?";
  }
}

function presenter(data, options) {
  return {
    current: {
      temperature: data.current.temp,
      degreesUnit: options.units === 'metric' ? 'C' : 'F',
      feelsLike: data.current.feels_like,
      sunrise: dayjs(data.current.sunrise),
      sunset: dayjs(data.current.sunset),
      uvIndex: data.current.uvi,
      humidity: data.current.humidity,
      cloudPercentage: data.current.clouds,
      visibilityMiles: data.current.visibility * 0.000621371,
      visibilityMeters: data.current.visibility,
      windSpeed: data.current.wind_speed,
      windUnit: options.units === 'metric' ? 'kph' : 'mph',
      windDegrees: data.current.wind_deg,
      windDirection: convertWindDegreesToHumanReadable(data.current.wind_deg),
      windGustSpeed: data.current.wind_gust,
      icon: getIcon(data.current.weather[0].icon),
      title: data.current.weather[0].main,
      description: data.current.weather[0].description,
    }
  }
}

export const fetchReducer = (state, { type, payload }) => {
  switch (type) {
    case SUCCESS:
      return {
        data: payload,
        errorMessage: null,
      };
    case FAILURE:
      return { data: null, errorMessage: payload };
    default:
      return state;
  }
};

export const useOpenWeather = (options) => {
  const endpoint = '//api.openweathermap.org/data/2.5/onecall';
  const [state, dispatch] = useReducer(fetchReducer, initialState);
  const { data, errorMessage } = state;
  const [isLoading, setIsLoading] = useState(false);
  const { unit, lang, key, lon, lat } = options;
  const params = {
    appid: key,
    lang,
    units: unit,
    lat,
    lon,
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const forecastResponse = await axios.get(endpoint, { params });

      dispatch({
        type: SUCCESS,
        payload: presenter(forecastResponse.data, options),
      });
    } catch (error) {
      console.error(error.message);
      dispatch({ type: FAILURE, payload: error.message || error });
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, [lon, lat]);
  return { data, isLoading, errorMessage, fetchData };
};

