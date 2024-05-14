import React from 'react';

const CourseDetails = ({ courses }) => (
  <div>
    {courses.map((course, index) => (
      <div key={index} style={{ margin: '20px', padding: '10px', border: '1px solid gray' }}>
        <h4>{course['COURSE TITLE']} ({course.COURSE})</h4>
        <p>Instructor: {course.INSTRUCTOR}</p>
        <p>CRN: {course.CRN}</p>
        <p>Campus: {course['CRN CAMPUS']}</p>
        <p>Building: {course.BUILDING}, Room: {course.ROOM}</p>
        <p>Start Date: {course['START DATE']} - End Date: {course['END DATE']}</p>
        <p>{course.COURSE_TEXT}</p>
      </div>
    ))}
  </div>
);

export default CourseDetails;
