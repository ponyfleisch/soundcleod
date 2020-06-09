'use strict'

// it's currently impossible to expose chrome's native media session interface
// when using snap because chrome does not allow setting the name of the session.
// hence we re-implement it here. As a bonus, we get artwork support.

const Player = require('mpris-service')

module.exports = function mpris(soundcloud) {
  const player = Player({
    name: 'soundcleod',
    identity: 'Player for SoundCloud',
    supportedInterfaces: ['player']
  })

  player.on('playpause', () => soundcloud.playPause())

  player.on('next', () => soundcloud.nextTrack())

  player.on('previous', () => soundcloud.previousTrack())

  soundcloud.on('play-new-track', (metadata) => {
    setMetadata(metadata)
  })

  soundcloud.on('play', () => {
    player.playbackStatus = 'Playing'
  })

  soundcloud.on('pause', () => {
    player.playbackStatus = 'Paused'
  })

  function setMetadata(metadata) {
    player.metadata = {
      'mpris:artUrl': metadata.artworkURL,
      'xesam:title': metadata.title,
      'xesam:artist': [metadata.subtitle]
    }
  }
}
