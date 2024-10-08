require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extends: false}));
app.use(cookieParser());
app.use(cors({
   credentials: true,
   origin: process.env.CLIENT_URL
}));
app.use('/api', router);
app.use(errorMiddleware);

const start = () => {
   try {

      app.listen(PORT, () => console.log('Server started on port = ' + PORT))
   } catch (e) {
      console.log(e);
   }
}

start();