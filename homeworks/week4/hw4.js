const request = require('request');

const options = {
  url: 'https://api.twitch.tv/kraken/games/top',
  headers: {
    'Client-ID': 'qi079afnud4wnc8d9c5ii2x863sq7l',
    Accept: 'application/vnd.twitchtv.v5+json',
  },
};

function getTopGames() {
  request(options, (err, req, body) => {
    const rawData = JSON.parse(body);
    const result = rawData.top.map(e => `${e.viewers} ${e.game.name}`).join('\n');
    console.log(result);
  });
}

getTopGames();
