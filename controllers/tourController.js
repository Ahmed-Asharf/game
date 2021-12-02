const connection = require('../connect');
const multer = require('multer');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/tournaments');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `tournaments-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(err, false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTournamentsPhoto = upload.single('tournamentsPhoto');

const sendResponse = (message, statusCode, res, isStatus) => {
  return res.status(statusCode).json({
    status: isStatus,
    data: {
      tournament: message,
    },
  });
};

exports.createTournament = (req, res) => {
  let tournamentsPhoto = null;
  const { tour_id, startDate, endDate, prize, game_id, tournamentName } =
    req.body;
  if (req.file) {
    tournamentsPhoto = req.file.filename;
  }
  const sql = `insert into tournaments(tour_id,startDate,endDate,prize,game_id,tournamentName,tournamentsPhoto) values (?)`;
  const gameId = game_id ? game_id : null;
  const values = [
    tour_id,
    startDate,
    endDate,
    prize,
    gameId,
    tournamentName,
    tournamentsPhoto,
  ];

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
