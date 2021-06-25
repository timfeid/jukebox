import PropTypes from 'prop-types';
import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  svg: {
    fill: 'currentcolor',
  },
});

const WeatherIcon = ({ title, path, size, viewBox }) => {

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={viewBox}
    >
      <title>{title}</title>
      <path d={path} />
    </svg>
  );
};

WeatherIcon.propTypes = {
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  viewBox: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number,
};

WeatherIcon.defaultProps = {
  color: '#4BC4F7',
  size: 40,
  viewBox: '0 -5 35 40',
};

export default WeatherIcon;
