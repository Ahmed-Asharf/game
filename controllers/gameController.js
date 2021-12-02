const connection = require('../connect');

const sendResponse = (message, statusCode, res, isStatus) => {
  return res.status(statusCode).json({
    status: isStatus,
    data: {
      games: message,
    },
  });
};

exports.createGame = (req, res) => {
  const { game_id, game_Name } = req.body;

  const sql = `insert into games(game_id,game_Name) values (?)`;

  const values = [game_id, game_Name];

  connection.query(sql, [values], (err, docs) => {
    if (err) {
      return sendResponse(false, 400, res, 'fail');
    }
    return sendResponse(true, 201, res, 'success');
  });
};

exports.deleteGame = (req, res) => {
  const { id } = req.params;

  const sql = `delete from games where game_id = ?`;

  connection.query(sql, [id], (err, docs) => {
    if (docs.affectedRows === 0 || err) {
      return sendResponse(`No Game found with that '${id}' `, 404, res, 'fail');
    }
    return sendResponse(null, 204, res, 'success');
  });
};

exports.getAll = (req, res) => {
  const sql = `select * from games`;
  connection.query(sql, (err, docs) => {
    if (err) {
      return sendResponse('No Games Yet', 404, res, 'fail');
    }
    return sendResponse(docs, 200, res, 'success');
  });
};

exports.updateGame = (req, res) => {
  const { game_Name } = req.body;
  const { id } = req.params;
  const sql = `update games set game_Name = ? where game_id = ?`;

  connection.query(sql, [game_Name, id], (err, docs) => {
    if (docs.affectedRows === 0 || err) {
      return sendResponse(false, 400, res, 'fail');
    }
    return sendResponse(true, 200, res, 'success');
  });
};

exports.getOne = (req, res) => {
  const { id } = req.params;

  const sql = 'select * from games where game_id = ?';

  connection.query(sql, [id], (err, docs) => {
    if (docs.length === 0 || err) {
      return sendResponse(
        `No Games found with that '${id}' `,
        404,
        res,
        'fail'
      );
    }
    return sendResponse(docs, 200, res, 'success');
  });
};
