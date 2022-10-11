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
    console.log('fetching stats')
    res = JSON.parse(await get(url))
    console.log(res)
  } catch(e) {
    console.log(e)
  }

  const name = namespace ? `${namespace}/${image}` : image
  const stars = res ? human(res.star_count) : 'unknown'
  const downloads = res ?human(res.pull_count) : 'unknown'
  const trusted = res ? human(res.is_automated) : 'unknown'

  // try {
  //   console.log('fetching comments')
  //   res = JSON.parse(await get(url + 'comments/'))
  //   console.log(res)
  // } catch(e) {
  //   console.log(e)
  // }

  const comments = res ? human(res.collaborator_count) : 'unknown'

  return {
    type: 'image/svg+xml; charset=utf8',
    body: svg(name, stars, downloads, comments, trusted)
  }
}
