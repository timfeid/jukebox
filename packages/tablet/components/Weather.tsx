import { useHomeContext, Weather } from "../context/home"
import { fetch, request } from "../fetcher/graphql"
import SongCard from "./SongCard"
import WeatherIcon from "./WeatherIcon"

export default function WeatherComponent () {
  const { state } = useHomeContext()

  if (state.loading || !state.weather) {
    return null
  }

  return (
    <div>
      <div className="text-3xl">Livingston, NJ</div>
        <WeatherIcon
          title={state.weather.state}
          path={state.weather.icon}
          size={220}
        />
        <div className="text-xl">
          {state.weather.temperature} &deg;{state.weather.unit}
        </div>
        <div>
          {false}
        </div>
        <div>
          {state.weather.humidity}% humidity
        </div>
        <div>
          {state.weather.windDirection} @ {state.weather.windSpeed}mph
        </div>
    </div>
  )
}
