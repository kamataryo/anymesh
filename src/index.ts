import Stream from "stream";
import fs from 'fs'
import * as turf from '@turf/turf'

export class GeoBrickStream extends Stream.Readable {
  private geojson: GeoJSON.FeatureCollection
  private left: number
  private right: number
  private top: number
  private bottom: number
  private x: number
  private y: number
  private width: number
  private height: number
  private brickGenerator: Generator<GeoJSON.Feature>

  constructor(geojson: GeoJSON.FeatureCollection, x: number, y: number) {
    super({ objectMode: true })
    const [left, bottom, right, top] = turf.bbox(geojson)
    this.geojson = geojson
    this.top = top
    this.bottom = bottom
    this.left = left
    this.right = right
    this.x = x
    this.y = y
    this.width = (right - left) / this.x
    this.height = (top - bottom) / this.y
    this.brickGenerator = this.getBrick()
  }

  *getBrick() {
    for (let dy = 0; dy < this.y; dy++) {
      for (let dx = 0; dx < this.x; dx++) {
        console.warn({dx, dy})
        const left = this.left + dx * this.width
        const right = left + this.width
        const bottom = this.bottom + dy * this.height
        const top = bottom + this.height
        const brick: GeoJSON.Feature = {
          type: 'Feature',
          properties: { top, bottom, left, right },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [left, top],
              [right, top],
              [right, bottom],
              [left, bottom],
              [left, top],
            ]]
          }
        }
        // @ts-ignore
        const intersection = this.geojson.features.some(feature => turf.booleanIntersects(feature, brick))
        if(intersection) {
          yield brick
        }
      }
    }
  }

  _read() {
    const { value, done } = this.brickGenerator.next()
    this.push( done ? null : value)
  }
}
