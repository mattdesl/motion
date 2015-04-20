import THREE from 'three'
import domready from 'domready'
import viewer from './src/viewer'
import assign from 'object-assign'

import createVideo from './src/video'

domready(() => { 
  const app = viewer({
    alpha: false,
    preserveDrawingBuffer: false,
    antialias: true
  })
  document.body.appendChild(app.canvas)
  assign(document.body.style, {
    background: '#000',
    overflow: 'hidden'
  })

  const video = createVideo(app)

  app.start()
})