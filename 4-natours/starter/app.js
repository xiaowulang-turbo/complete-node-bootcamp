const express = require('express');
const fs = require('fs');

const app = express();

// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello from the server side!',
//     app: 'Natours',
//   });
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
// console.log(tours);

// Only the callback function is running in event loop
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    // only count when we have an array
    results: tours.length || 1,
    data: {
      tours,
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log('Server is running on port 3000...');
});
