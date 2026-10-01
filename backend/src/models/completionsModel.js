const db = require('./db');

const completionsModel = {
  getAllCompletions: () => {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT c.*, h.name as habit_name 
        FROM completions c 
        JOIN habits h ON c.habit_id = h.id
        ORDER BY c.completed_time DESC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  getCompletionsByHabitId: (habitId) => {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT c.*, h.name as habit_name 
        FROM completions c 
        JOIN habits h ON c.habit_id = h.id
        WHERE c.habit_id = ?
        ORDER BY c.completed_time DESC
      `, [habitId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  createCompletion: (completionData) => {
    const { habit_id, completed_date, previous_rewards, new_rewards } = completionData;
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO completions (habit_id, completed_date, previous_rewards, new_rewards) VALUES (?, ?, ?, ?)',
        [habit_id, completed_date, previous_rewards, new_rewards],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  },

  updateCompletion: (id, completionData) => {
    const { habit_id, completed_date, previous_rewards, new_rewards } = completionData;
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE completions SET habit_id = ?, completed_date = ?, previous_rewards = ?, new_rewards = ? WHERE id = ?',
        [habit_id, completed_date, previous_rewards, new_rewards, id],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  },

  deleteCompletion: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM completions WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }
};

module.exports = completionsModel;