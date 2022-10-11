const svg = require('./svg.js')
var get = require('request-promise-native')
const api = 'https://hub.docker.com/v2/repositories'

function convert(n, b, s) {
  return ( ( n / b ) | 0 ) + s
}

function human(value) {
  const n = parseInt(value)
  if(n > 1000000000) return convert(n, 1000000000, 'B')
  if(n > 1000000) return convert(n, 1000000, 'M')
  if(n > 1000) return convert(n, 1000, 'K')
  return n
}

module.exports = async function badge(namespace, image) {
  let url = `${api}/${namespace || 'library'}/${image}/`
  let res
  try {
    console.log('Fetching stats for', url)
    res = JSON.parse(await get(url))
  } catch(e) {
    console.log(e)
  }

  const name = namespace ? `${namespace}/${image}` : image
  const stars = res ? human(res.star_count) : '---'
  const downloads = res ?human(res.pull_count) : '---'
  const trusted = res ? human(res.is_automated) : '---'

  // try {
  //   console.log('fetching comments')
  //   res = JSON.parse(await get(url + 'comments/'))
  // } catch(e) {
  //   console.log(e)
  // }

  const comments = res ? 0 : '---'

  return {
    type: 'image/svg+xml; charset=utf8',
    body: svg(name, stars, downloads, comments, trusted)
  }
}
