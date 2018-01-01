import React, { Component } from "react";
import PropTypes from "prop-types";
import addDays from "date-fns/add_days";
import addMonths from "date-fns/add_months";

const range = n => Array.apply(null, Array(n)).map((_, i) => i);

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const SPACE = 32;
const ENTER = 13;
const TAB = 9;

class Datepicker extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onChange: PropTypes.func.isRequired,
    render: PropTypes.func.isRequired,
    orientation: PropTypes.string
  };

  static defaultProps = {
    orientation: "horizontal"
  };

  constructor(props) {
    super(props);

    const today = new Date();
    this.state = {
      highlightedDate: props.value || today,
      currentMonthWeeks: this.buildWeeksFromDate(today),
      previousMonthWeeks: this.buildWeeksFromDate(addMonths(today, -1)),
      nextMonthWeeks: this.buildWeeksFromDate(addMonths(today, 1)),
      selectedDate: props.value
    };
  }

  componentDidMount() {
    this.highlightDate(this.state.highlightedDate);
  }

  getDaysInMonth(month, year) {
    const isLeapYear = (year % 4 === 0 && year % 100) || year % 400 === 0;

    switch (month) {
      case 1:
        return isLeapYear ? 29 : 28;
      case 3:
      case 5:
      case 8:
      case 10:
        return 30;
      default:
        return 31;
    }
  }

  buildWeeksFromDate(originalDate) {
    let weeksInMonth = 1;
    const daysInMonth = this.getDaysInMonth(
      originalDate.getMonth(),
      originalDate.getFullYear()
    );

    let currentWeek = 0;
    return range(daysInMonth)
      .map((day, index) => {
        const date = new Date(
          originalDate.getFullYear(),
          originalDate.getMonth()
        );
        date.setDate(day + 1);

        if (index > 0 && date.getDay() === 0) {
          weeksInMonth += 1;
        }

        return date;
      })
      .reduce((acc, day, index, array) => {
        const dayOfWeek = day.getDay();
        const currentMonth = day.getMonth();
        const currentYear = day.getFullYear();

        if (index === 0 && dayOfWeek !== 0) {
          const extraDays = range(dayOfWeek).map(index =>
            addDays(new Date(day), index - dayOfWeek)
          );

          acc[0] = extraDays;
        }

        if (dayOfWeek === 0 && index !== 0) {
          currentWeek += 1;
        }

        acc[currentWeek] = acc[currentWeek] || [];
        acc[currentWeek][dayOfWeek] = day;

        if (index === array.length - 1 && dayOfWeek !== 6) {
          const extraDays = range(6 - dayOfWeek).map(index =>
            addDays(new Date(day), index + 1)
          );

          acc[weeksInMonth - 1] = acc[weeksInMonth - 1] || [];
          acc[weeksInMonth - 1] = acc[weeksInMonth - 1].concat(extraDays);
        }

        return acc;
      }, []);
  }

  isPreviousMonthFromHighlighted(date) {
    const { highlightedDate } = this.state;
    const highlightMinusOneMonth = addMonths(highlightedDate, -1);

    return (
      date.getMonth() === highlightMinusOneMonth.getMonth() &&
      date.getFullYear() === highlightMinusOneMonth.getFullYear()
    );
  }

  isNextMonthFromHighlighted(date) {
    const { highlightedDate } = this.state;
    const highlightPlusOneMonth = addMonths(highlightedDate, 1);

    return (
      date.getMonth() === highlightPlusOneMonth.getMonth() &&
      date.getFullYear() === highlightPlusOneMonth.getFullYear()
    );
  }

  isSameMonthAsHighlighted(date) {
    const { highlightedDate } = this.state;

    return (
      date.getMonth() === highlightedDate.getMonth() &&
      date.getFullYear() === highlightedDate.getFullYear()
    );
  }

  highlightDate(date) {
    this.setState(
      ({ currentMonthWeeks, previousMonthWeeks, nextMonthWeeks }) => {
        if (this.isPreviousMonthFromHighlighted(date)) {
          return {
            highlightedDate: date,
            currentMonthWeeks: previousMonthWeeks,
            nextMonthWeeks: currentMonthWeeks,
            previousMonthWeeks: this.buildWeeksFromDate(addMonths(date, -1))
          };
        }

        if (this.isNextMonthFromHighlighted(date)) {
          return {
            highlightedDate: date,
            currentMonthWeeks: nextMonthWeeks,
            previousMonthWeeks: currentMonthWeeks,
            nextMonthWeeks: this.buildWeeksFromDate(addMonths(date, 1))
          };
        }

        if (this.isSameMonthAsHighlighted(date)) {
          return {
            highlightedDate: date
          };
        }

        return {
          highlightedDate: date,
          currentMonthWeeks: this.buildWeeksFromDate(date),
          nextMonthWeeks: this.buildWeeksFromDate(addMonths(date, 1)),
          previousMonthWeeks: this.buildWeeksFromDate(addMonths(date, -1))
        };
      },
      () => {
        if (document) {
          document.querySelector(`#${this.buildDayId(date)}`).focus();
        }
      }
    );
  }

  selectDate(date) {
    this.setState(
      ({ selectedDate }) => ({
        selectedDate: date
      }),
      () => {
        const { selectedDate } = this.state;
        this.highlightDate(date);

        if (date.toDateString() !== selectedDate.toDateString()) {
          this.props.onChange && this.props.onChange(date);
        }
      }
    );
  }

  handleDayClick = day => event => {
    this.selectDate(day);
  };

  handleDayKeyUp = day => event => {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      return this.selectDate(day);
    }

    if (event.keyCode === TAB) {
      return this.highlightDate(day);
    }

    const { highlightedDate } = this.state;
    switch (event.keyCode) {
      case UP:
        return this.highlightDate(addDays(highlightedDate, -7));
      case DOWN:
        return this.highlightDate(addDays(highlightedDate, 7));
      case LEFT:
        return this.highlightDate(addDays(highlightedDate, -1));
      case RIGHT:
        return this.highlightDate(addDays(highlightedDate, 1));
      default:
        return;
    }
  };

  buildDayId(day) {
    return `datepicker__${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
  }

  buildDayProps = day => {
    return {
      onClick: this.handleDayClick(day),
      onKeyUp: this.handleDayKeyUp(day),
      id: this.buildDayId(day),
      tabIndex: 0
    };
  };

  render() {
    const { render } = this.props;
    const {
      selectedDate,
      highlightedDate,
      currentMonthWeeks,
      previousMonthWeeks,
      nextMonthWeeks
    } = this.state;

    const today = new Date();
    return render({
      selectedDate,
      highlightedDate,
      currentMonthWeeks,
      previousMonthWeeks,
      nextMonthWeeks,
      getDayProps: this.buildDayProps
    });
  }
}

export default Datepicker;
