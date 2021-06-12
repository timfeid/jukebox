import {
  Auth,
  createConnection,
  subscribeEntities,
  subscribeServices,
  createLongLivedTokenAuth,
} from "home-assistant-js-websocket";
import { createContext, Dispatch, useContext, useEffect, useReducer } from "react";
import icons from "../icons";

type HomeStore = {
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

export type HomeState = {
  loading: boolean,
  thermostats: Thermostat[]
  weather: Weather
}

const initialState: HomeState = {
  loading: true,
  thermostats: [],
  weather: null,
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

function convert(entities): HomeState {
  console.log(entities)
  return {
    loading: false,
    thermostats: findClimates(entities),
    weather: findWeather(entities),
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
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmYWJmMTg0YTY0ZDg0N2M3OTNhNTU5MWJiYWFmNTEzNyIsImlhdCI6MTYyMzQzNTAxMywiZXhwIjoxOTM4Nzk1MDEzfQ.zxokqf7q7IFvUuhgwUVqvbQMLeVXct4TBm4nlEudSKI"
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
