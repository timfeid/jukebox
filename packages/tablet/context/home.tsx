import dayjs from 'dayjs';
import {
  createConnection,


  createLongLivedTokenAuth, subscribeEntities,
  subscribeServices
} from "home-assistant-js-websocket";
import { createContext, Dispatch, useContext, useEffect, useReducer } from "react";
import icons from "../icons";

export type HomeStore = {
  state: HomeState
  dispatch?: Dispatch<HomeAction>
}

export enum HomeActions {
  SET_ENTITIES = 'SET_ENTITIES',
}

type HomeActionSetEntities = {
  type: HomeActions.SET_ENTITIES,
  payload: HomeState
}

export type HomeAction = HomeActionSetEntities

export type WasherDryer = {
  state: 'on' | 'off'
  completionTime: dayjs.Dayjs
  cycle: string
  stateChangedTime: dayjs.Dayjs
}

export type Thermostat = {
  name: string
  currentTemperature: number
  setTemperature: number
  unit: string
  mode: string
  hvacMode: string
}

export type Weather = {
  temperature: number
  unit: 'F' | 'C'
  windDirection: string
  windSpeed: number
  icon: string
  state: string
  humidity: number
}

export type ForecastedWeather = {
  tempHigh: number
  tempLow: number
  windDirection: string
  windSpeed: number
  icon: string
  state: string
  date: dayjs.Dayjs
}

export type UVIndex = {
  description: string
  value: number
  updatedAt: dayjs.Dayjs
}

export type Sun = {
  nextSunset: dayjs.Dayjs
  nextSunrise: dayjs.Dayjs
  lastChanged: dayjs.Dayjs
  isDaytime: boolean
}

export type Tracker = {
  person: string
  deviceName: string
  state: string
}

export type HomeState = {
  loading: boolean,
  thermostats: Thermostat[]
  weather: Weather
  UVIndex: UVIndex
  sun: Sun
  dryer: WasherDryer
  washer: WasherDryer
  forecast: ForecastedWeather[]
  trackers: Tracker[]
}

const initialState: HomeState = {
  loading: true,
  thermostats: [],
  weather: null,
  UVIndex: null,
  sun: null,
  washer: null,
  dryer: null,
  forecast: [],
  trackers: [],
}

export const HomeContext = createContext<HomeStore>({ state: initialState })

export const useHomeContext = () => useContext(HomeContext);

function findClimates(entities): Thermostat[] {
  const thermostats: Thermostat[] = []
  const matchingEntities = Object.keys(entities).filter(key => key.startsWith('climate.'))

  for (const entity of matchingEntities) {
    thermostats.push({
      name: entities[entity].attributes.friendly_name,
      currentTemperature: entities[entity].attributes.current_temperature,
      setTemperature: entities[entity].attributes.temperature,
      hvacMode: entities[entity].attributes.hvac_action,
      mode: entities[entity].state,
      unit: 'F',
    })
  }

  return thermostats
}

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

function getIcon (state: string) {
  if (state.includes('clear')) {
    return icons.weather.sunny
  }

  if (state.includes('cloudy')) {
    return icons.weather.cloudy
  }

  if (state.includes('fog')) {
    return icons.weather.fog
  }

  if (state.includes('hail')) {
    return icons.weather.hail
  }

  if (state.includes('thunder')) {
    return icons.weather.thunderstorms
  }

  if (state.includes('heavysnow')) {
    return icons.weather.windySnow
  }

  if (state.includes('snow')) {
    return icons.weather.snow
  }

  if (state.includes('heavyrain')) {
    return icons.weather.stormyShowers
  }

  if (state.includes('lightrain')) {
    return icons.weather.sprinkle
  }

  if (state.includes('rain')) {
    return icons.weather.rain
  }

  if (state.includes('sleet')) {
    return icons.weather.sleet
  }

  return icons.weather.sunny
}

function findWeather(entities): Weather {
  const w = entities['weather.28_byron']

  return {
    temperature: w.attributes.temperature,
    unit: 'F',
    windDirection: convertWindDegreesToHumanReadable(w.attributes.wind_bearing),
    windSpeed: w.attributes.wind_speed,
    icon: getIcon(w.state),
    state: w.state,
    humidity: w.attributes.humidity,
  }
}

function findUVIndex(entities): UVIndex {
  return {
    description: entities['sensor.current_uv_level'].state,
    value: parseFloat(entities['sensor.current_uv_index'].state),
    updatedAt: dayjs(entities['sensor.current_uv_index'].last_updated),
  }
}

function findSun(entities): Sun {
  return {
    nextSunrise: dayjs(entities['sun.sun'].attributes.next_rising),
    nextSunset: dayjs(entities['sun.sun'].attributes.next_setting),
    isDaytime: entities['sun.sun'].state === 'above_horizon',
    lastChanged: dayjs(entities['sun.sun'].last_changed),
  }
}

function findWasherDryer(entities, type): WasherDryer {
  return {
    state: entities[`switch.${type}`].state,
    stateChangedTime: dayjs(entities[`switch.${type}`].last_updated),
    completionTime: dayjs(entities[`sensor.${type}_${type}_completion_time`].state),
    cycle: entities[`sensor.${type}_${type}_job_state`].state,
  }
}

function findForecast(entities) {
  const forecast: ForecastedWeather[] = []

  const weather = entities['weather.28_byron'].attributes

  weather.forecast.forEach(raw => {
    forecast.push({
      tempHigh: raw.temperature,
      tempLow: raw.templow,
      windDirection: convertWindDegreesToHumanReadable(raw.wind_bearing),
      windSpeed: raw.wind_speed,
      state: raw.condition,
      icon: getIcon(raw.condition),
      date: dayjs(raw.datetime),
    })
  })

  return forecast
}

function findTrackers(entities) {
  const trackers: Tracker[] = []
  const knownPeople = {
    'DEEZ-NUTZ': 'Tim Feid',
    'PIXEL-3A': 'Nicolle Guida',
    'JOHNFEIDSIPHONE': 'John Feid',
    'STEPHENS-IPHONE': 'Stephen Chan',
    'DOMINICS-IPHONE': 'Dominic DePasquale',
    'SAMSUNG-SM-G935V': 'Salvator Cocuzza',
  }

  const homeStates: any = {}

  const validKeys = Object.keys(entities).filter(key => key.startsWith('device_tracker.'))

  for (const key of validKeys) {
    const deviceName = entities[key].attributes.friendly_name
    if (!homeStates[deviceName] && entities[key].state === 'home') {
      homeStates[deviceName] = 1
    }
  }

  for (const key of validKeys) {
    const deviceName = entities[key].attributes.friendly_name
    if (!trackers.find(t => t.deviceName === deviceName)) {

      trackers.push({
        person: knownPeople[deviceName] || 'unknown',
        state: homeStates[deviceName] ? 'home' : entities[key].state,
        deviceName,
      })
    }
  }

  return trackers
}

function convert(entities): HomeState {
  console.log(entities)
  return {
    loading: false,
    thermostats: findClimates(entities),
    weather: findWeather(entities),
    UVIndex: findUVIndex(entities),
    sun: findSun(entities),
    washer: findWasherDryer(entities, 'washer'),
    dryer: findWasherDryer(entities, 'dryer'),
    forecast: findForecast(entities),
    trackers: findTrackers(entities),
  }
}

export const reducer = (
  state: HomeState = initialState,
  action: HomeAction
): HomeState => {
  switch (action.type) {
    case HomeActions.SET_ENTITIES:
      return action.payload
    default:
      throw new Error(`Unknown action ${action}`);
  }
}

export const HomeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return <HomeContext.Provider value={{ state, dispatch }} children={children} />;
}

export const subscribe = () => {

  const { dispatch } = useHomeContext()

  useEffect(() => {
    const auth = createLongLivedTokenAuth(
      "https://home.timfeid.com",
      process.env.HOME_TOKEN,
    );

    createConnection({ auth }).then(connection => {
      subscribeEntities(connection, (entities) => dispatch({
        type: HomeActions.SET_ENTITIES,
        payload: convert(entities),
      }))

      subscribeServices(connection, (services) => {
        console.log('services', services)
      })
    })
  }, [])
}
