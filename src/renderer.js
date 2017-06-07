// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// Versions
// console.log('electron', process.versions.electron)
// console.log('chrome', process.versions.chrome)
// console.log('node', process.versions.node)

const electron = require('electron')
const spotify = require('spotify-node-applescript')

// Controls
const previous = document.getElementById('js-previous')
const playPause = document.getElementById('js-playPause')
const playPauseIcon = document.getElementById('js-playPauseIcon')
const next = document.getElementById('js-next')
const openSpotify = document.getElementById('js-open-spotify')

// Components
const art = document.getElementById('js-art')
const trackArtist = document.getElementById('js-trackArtist')
const trackName = document.getElementById('js-trackName')

/**
 * Update UI with album art, artist, and track info
 */
const setTrackDetails = () =>
  spotify.getTrack((err, track) => {
    if (track) {
      // Album art
      art.style.backgroundImage = `url(${track.artwork_url})`
      // Artist
      trackArtist.innerText = track.artist
      // Title
      trackName.innerText = track.name
    } else {
      populateDetails() // this catches a bug in the notification listener when closing Spotify
    }
  })

/**
 * Update UI play / pause icon based on current player state
 */
const setState = () =>
  spotify.getState((err, state) => {
    if (state) {
      switch (state.state) {
        case 'playing':
          playPauseIcon.classList.remove('fa-play')
          playPauseIcon.classList.add('fa-pause')
          document.body.classList.remove('is-paused')
          break
        case 'paused':
          playPauseIcon.classList.remove('fa-pause')
          playPauseIcon.classList.add('fa-play')
          document.body.classList.add('is-paused')
          break
        default:
          break
      }
    }
  })

/**
 * Populate the details for the UI. (the loader script)
 */
const populateDetails = () => {
  spotify.isRunning((err, isRunning) => {
    if (isRunning) {
      document.body.classList.remove('spotify-not-open')
      setTrackDetails()
      setState()
    } else {
      document.body.classList.add('spotify-not-open')
    }
  })
}

// Load...
populateDetails()

// Listen for track/status changes and update
electron.ipcRenderer.on('notification', function(event, message) {
  populateDetails()
})

// Bind actions to controls
previous.addEventListener('click', () => spotify.previous())
playPause.addEventListener('click', () => spotify.playPause())
next.addEventListener('click', () => spotify.next())

// openSpotify.addEventListener('click', () => spotify.playPause())
