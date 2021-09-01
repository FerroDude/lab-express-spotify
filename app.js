require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
app.get('/', (request, response) => {
  response.render('home');
});

app.get('/artist-search', (request, response) => {
  let artist = request.query.artist;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      response.render('artist-search-results', {
        artists: data.body.artists.items
      });
      console.log(data.body.artists.items);
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );

  //
});

app.get('/albums/:id', (request, response) => {
  let id = request.params.id;
  spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
      response.render('albums-results', {
        albums: data.body.items
      });
      console.log(data.body);
    })
    .catch((err) =>
      console.log('The error while searching albums occurred: ', err)
    );

  //
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
