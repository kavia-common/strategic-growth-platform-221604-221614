#!/bin/bash
cd /home/kavia/workspace/code-generation/strategic-growth-platform-221604-221614/sge_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

