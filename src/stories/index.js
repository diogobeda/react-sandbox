import React, { Component } from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import styled from "styled-components";
import format from "date-fns/format";

import Datepicker from "../components/Datepicker";

const monthStrings = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro"
];

const weekDaysStrings = ["D", "S", "T", "Q", "Q", "S", "S"];

const MonthTitle = styled.div`
  width: 100%;
  text-align: center;
`;

const MonthView = styled.div`
  display: flex;
  flex-direction: column;
`;

const WeekRow = styled.div`
  height: 30px;
  display: flex;
  justify-content: center;
`;

const DayCell = styled.p`
  margin: 0 5px;
  min-width: 20px;
  cursor: pointer;
  outline: none;
  ${props => props.grayed && "opacity: 0.2;"};
  ${props =>
    props.selected &&
    `
      color: #fff;
      background: #000;
    `};
  ${props => props.highlighted && !props.selected && "background: #f4f4f4;"};
`;

const stories = storiesOf("Datepicker with render prop", module);

stories.add("default", () => (
  <Datepicker
    value={new Date()}
    onChange={action("onChange")}
    render={({
      selectedDate,
      highlightedDate,
      currentMonthWeeks,
      previousMonthWeeks,
      nextMonthWeeks,
      getDayProps
    }) => (
      <MonthView>
        <MonthTitle>
          {monthStrings[highlightedDate.getMonth()]} -{" "}
          {highlightedDate.getFullYear()}
        </MonthTitle>
        <WeekRow>
          {weekDaysStrings.map((day, index) => (
            <DayCell key={index}>{day}</DayCell>
          ))}
        </WeekRow>
        {currentMonthWeeks.map((week, index) => (
          <WeekRow key={index}>
            {week.map(day => (
              <DayCell
                key={day.toJSON()}
                grayed={
                  day.getMonth() !== highlightedDate.getMonth() ||
                  day.getFullYear() !== highlightedDate.getFullYear()
                }
                selected={
                  selectedDate &&
                  day.toDateString() === selectedDate.toDateString()
                }
                highlighted={
                  highlightedDate &&
                  day.toDateString() === highlightedDate.toDateString()
                }
                {...getDayProps(day)}
              >
                {day.getDate()}
              </DayCell>
            ))}
          </WeekRow>
        ))}
      </MonthView>
    )}
  />
));

class DatePickerWithInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: undefined,
      inputValue: ""
    };
  }

  handleInputChange = event => {
    const dateRegEx = /^\d{2}\/\d{2}\/\d{4}$/;
    const { value } = event.target;

    const date = new Date(value);
    if (dateRegEx.test(value) && date.toDateString() !== "Invalid Date") {
      this.setState({
        date: new Date(value),
        inputValue: format(value, "MM/DD/YYYY")
      });
    } else {
      this.setState({ inputValue: value });
    }
  };

  handleDatepickerChange = value => {
    this.setState({
      date: value,
      inputValue: format(value, "MM/DD/YYYY")
    });
  };

  render() {
    return (
      <div>
        <input
          type="text"
          onChange={this.handleInputChange}
          value={this.state.inputValue}
        />
        <Datepicker
          value={this.state.date}
          onChange={this.handleDatepickerChange}
          render={({
            selectedDate,
            highlightedDate,
            currentMonthWeeks,
            previousMonthWeeks,
            nextMonthWeeks,
            getDayProps
          }) => (
            <MonthView>
              <MonthTitle>
                {monthStrings[highlightedDate.getMonth()]} -{" "}
                {highlightedDate.getFullYear()}
              </MonthTitle>
              <WeekRow>
                {weekDaysStrings.map((day, index) => (
                  <DayCell key={index}>{day}</DayCell>
                ))}
              </WeekRow>
              {currentMonthWeeks.map((week, index) => (
                <WeekRow key={index}>
                  {week.map(day => (
                    <DayCell
                      key={day.toJSON()}
                      grayed={
                        day.getMonth() !== highlightedDate.getMonth() ||
                        day.getFullYear() !== highlightedDate.getFullYear()
                      }
                      selected={
                        selectedDate &&
                        day.toDateString() === selectedDate.toDateString()
                      }
                      highlighted={
                        highlightedDate &&
                        day.toDateString() === highlightedDate.toDateString()
                      }
                      {...getDayProps(day)}
                    >
                      {day.getDate()}
                    </DayCell>
                  ))}
                </WeekRow>
              ))}
            </MonthView>
          )}
        />
      </div>
    );
  }
}

stories.add("with input", () => <DatePickerWithInput />);
