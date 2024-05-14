import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { range, addDateBy, areDatesSame, getMonday } from "./utils";
import CourseDetails from './components/DisplayCourseComponent';

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const HOUR_HEIGHT = 60; // Adjusted for better visibility
const HOUR_MARGIN_TOP = 15;

const Schedule = () => {

  const [courses, setCourses] = useState([]); // Initialize the courses state with an empty array

  const [mondayDate] = useState(getMonday());
  const [events, setEvents] = useState([]);
  const [theme, setTheme] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showCalendar, setShowCalendar] = useState(true); // State to control calendar visibility

  useEffect(() => {
    fetch('http://localhost:5000/search') // URL of your API endpoint
      .then(response => response.json())
      .then(data => setCourses(data))
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  const hourNow = new Date().getHours();
  const minutesNow = new Date().getMinutes();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;  // Added trim to check for non-empty strings more effectively
    try {
      const response = await fetch(`http://localhost:5000/search?COURSE=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSearchResults(data); // Assuming the backend returns an array of course names
      setShowCalendar(false); // Hide the calendar to show the search results
    } catch (error) {
      console.error("Error searching:", error);
    }
  };
  

  const onAddEvent = (dayIndex) => {
    const text = prompt("Enter event title:");
    if (!text) return;

    const from = parseInt(prompt("Enter start hour:"));
    if (isNaN(from)) return;

    const to = parseInt(prompt("Enter end hour:"));
    if (isNaN(to) || from >= to) return;

    const newEvent = {
      text,
      date: addDateBy(mondayDate, dayIndex),
      from,
      to,
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };
  const toggleCalendarView = () => {
    setShowCalendar(true);
    setSearchResults([]); // Optionally clear results when going back
  };
  
  // In your return section, add a button to allow toggling back:
  return (
    <>
      <FlexBox>
        <p>Today: {new Date().toDateString()}</p>
        <button onClick={toggleTheme}>
          Toggle Theme: {theme === "light" ? "Dark" : "Light"}
        </button>
        <SearchInput
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <SearchButton onClick={handleSearch}>Search</SearchButton>
        { !showCalendar && (
          <button onClick={toggleCalendarView}>Back to Calendar</button>
        )}
        <ChatButton
          onClick={() => window.open("https://discord.gg/JZy4AP5EVj", "_blank")}
        >
          Chat
        </ChatButton>
        <ReportButton
          onClick={() =>
            window.open(
              "https://github.com/nekoism/Montgomery-College-Schedule-Creator/issues",
              "_blank"
            )
          }
        >
          Report Bugs
        </ReportButton>
      </FlexBox>
  
      {showCalendar ? (
        <Wrapper theme={theme}>
          <BackgroundGrid theme={theme} />
          <HGrid first="30px" cols={1}>
            <VGrid rows={24}>
              {range(24).map((hour) => (
                <Hour key={hour}>{hour}</Hour>
              ))}
            </VGrid>
            <HGrid cols={7}>
              {DAYS.map((day, index) => (
                <DayWrapper key={index} onDoubleClick={() => onAddEvent(index)}>
                  <p>{day}</p>
                  {events.map((event, eventIndex) =>
                    areDatesSame(addDateBy(mondayDate, index), event.date) ? (
                      <Event
                        key={eventIndex}
                        howlong={event.to - event.from}
                        date={event.date}
                        $fron={true}
                        theme={theme}
                        fromTop={event.from * HOUR_HEIGHT + HOUR_MARGIN_TOP}
                        extendedHeight={
                          event.to * HOUR_HEIGHT - event.from * HOUR_HEIGHT - 10
                        }
                      >
                        {event.text}
                      </Event>
                    ) : null
                  )}
                </DayWrapper>
              ))}
            </HGrid>
          </HGrid>
          <HourLine
            style={{
              top: `${
                hourNow * HOUR_HEIGHT +
                (minutesNow / 60) * HOUR_HEIGHT +
                HOUR_MARGIN_TOP
              }px`,
            }}
          />
        </Wrapper>
      ) : (
        <SearchResults>
          <CourseDetails courses={searchResults} />
        </SearchResults>
      )}
    </>
  );
  
}
const Wrapper = styled.div`
  width: calc(100% - 30px);
  border: 1px solid ${({ theme }) => (theme === "light" ? "black" : "white")};
  margin: 15px;
  position: relative;
  background: ${({ theme }) => (theme === "light" ? "white" : "black")};
  color: ${({ theme }) => (theme === "light" ? "black" : "white")};
  overflow: hidden; // Ensuring no overflow
  position: relative;
`;

const BackgroundGrid = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: repeat(24, ${HOUR_HEIGHT}px); // Each hour row
  grid-template-columns: repeat(7, 1fr); // Each day column
  border-left: 1px solid ${({ theme }) => (theme === 'light' ? '#ddd' : '#444')};
  border-top: 1px solid ${({ theme }) => (theme === 'light' ? '#ddd' : '#444')};
  z-index: 0;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border-right: 1px solid ${({ theme }) => (theme === 'light' ? '#ddd' : '#444')};
    border-bottom: 1px solid ${({ theme }) => (theme === 'light' ? '#ddd' : '#444')};
  }
`;

const HGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr); // Ensuring 7 columns for the days of the week
  position: relative;
  z-index: 1; // Make sure it's above the BackgroundGrid
  // grid-template-columns: ${({ first }) => first || ""} repeat(
  //     ${({ cols }) => cols},
  //     1fr
  //   );
  // grid-gap: 1px;
`;

const VGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(${({ rows }) => rows}, 1fr);
  &:first-child {
    margin-top: ${HOUR_MARGIN_TOP}px;
  }
`;

const DayWrapper = styled.span`
  border: 1px solid ${({ theme }) => (theme === "light" ? "black" : "white")};
  display: relative;
`;

const Hour = styled.span`
  height: ${HOUR_HEIGHT}px;
  display: flex;
  align-items: center;
  font-size: 0.8em;
`;


const HourLine = styled.div`
  position: absolute;
  width: 100%;
  top: ${({ fromTop }) => fromTop}px;
  border: 1px solid ${({ theme }) => (theme === "light" ? "black" : "white")};
`;

const FlexBox = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 1.2rem;
  margin-top: 20px;
`;

const Event = styled.div`
  position: absolute;
  padding: 5px;
  border-radius: 6px;
  margin: 0px 5px;
  ${({ fromTop, extendedHeight }) => css`
    top: ${fromTop}px;
    height: ${extendedHeight}px;
  `}
  ${({ date, theme }) => css`
    background: ${theme === "light" ? "green" : "darkgreen"};
    color: ${theme === "light" ? "white" : "black"};
  `}
`;

const SearchInput = styled.input`
  padding: 5px;
  margin: 0 10px;
`;

const SearchButton = styled.button`
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
`;

const ChatButton = styled(SearchButton)`
  background-color: #7289da;
  color: white;
`;

const ReportButton = styled(SearchButton)`
  background-color: #ff6347;
  color: white;
`;

const SearchResults = styled.div`
  padding: 20px;
  background: ${({ theme }) => (theme === "light" ? "white" : "#333")};
  color: ${({ theme }) => (theme === "light" ? "black" : "white")};
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export default Schedule;
