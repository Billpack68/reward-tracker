Three endpoints:

/rewards
- get /rewards: returns the current value of rewards
- put /rewards: updates the current value of rewards

/habits
- get /habits: returns all habits in the database
- post /habits: creates a new habit and adds it to the database
- put /habits/:id: updates habit with id :id
- delete /habits/:id: deletes habit with id :id

/completions
- get /completions: returns completions for all habits for the last 7 days
- get /completions/habit/:id: returns completions for habit with id :id for the last 7 days
- post /completions: records a new completion (no ID needed in URL)
- post /completions/habit/:id: records a completion for a specific habit

/completions/:id
- put /completions/:id: updates a specific completion (if needed)
- delete /completions/:id: deletes a specific completion