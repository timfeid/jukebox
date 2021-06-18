import { useHomeContext } from "../context/home"
import WeatherIcon from "./WeatherIcon"
import chroma from 'chroma-js'

export default function WeatherComponent () {
  const { state } = useHomeContext()

  if (state.loading || !state.weather) {
    return null
  }

  let weather = state.weather.state
  weather = weather[0].toUpperCase() + weather.substring(1)

  const daysOfTheWeek = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ]

  const color = chroma.scale(['#b6d0fa', '#c5d9fb', '#d4e3fc', '#e3ecfd', '#f1f5fe', '#fff3f0', '#ffe6e1', '#fddad3', '#fccdc4', '#fac1b6'])

  function getTempColor(weather: number) {
    weather = Math.max(0, weather)
    weather = Math.min(100, weather)

    return color(weather / 100)
  }

  function temp(degrees: number) {
    return degrees.toFixed(0)
  }

  return (
    <div className="flex flex-col w-full" style={{maxWidth: 800, maxHeight: 300}}>
      <div className="flex w-full px-12">
        <div className="flex flex-col justify-center text-center items-start" style={{flex: 1}}>
          <div className="text-center">
            <div className="text-3xl font-bold uppercase">Livingston, NJ</div>
            <div className="text-2xl uppercase">Weather</div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div style={{width: 100, margin: 'auto'}}>
            <WeatherIcon
              title={state.weather.state}
              path={state.weather.icon}
              size={100}
            />
          </div>
        </div>
        <div className="flex flex-col items-end justify-center text-center" style={{flex: 1}}>
          <div className="text-center">

            <div className="text-6xl" style={{lineHeight: '3rem'}}>{temp(state.weather.temperature)}&deg;{state.weather.unit}</div>
            <div className="text-xl">
              {weather}
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full pt-4 px-12 justify-between">
        {state.forecast.map((weather, index) => (
          <div key={index} className="flex flex-col justify-center items-center">
            <div>
              {daysOfTheWeek[weather.date.day()]}
            </div>
            <div className="my-1">

              <WeatherIcon
                title={weather.state}
                path={weather.icon}
                size={75}
              />
            </div>
            <div>
              <span style={{color: getTempColor(weather.tempHigh)}}>
                {temp(weather.tempHigh)}&deg;{state.weather.unit}
              </span>&nbsp;&nbsp;/&nbsp;&nbsp;
              <span style={{color: getTempColor(weather.tempLow)}}>
                {temp(weather.tempLow)}&deg;{state.weather.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
        {/* <div>
          {state.weather.humidity}% humidity
        </div>
        <div>
          {state.weather.windDirection} @ {state.weather.windSpeed}mph
        </div> */}
    </div>
  )
}
