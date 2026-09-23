const db = require('./db');

const rewardsModel = {
  getPoints: () => {
    return new Promise((resolve, reject) => {
      db.get('SELECT points FROM rewards WHERE id = 1', (err, row) => {
        if (err) reject(err);
        else resolve(row ? row.points : 0);
      });
    });
  },

  updatePoints: (points) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT OR REPLACE INTO rewards (id, points) VALUES (1, ?)', [points], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }
};

module.exports = rewardsModel;