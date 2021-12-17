import { isatty } from "tty"
import { Anymesh } from '.'

process.stdin.resume()
process.stdin.setEncoding('utf8')

const [,,argx, argy] = process.argv

let data = ''
const onEnd = async () => {
  let stdout
  try {
    const geojson = JSON.parse(data)
    const x = parseInt(argx)
    const y = parseInt(argy)
    if(isNaN(x) || isNaN(y)) {
      throw new Error(`Invalid arguments x, y = ${x}, ${y}`)
    }
    stdout = JSON.stringify(await new Anymesh(geojson, x, y).bulk())

  } catch (e: any) {
    process.stdout.write(e.message)
    process.exit(1)
  }

  process.stdout.write(stdout)
  process.exit(0)
}

if (isatty(0)) {
  onEnd()
} else {
  process.stdin.on('data', chunk => (data += chunk))
  process.stdin.on('end', onEnd)
}
