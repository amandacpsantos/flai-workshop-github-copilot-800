#!/bin/bash

mongosh --quiet --eval "
use octofit_db
print('\n=== OctoFit Database Status ===\n')
print('Collections:', db.getCollectionNames().length)
db.getCollectionNames().forEach(c => print('  ✓', c))
print('\nDocument Counts:')
print('  Users........:', db.users.countDocuments({}))
print('  Teams........:', db.teams.countDocuments({}))
print('  Activities...:', db.activities.countDocuments({}))
print('  Leaderboard..:', db.leaderboard.countDocuments({}))
print('  Workouts.....:', db.workouts.countDocuments({}))
print('\nTop 3 Athletes:')
db.leaderboard.find().sort({rank: 1}).limit(3).forEach(e => 
  print('  ' + e.rank + '. ' + e.user_name + ' (' + e.total_calories + ' cal)')
)
print('\nEmail Index Check:')
db.users.getIndexes().forEach(idx => {
  if (idx.key.email) print('  ✓ Unique index on email:', idx.unique ? 'YES' : 'NO')
})
print('\n=== Setup Complete! ===\n')
"
