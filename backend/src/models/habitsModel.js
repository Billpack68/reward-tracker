const db = require('./db');

const habitsModel = {
  getAllHabits: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM habits', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  createHabit: (habitData) => {
    const { name, description, value, max_completions_per_day } = habitData;
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO habits (name, description, value, max_completions_per_day, completed_today) VALUES (?, ?, ?, ?, ?)',
        [name, description, value, max_completions_per_day, 0],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  },

  updateHabit: (id, habitData) => {
    const { name, description, value, max_completions_per_day } = habitData;
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE habits SET name = ?, description = ?, value = ?, max_completions_per_day = ? WHERE id = ?',
        [name, description, value, max_completions_per_day, id],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  },

  deleteHabit: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM habits WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }
};

module.exports = habitsModel;