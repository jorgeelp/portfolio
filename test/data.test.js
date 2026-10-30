import { test } from 'node:test'
import assert from 'node:assert/strict'
import { texts, projects } from '../src/data.js'

// Devuelve todas las rutas de claves de un objeto, para comparar ES y EN
const shape = (o, p = '') =>
  Object.entries(o).flatMap(([k, v]) => {
    const key = Array.isArray(o) ? `${p}[]` : `${p}.${k}`
    return v && typeof v === 'object' ? [key, ...shape(v, key)] : [key]
  })

test('ES y EN tienen las mismas claves', () => {
  assert.deepEqual([...new Set(shape(texts.en))].sort(), [...new Set(shape(texts.es))].sort())
})

test('mismo número de puestos y estudios en ambos idiomas', () => {
  assert.equal(texts.en.experience.jobs.length, texts.es.experience.jobs.length)
  assert.equal(texts.en.experience.studies.length, texts.es.experience.studies.length)
})

test('las páginas de proyecto tienen ES y EN completos', () => {
  for (const p of projects.filter(p => p.detail)) {
    assert.deepEqual([...new Set(shape(p.detail.en))].sort(), [...new Set(shape(p.detail.es))].sort(), p.repo)
    assert.equal(p.detail.en.features.length, p.detail.es.features.length, p.repo)
    for (const img of p.detail.images) assert.ok(img.alt.es && img.alt.en, img.src)
    for (const m of p.detail.modules ?? []) assert.equal(m.en.length, m.es.length, m.title.es)
    for (const st of p.detail.flow ?? []) {
      assert.equal(st.es.length, 2, st.es[0]); assert.equal(st.en.length, 2, st.es[0])
      if (st.img) assert.ok(p.detail.images.some(i => i.src === st.img), 'captura del flujo no está en la galería: ' + st.img)
    }
  }
})
