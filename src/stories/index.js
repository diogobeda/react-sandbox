import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import styled from "styled-components";

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

storiesOf("Datepicker with render prop", module).add("default", () => (
  <Datepicker
    value={new Date()}
    onChange={action("onChange")}
    continuous
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
