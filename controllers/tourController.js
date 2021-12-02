const connection = require('../connect');

const sendResponse = (message, statusCode, res, isStatus) => {
  return res.status(statusCode).json({
    status: isStatus,
    data: {
      tournament: message,
    },
  });
};

exports.createTournament = (req, res) => {
  const { tour_id, startDate, endDate, prize } = req.body;

  const sql = `insert into tournaments(tour_id,startDate,endDate,prize) values (?)`;

  const values = [tour_id, startDate, endDate, prize];

  connection.query(sql, [values], (err, docs) => {
    if (err) {
      return sendResponse(err.message, 400, res, 'fail');
    }
    return sendResponse(true, 201, res, 'success');
  });
};

exports.updateTournament = (req, res) => {
  const { startDate, endDate, prize, game_id } = req.body;
  const { id } = req.params;
  const sql = `update tournaments set startDate = ?, endDate = ?, prize = ?, game_id = ? where tour_id = ?`;

  const values = [startDate, endDate, prize, game_id, id];

  connection.query(sql, values, (err, docs) => {
    if (docs.affectedRows === 0 || err) {
      return sendResponse(false, 400, res, 'fail');
    }
    return sendResponse(true, 200, res, 'success');
  });
};

exports.deleteTournament = (req, res) => {
  const { id } = req.params;

  const sql = `delete from tournaments where tour_id = ?`;

  connection.query(sql, [id], (err, docs) => {
    if (docs.affectedRows === 0 || err) {
      return sendResponse(
        `No tournament found with that '${id}' `,
        404,
        res,
        'fail'
      );
    }
    return sendResponse(null, 204, res, 'success');
  });
};

exports.getOne = (req, res) => {
  const { id } = req.params;

  const sql = 'select * from tournaments where tour_id = ?';

  connection.query(sql, [id], (err, docs) => {
    if (docs.length === 0 || err) {
      return sendResponse(
        `No tournament found with that '${id}' `,
        404,
        res,
        'fail'
      );
    }
    return sendResponse(docs, 200, res, 'success');
  });
};

exports.getAll = (req, res) => {
  const sql = `select * from tournaments`;
  connection.query(sql, (err, docs) => {
    if (err) {
      return sendResponse('No tournaments Yet', 404, res, 'fail');
    }
    return sendResponse(docs, 200, res, 'success');
  });
};
