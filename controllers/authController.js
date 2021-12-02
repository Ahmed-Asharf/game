const connection = require('../connect');
const bcrypt = require('bcryptjs');
const Email = require('../utils/email');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const sendResponse = (message, statusCode, res, isStatus) => {
  return res.status(statusCode).json({
    status: isStatus,
    data: {
      message: message,
    },
  });
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const sql = 'select * from players where email = ?';
    connection.query(sql, email, async (err, docs) => {
      if (err) {
        return (sendResponse = (err.message, 400, res, 'Fail'));
      } else {
        if (docs.length > 0) {
          const compare = await bcrypt.compare(password, docs[0].password);
          if (compare)
            return (sendResponse = ('Login SuccessFul', 200, res, 'success'));
          else
            return (sendResponse =
              ('Email and Password does not match', 206, res, 'Fail'));
        } else
          return (sendResponse =
            ('Email and Password does not match', 206, res, 'Fail'));
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};

exports.signupUser = async (req, res) => {
  req.body.password = await bcrypt.hash(req.body.password, 8);
  const { userName, password, phoneNumber, email } = req.body;
  const player_id = userName.slice(0, 2) + phoneNumber.slice(0, 2);
  const sql = `insert into players(player_id,userName,password,phoneNumber,email,isBanned,noOfTournaments) values (?)`;
  const values = [player_id, userName, password, +phoneNumber, email, false, 0];
  connection.query(sql, [values], async (err, docs) => {
    if (err) {
      return (sendResponse = (err.message, 400, res, 'Fail'));
    }
    await new Email(req.body).sendWelcome();
    return (sendResponse = ('Registration SuccessFul', 200, res, 'Success'));
  });
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      throw new Error('You are not logged in! Please log in to get access');
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    if (!decoded) throw new Error('Invalid token. Please log in again!');
    const sql = 'select * from administration where userName = ?';
    connection.query(sql, decoded.userName, async (err, docs) => {
      try {
        if (err || docs.length === 0) {
          throw new Error('The user belonging to token is no longer exist');
        }
      } catch (err) {
        return res.status(401).json({
          status: 'fail',
          message: err.message,
        });
      }
    });
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};
