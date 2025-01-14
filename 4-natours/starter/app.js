const express = require('express');
const fs = require('fs');

const app = express();

// Middleware: function in the middle of request and response, can modify request and response
app.use(express.json());

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
    results: tours?.length || 1,
    data: {
      tours,
    },
  });
});

// The route should be matched exactly, use ? to make some params optional
app.get('/api/v1/tours/:id/:x/:y?', (req, res) => {
  console.log(req.params);

  // a nice trick to convert string to number
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // variables made by const and let cannot be accessed before where they are declared
  // if (id > tours.length) {
  if (!tour) {
    // use return to stop the function immediately
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  //console.log(req.body);
  const id = tours[tours.length - 1].id + 1;

  const newTour = Object.assign({ id }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log('Server is running on port 3000...');
});
