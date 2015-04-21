import domify from 'domify'
import assign from 'object-assign'

const tweenr = require('tweenr')()

export default function() {
  const text = `
all particles are rendered in real-time
  `.trim()
  const html = domify(`<div>${text}</div>`)

  assign(html.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    margin: 'auto',
    width: '400px',
    'text-align': 'center',
    height: '40px',
    color: 'white',
    'font-size': '12px',
    'font-family': '"Open Sans", "Helvetica", sans-serif',
    'font-weight': 300,
  })

  document.body.appendChild(html)

  const anim = { opacity: 1 }
  tweenr.to(anim, { 
      duration: 1, 
      ease: 'quadOut', 
      opacity: 0,
      delay: 1.5
  })
    .on('update', () => {
      html.style.opacity = anim.opacity.toFixed(5)
    })
    .on('complete', () => {
      html.style.display = 'none'
    })
}