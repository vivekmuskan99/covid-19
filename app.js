const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// MySQL database connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'Covid19',
});

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Express routes
app.get('/', (req, res) => {
  console.log('Request received for root route');
  // Fetch data from the database and render the EJS page
  connection.query('SELECT * FROM Covid_details ORDER BY No_of_Positive ASC', (err, rows) => {
    if (err) {
      console.error('Error fetching data from the database:', err);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Data fetched successfully:', rows);
    res.render('index', { data: rows });
  });
});

app.get('/insert', (req, res) => {
  res.render('insert');
});

app.post('/insert', (req, res) => {
  // Extract data from the form and insert it into the database
  const {
    State_Name,
    Date_of_Record,
    No_of_Samples,
    No_of_Deaths,
    No_of_Positive,
    No_of_Negative,
    No_of_Discharge,
  } = req.body;

  const query = `INSERT INTO Covid_details 
    (State_Name, Date_of_Record, No_of_Samples, No_of_Deaths, No_of_Positive, No_of_Negative, No_of_Discharge) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  connection.query(
    query,
    [State_Name, Date_of_Record, No_of_Samples, No_of_Deaths, No_of_Positive, No_of_Negative, No_of_Discharge],
    (err, result) => {
      if (err) {
        console.error('Error inserting data into the database:', err);
        return res.status(500).send('Internal Server Error');
      }
      console.log('Data inserted successfully');
      res.redirect('/');
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
