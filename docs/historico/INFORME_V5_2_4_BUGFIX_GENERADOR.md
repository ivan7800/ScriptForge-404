# Addenda v5.2.4 — Corrección de un bug real en el generador

## Contexto

Los informes `INFORME_V5_2_2_LIMPIEZA.md` e `INFORME_V5_2_3_SKINS.md` afirmaban "Generation errors: 0" y daban una nota estimada de 9,3/10 antes de pruebas Windows. Esa auditoría se basaba solo en si el motor lanzaba excepciones al generar — no en si el **contenido** generado era correcto línea a línea. Al volver a auditar el paquete `v5_2_3_skins` recibido, se encontró que el bug de la plantilla 06 (reparar-unidades-red) que ya se había corregido manualmente en `v5.2` había **reaparecido** en los standalone regenerados de `v5.2.2`.

## Causa raíz real

`assets/js/templates-v5-pro.js`, función `tpl`:

```js
// Antes (buggy):
const tpl = (strings, ...values) => String.raw(strings, ...values).replace(/\\n/g, '\n');
```

Este regex convierte cualquier `\` + `n` en salto de línea, sin distinguir si la barra invertida era parte de una barra doble literal (`\\` → `\`) seguida por casualidad de una palabra que empieza por "n" (como `netuse_antes.txt`). Resultado: la app "comía" la letra `n` y la sustituía por un salto de línea real, rompiendo la ruta de salida.

Esto no era un problema de un archivo desincronizado — es un bug estructural en el generador que **reaparece cada vez que se regeneran los scripts standalone**, y podría afectar a cualquier plantilla futura que combine `\\` seguido de una palabra que empiece por "n" (network, name, ntfs, notepad, etc. — vocabulario común en scripts de IT).

## Corrección aplicada

Sustituido el regex por un parser de escapes secuencial (izquierda a derecha), que replica el comportamiento estándar de escapado de cadenas:

```js
const tpl = (strings, ...values) => {
  const raw = String.raw(strings, ...values);
  let out = '';
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === '\\' && raw[i + 1] === '\\') { out += '\\'; i++; }
    else if (raw[i] === '\\' && raw[i + 1] === 'n') { out += '\n'; i++; }
    else { out += raw[i]; }
  }
  return out;
};
```

## Verificación tras la corrección

- Escaneadas las 30 plantillas V5 Pro buscando toda colisión `\\` + palabra-con-n: 0 restantes.
- Regenerados los 30 `.bat` y 30 `.ps1` standalone con el generador corregido.
- Relanzado el linter estático (paréntesis/comillas balanceadas, etiquetas GOTO definidas, `setlocal`/`endlocal`, llaves/paréntesis PS1 balanceados, `try`/`catch`): 0 issues en 60 archivos.
- Confirmado que la línea `net use > "%OUT%\netuse_antes.txt"` se genera ahora en una sola línea correcta.
- `node --check` sin errores en los 9 archivos JS.

## Nota sobre las puntuaciones anteriores

La puntuación "9,3/10" de `INFORME_V5_2_2_LIMPIEZA.md` se dio sin haber detectado este bug (la auditoría de ese informe solo comprobaba que el generador no lanzara excepciones, no que el contenido generado fuera correcto). Con esta corrección de raíz, el motor de generación es ahora más fiable que en cualquier versión anterior — pero la validación en Windows real sigue pendiente, como en todas las rondas previas.
