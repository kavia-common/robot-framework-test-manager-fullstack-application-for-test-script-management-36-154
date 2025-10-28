#!/bin/bash
cd /home/kavia/workspace/code-generation/robot-framework-test-manager-fullstack-application-for-test-script-management-36-154/FrontendUI
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

