import React from 'react'
import Styles from '../styles/Clock.module.scss'

const AnimatedCard = ({ animation, digit }) => {
  return(
    <div className={`${Styles.flipCard} ${animation}`}>
      <span>{digit}</span>
    </div>
  );
};

// function component
const StaticCard = ({ position, digit }) => {
  return(
    <div className={position}>
      <span>{digit}</span>
    </div>
  );
};

// function component
const FlipUnitContainer = ({ digit, shuffle, unit }) => {

  // assign digit values
  let currentDigit: any = digit;
  let previousDigit: any = digit - 1;

  // to prevent a negative value
  if ( unit !== 'hours') {
    previousDigit = previousDigit === -1
      ? 59
      : previousDigit;
  } else {
    previousDigit = previousDigit === -1
      ? 23
      : previousDigit;
  }

  // add zero
  if ( currentDigit < 10 ) {
    currentDigit = `0${currentDigit}`;
  }
  if ( previousDigit < 10 ) {
    previousDigit = `0${previousDigit}`;
  }

  // shuffle digits
  const digit1 = shuffle
    ? previousDigit
    : currentDigit;
  const digit2 = !shuffle
    ? previousDigit
    : currentDigit;

  // shuffle animations
  const animation1 = shuffle
    ? Styles.fold
    : Styles.unfold;
  const animation2 = !shuffle
    ? Styles.fold
    : Styles.unfold;

  return(
    <div className={Styles.flipUnitContainer}>
      <StaticCard
        position={Styles.upperCard}
        digit={currentDigit}
        />
      <StaticCard
        position={Styles.lowerCard}
        digit={previousDigit}
        />
      <AnimatedCard
        digit={digit1}
        animation={animation1}
        />
      <AnimatedCard
        digit={digit2}
        animation={animation2}
        />
    </div>
  );
};

// class component
export default class FlipClock extends React.Component {
  timerID: any

  readonly state: {
    hours: number
    hoursShuffle: boolean
    minutes: number
    minutesShuffle: boolean
    seconds: number
    secondsShuffle: boolean
  }

  constructor(props) {
		super(props);
		this.state = {
			hours: 0,
			hoursShuffle: true,
			minutes: 0,
			minutesShuffle: true,
			seconds: 0,
			secondsShuffle: true
		};
	}

	componentDidMount() {
		this.timerID = setInterval(
			() => this.updateTime(),
			50
		);
	}

	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	updateTime() {
		// get new date
		const time = new Date;
		// set time units
		let hours = time.getHours();
    if (hours > 12) {
      hours = hours-12
    }
		const minutes = time.getMinutes();
		const seconds = time.getSeconds();
		// on hour chanage, update hours and shuffle state
		if( hours !== this.state.hours) {
			const hoursShuffle = !this.state.hoursShuffle;
			this.setState({
				hours,
				hoursShuffle
			});
		}
		// on minute chanage, update minutes and shuffle state
		if( minutes !== this.state.minutes) {
			const minutesShuffle = !this.state.minutesShuffle;
			this.setState({
				minutes,
				minutesShuffle
			});
		}
		// on second chanage, update seconds and shuffle state
		if( seconds !== this.state.seconds) {
			const secondsShuffle = !this.state.secondsShuffle;
			this.setState({
				seconds,
				secondsShuffle
			});
		}
	}

	render() {

    // state object destructuring
		const {
      hours,
      minutes,
      seconds,
      hoursShuffle,
      minutesShuffle,
      secondsShuffle
    } = this.state;

    return(
			<div className={Styles.flipClock}>
				<FlipUnitContainer
					unit={Styles.hours}
					digit={hours}
					shuffle={hoursShuffle}
					/>
				<FlipUnitContainer
					unit={Styles.minutes}
					digit={minutes}
					shuffle={minutesShuffle}
					/>
				<FlipUnitContainer
					unit={Styles.seconds}
					digit={seconds}
					shuffle={secondsShuffle}
					/>
			</div>
		);
	}
}
