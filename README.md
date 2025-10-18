# Automatización de inicio de sesión con Puppeteer

Esta herramienta permite automatizar el proceso de inicio de sesión en una página web utilizando [Puppeteer](https://pptr.dev/). Puedes ejecutar el script desde la línea de comandos proporcionando la URL del formulario de acceso, junto con el usuario y la contraseña.

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior.
- Dependencias instaladas con `npm install`.

## Instalación

```bash
npm install
```

También puedes instalar la herramienta de manera global dentro del proyecto para ejecutarla con el comando `puppeteer-login`:

```bash
npm install --global .
```

## Uso básico

Ejecuta el script indicando la URL de la página de inicio de sesión y las credenciales:

```bash
node src/login.js --url https://www.ejemplo.com/login --username TU_USUARIO --password TU_CONTRASENA
```

Si instalaste la herramienta de forma global con `npm install --global .`, también puedes usar:

```bash
puppeteer-login --url https://www.ejemplo.com/login --username TU_USUARIO --password TU_CONTRASENA
```

> ⚠️ **Importante:** No compartas credenciales sensibles. Para entornos de producción se recomienda utilizar un gestor seguro de secretos o variables de entorno.

## Opciones adicionales

| Opción | Descripción | Valor por defecto |
| ------ | ----------- | ----------------- |
| `--username-selector` | Selector del campo de usuario. | `#username` |
| `--password-selector` | Selector del campo de contraseña. | `#password` |
| `--submit-selector` | Selector del botón de envío. | `button[type="submit"]` |
| `--screenshot` | Ruta del archivo donde guardar una captura después del inicio de sesión. | No guarda captura |
| `--no-wait` | No espera a que la navegación termine después de enviar el formulario. | Espera a `networkidle0` |
| `--headful` | Ejecuta el navegador en modo visible (no headless). | Headless |

## Ejemplo avanzado

```bash
node src/login.js \
  --url https://www.ejemplo.com/login \
  --username usuario_demo \
  --password contrasena_demo \
  --username-selector "input[name=correo]" \
  --password-selector "input[name=clave]" \
  --submit-selector "button.ingresar" \
  --screenshot salida.png
```

## Salida del script

- Si el proceso concluye correctamente se mostrará en consola: `Inicio de sesión completado.`
- En caso de error, se imprimirá el mensaje correspondiente y el proceso terminará con un código de salida `1`.

## Estructura del proyecto

```
.
├── package.json
├── README.md
├── src
│   └── login.js
└── .gitignore
```

## Desarrollo

Puedes modificar `src/login.js` para adaptarlo a los selectores o flujos personalizados de la página objetivo. Se exportan las funciones `parseArguments` y `loginWithPuppeteer` para facilitar pruebas unitarias o reutilización en otros módulos.

