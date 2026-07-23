const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/Users/Akash Sundaram/Downloads/smart-medicine-reminder-a257b-firebase-adminsdk-fbsvc-388259608d.json', 'utf8'));
const envExample = fs.readFileSync('.env.example', 'utf8');
// Use single quotes for the env var value to avoid escaping issues in dotenv
const stringifiedJson = JSON.stringify(data);
const envContent = envExample.replace(
  'FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account"}',
  `FIREBASE_SERVICE_ACCOUNT_JSON='${stringifiedJson}'`
);
fs.writeFileSync('.env', envContent);
console.log('.env created successfully');
