const request = require('request');

const gameName = process.argv[2];
const BATCH = 100;
const LIMIT = 200;
const baseURL = 'https://api.twitch.tv/kraken/search/streams?query=';

const options = {
  url: 'https://api.twitch.tv/kraken/streams?game=League of Legends', // 測試用
  headers: {
    'Client-ID': 'qi079afnud4wnc8d9c5ii2x863sq7l',
    Accept: 'application/vnd.twitchtv.v5+json',
  },
};

function getAllStreams(game, dataCallback) {
  let allStreamsData = [];

  function getStreams(offset, limit, callback) { // eslint-disable-line
    options.url = `${baseURL}${game}&limit=${limit}&offset=${offset}`;
    request(options, (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      const rawData = JSON.parse(body);
      allStreamsData = allStreamsData.concat(rawData.streams);

      if (allStreamsData.length < LIMIT) {
        getStreams(offset + BATCH, BATCH, callback);
      } else {
        callback(allStreamsData);
      }
      return body
    });
  }
  // 初次呼叫
  getStreams(0, BATCH, dataCallback);
}

// 處理全部的資料
function handleData(data) {
  const result = data.slice(0, 200)
    .map(e => `${e._id} ${e.channel.name}`) // eslint-disable-line
    .join('\n');
  console.log(result);
}

getAllStreams(gameName, handleData);
