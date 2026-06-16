const fs = require('fs');
const ytdl = require('@distube/ytdl-core');

const videoUrl = 'https://youtu.be/wui-1EYGuT4?si=MpOVm5xKo17mnAuQ';
const output = 'music.mp3';

console.log('Downloading music...');
ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' })
  .pipe(fs.createWriteStream(output))
  .on('finish', () => {
    console.log('Download complete!');
  })
  .on('error', (err) => {
    console.error('Error:', err);
  });
