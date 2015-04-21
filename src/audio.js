import badge from 'soundcloud-badge'

const noop = () => {}

export default function(cb) {
  cb = cb || noop

  badge({
    client_id: 'b95f61a90da961736c03f659c03cb0cc',
    song: 'https://soundcloud.com/richardxbm/annie-anthonio-berlin',
    dark: false,
    getFonts: true
  }, function(err, src) {
    if (err) return cb(err)
      
    const audio = new Audio()
    const ready = () => {
      cb(null, audio)
    }

    audio.addEventListener('canplay', ready)

    if (audio.readyState > audio.HAVE_FUTURE_DATA) 
      ready()
    audio.src = src
  })
}
