#!/bin/bash
sudo NODE_ENV=production PORT=80 pm2 restart app.js
sudo pm2 monit
