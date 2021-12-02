const connection = require('../connect');
const bcrypt = require('bcryptjs');

const sendResponse = (message, statusCode, res, isStatus, token = '') => {
  return res.status(statusCode).json({
    status: isStatus,
    data: {
      token,
      message: message,
    },
  });
};

exports.adminLogin = (req, res) => {
  const { userName, password } = req.body;
  const sql = 'select * from administration where userName = ?';
  connection.query(sql, userName, async (err, docs) => {
    try {
      if (
        err ||
        docs.length === 0 ||
        !(await bcrypt.compare(password, docs[0].password))
      ) {
        throw new Error('Incorrect Email and Password');
      }
      const token = signToken(userName);
      return sendResponse('Login SuccessFul', 200, res, 'success', token);
    } catch (err) {
      return res.status(401).json({
        status: 'fail',
        message: err.message,
      });
    }
  });
};

exports.adminSignUp = async (req, res) => {
  req.body.password = await bcrypt.hash(req.body.password, 8);
  const { userName, password } = req.body;
  const sql = `insert into administration (userName,password) values (?)`;
  const values = [userName, password];
  connection.query(sql, [values], (err, docs) => {
    if (err) {
      return sendResponse(err.message, 400, res, 'Fail');
    }
    return sendResponse('New Admin Created', 200, res, 'Success');
  });
};

const signToken = (userName) =>
  jwt.sign({ userName }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// const createToken = (userName, statusCode, res) => {
//   const token = signToken(userName);
//   console.log(token);
// };
