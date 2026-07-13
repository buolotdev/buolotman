const { Client } = require('ssh2');

const conn = new Client();

const config = {
  host: '217.174.148.65',
  port: 6543,
  username: 'boulotman',
  password: '&;WjCCq$Vfl3~RSR'
};

const cmd = process.argv[2] || 'ls -la';

conn.on('ready', () => {
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('close', (code, signal) => {
      conn.end();
      process.exit(code);
    }).on('data', (data) => {
      process.stdout.write(data);
    }).stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
}).on('error', (err) => {
  console.error('SSH Error:', err);
  process.exit(1);
}).connect(config);
