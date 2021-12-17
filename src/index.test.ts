import fetch from 'isomorphic-unfetch'
import { Anymesh } from './'
import crypto from 'crypto'
import assert from 'assert'

const japan = 'https://github.com/dataofjapan/land/raw/master/japan.geojson'

const md5 = (value: string) => {
  const hash = crypto.createHash('md5')
  return hash.update(value, 'binary').digest('hex')
}

const main = async () => {
  const resp = await fetch(japan)
  const geojson = await resp.json() as GeoJSON.FeatureCollection

  const features: GeoJSON.Feature[] = []

  // stream test
  await new Promise<void>(resolve => {
    new Anymesh(geojson, 3, 3)
    .on('data', (chunk: GeoJSON.Feature) => {
      features.push(chunk)
    })
    .on('close', () => {
      const hash = md5(JSON.stringify(features))
      assert.equal(hash, '6e5aa5fd04bf0680a513d33c778de435')
      resolve()
    })
  })

  // iterator test
  let index = 0
  for await (const mesh of new Anymesh(geojson, 3, 3)) {
    assert.deepEqual(mesh, features[index])
    index++
  }
}

main()
