const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
//db["Spring 2024 Courses"].find({"COURSE": "ANTH201"}) to find courses in 
// Enable CORS for requests from your React development server
app.use(cors({
  origin: 'http://localhost:3000' // Adjust this if your React server is on a different port
}));

app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/school', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Define a Mongoose schema and model for the courses
const CourseSchema = new mongoose.Schema({
  COURSE: String,
  INSTRUCTOR: String,
  CRN: Number,
  'CRN CAMPUS': String,
  'COURSE TITLE': String,
  BUILDING: String,
  ROOM: String,
  'START DATE': String,
  'END DATE': String,
  COURSE_TEXT: String
}, { collection: 'Spring 2024 Courses'}); // Explicitly set the collection name if it differs from the model name
const Course = mongoose.model('COURSE', CourseSchema);

app.get('/search', async (req, res) => {
  console.log(req.query.COURSE);  // This should log 'ANTH201' or whatever is passed
  const { COURSE } = req.query;
  const query = COURSE ? { COURSE: new RegExp(COURSE, 'i') } : {};
  const courses = await Course.find(query);
  res.json(courses);
});


// Set the port from environment or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


