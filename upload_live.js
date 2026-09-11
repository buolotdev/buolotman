const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();

const config = {
  host: '217.174.148.65',
  port: 6543,
  username: 'boulotman',
  password: '&;WjCCq$Vfl3~RSR'
};

conn.on('ready', () => {
  console.log('SSH Connection ready, starting SFTP...');
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('SFTP Error:', err);
      conn.end();
      process.exit(1);
    }
    
    const localPath = 'c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/backend/utils/email_service.py';
    const remotePath = '/home/boulotman/boulotman-backend/utils/email_service.py';
    
    sftp.fastPut(localPath, remotePath, (err) => {
      if (err) {
        console.error('Upload Error:', err);
        conn.end();
        process.exit(1);
      }
      console.log('SUCCESS: email_service.py uploaded to /home/boulotman/boulotman-backend/utils/email_service.py');
      conn.end();
      process.exit(0);
    });
  });
}).on('error', (err) => {
  console.error('SSH Error:', err);
  process.exit(1);
}).connect(config);
