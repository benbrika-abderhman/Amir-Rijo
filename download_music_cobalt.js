const fs = require('fs');
const https = require('https');

const data = JSON.stringify({
  url: 'https://youtu.be/wui-1EYGuT4',
  isAudioOnly: true,
  aFormat: 'mp3'
});

const options = {
  hostname: 'api.cobalt.tools',
  port: 443,
  path: '/api/json',
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      if (json.url) {
        console.log('Downloading from:', json.url);
        https.get(json.url, response => {
          const file = fs.createWriteStream('d:/amir/assets/music.mp3');
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log('Download completed successfully!');
          });
        });
      } else {
        console.error('Failed to get URL:', json);
      }
    } catch (e) {
      console.error('Error parsing JSON:', e, body);
    }
  });
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
