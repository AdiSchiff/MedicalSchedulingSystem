const express = require('express');
var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json({limit: "10mb"}));

const cors = require('cors');
app.use(cors());

const custumeEnv = require('custom-env');
custumeEnv.env(process.env.NODE_ENV, './config');
console.log(process.env.CONNECTION_STRING)
console.log(process.env.PORT)

const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.static('public'));

const user = require('./routes/Users')
app.use('/api/Users',user);

const login = require('./routes/Login')
app.use('/api/Tokens',login);

const mf = require('./routes/Medical_fields')
app.use('/api/MedFields',mf);

const doctor = require('./routes/Doctors')
app.use('/api/Doctors',doctor);

const appointment = require('./routes/Appointments')
app.use('/api/Chats',appointment);

app.listen(process.env.PORT);
