const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Patient = require('./models/patient');
const Doctor = require('./models/doctor');
const Appointment = require('./models/appointment');
const Leave = require('./models/leave');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/hospital-management', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/register/patient', (req, res) => {
  res.render('patient-register');
});

app.post('/register/patient', (req, res) => {
  const patient = new Patient({
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    address: req.body.address,
    phone: req.body.phone
  });

  patient.save((err, patient) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error registering patient');
    } else {
      res.redirect('/');
    }
  });
});

app.get('/register/doctor', (req, res) => {
  res.render('doctor-register');
});

app.post('/register/doctor', (req, res) => {
  const doctor = new Doctor({
    name: req.body.name,
    specialization: req.body.specialization
  });

  doctor.save((err, doctor) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error registering doctor');
    } else {
      res.redirect('/');
    }
  });
});

app.get('/schedule-appointment', (req, res) => {
  Patient.find({}, (err, patients) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching patients');
    } else {
      Doctor.find({}, (err, doctors) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error fetching doctors');
        } else {
          res.render('schedule-appointment', { patients, doctors });
        }
      });
    }
  });
});

app.post('/schedule-appointment', (req, res) => {
  const appointment = new Appointment({
    patient: req.body.patient,
    doctor: req.body.doctor,
    date: req.body.date,
    time: req.body.time
  });

  appointment.save((err, appointment) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error scheduling appointment');
    } else {
      res.redirect('/');
    }
  });
});

app.get('/leave-application', (req, res) => {
  Doctor.find({}, (err, doctors) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching doctors');
    } else {
      res.render('leave-application', { doctors });
    }
  });
});

app.post('/leave-application', (req, res) => {
  const leave = new Leave({
    doctor: req.body.doctor,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    reason: req.body.reason
  });

  leave.save((err, leave) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error applying for leave');
    } else {
      res.redirect('/');
    }
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});