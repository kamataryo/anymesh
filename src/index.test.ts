import fetch from 'isomorphic-unfetch'
import { AnyMesh } from './'
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
  let features: GeoJSON.Feature[] = []

  new AnyMesh(geojson, 3, 3)
    .on('data', (chunk: GeoJSON.Feature) => {
      features.push(chunk)
    })
    .on('close', () => {
      const hash = md5(JSON.stringify(features))
      assert.equal(hash, '6e5aa5fd04bf0680a513d33c778de435')
    })
}

main()
