#!/bin/bash
LOG="/home/z/my-project/download/w123-clips/batch.log"
STATE="/home/z/my-project/download/w123-clips/state.json"

cd /home/z/my-project/download/w123-clips

# Try creating clip 1
RESULT=$(node create_task.mjs 2>&1)
TS=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

if echo "$RESULT" | grep -q "Task ID:"; then
    TASK_ID=$(echo "$RESULT" | grep "Task ID:" | awk '{print $3}')
    echo "$TS SUCCESS: Task created - $TASK_ID" >> "$LOG"
    echo "{\"taskId\": \"$TASK_ID\", \"status\": \"submitted\", \"timestamp\": \"$TS\"}" > clip1_task.json
else
    echo "$TS RETRY: Still rate limited or error - $(echo "$RESULT" | tail -1)" >> "$LOG"
fi
