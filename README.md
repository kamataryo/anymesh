# anymesh

Anymesh is a mesh generating library which fills a given GeoJSON with any resolutions.

## install

```shell
$ npm install https://github.com/geolonia/anymesh
```

## API

```typescript
const anymesh = new AnyMesh(geojson: GeoJSON.FeatureCollection, x: number, y: number);
```

### params

- `geojson`: GeoJSON to be filled.
- `x`, `y`: tile numbers to fill the GeoJSON.

## Usage

Anymesh is a stream to generate squared feature one by one.

```typescript
import { Anymesh } from 'anymesh'

const japan = 'https://github.com/dataofjapan/land/raw/master/japan.geojson'
const resp = await fetch(japan)
const geojson = await resp.json() as GeoJSON.FeatureCollection

for await (const feature of new Anymesh(geojson, 3, 3)) {
  console.log(feature)
}
```
