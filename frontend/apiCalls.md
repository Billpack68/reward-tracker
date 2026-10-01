When the site loads:
get /rewards to get current rewards value
get /habits to get all habits in database and display them
get /completions - check which habits have been completed today and update their daily completions

When the user creates a new habit:
post /habits
get /habits for updated habits data (after creating a new habit)

When the user completes a habit:
post /completions - record the new completion (habit ID should be in request body)
get /rewards: get current rewards amount after completing a habit
