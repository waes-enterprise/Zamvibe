#!/bin/bash
cd /home/z/my-project
export DATABASE_URL="file:/home/z/my-project/db/custom.db"
while true; do
  npx next start -p 3000 2>&1
  sleep 1
done
