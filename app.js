require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

// Our routes go here:
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.get('/', (req,res) => {
  res.render('home')
})

app.get('/artist-search', (req,res) => {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then(data => {
      res.render('artist-search-results', {
        artistItems: data.body.artists.items
      })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req,res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
      res.render('albums', {
        albums: data.body.items
      })
    })
    .catch(err => console.log('The error while viewing albums occurred: ', err));
})

app.get('/tracks/:id', (req,res) => {
  spotifyApi
  .getAlbumTracks(req.params.id)
  .then(data => {
    res.render('tracks', {
      songs: data.body.items
    })
  })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
