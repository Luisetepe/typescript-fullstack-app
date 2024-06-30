const output = await Bun.build({
  entrypoints: ['./src/main.ts'],
  outdir: '../../dist/',
  target: 'bun',
})
console.log(output)

export {}
