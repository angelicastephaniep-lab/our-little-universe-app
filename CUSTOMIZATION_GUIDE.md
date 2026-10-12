# 💜 Guía de Personalización: Our Little Universe 🌿

¡Felicidades por crear este regalo para tu novio programador! Esta aplicación está diseñada para que puedas cambiar cualquier texto, foto, tema de color o pregunta de forma súper sencilla y segura.

---

## 🎨 1. Dos Temas de Color (Morado 💜 y Verde 🌿)
La aplicación cuenta con dos temas visuales completos que puedes alternar en cualquier momento desde el botón en la barra superior o en la ventana de personalización:
- **Tema Morado 💜 (Original):** El universo galáctico con violeta cósmico, estrellas púrpuras, nebulosas brillantes y corazones flotantes.
- **Tema Verde 🌿 (Elegante y Romántico):** Una combinación inspirada en la naturaleza con verde salvia, verde bosque, verde oliva suave, crema cálido y blanco marfil, con hojas y corazones verdes.

La preferencia se guarda automáticamente en el navegador para que al volver a abrir la aplicación se conserve el tema elegido.

---

## 📸 2. Tus 4 Fotografías Originales de WhatsApp
Las cuatro fotografías originales que subiste a GitHub están configuradas de forma permanente en `public/photos/` y vinculadas en `src/customization.ts`:
1. **Recuerdo 1 (El inicio de nuestra galaxia):** `WhatsApp Image 2026-10-07 at 7.32.01 PM.jpeg`
2. **Recuerdo 2 (Nuestras risas y aventuras):** `WhatsApp Image 2026-09-18 at 4.40.44 PM.jpeg`
3. **Recuerdo 3 (Tarde de código y miradas):** `WhatsApp Image 2026-10-08 at 11.44.18 PM.jpeg`
4. **Recuerdo 4 (Mirando hacia nuestro futuro):** `WhatsApp Image 2026-09-21 at 2.49.27 PM.jpeg`

El sistema incluye además resolución automática con codificación de espacios para que nunca den error 404 en Netlify.

---

## ✨ 3. Personalizar desde la aplicación (Método interactivo)
En la barra superior, haz clic en el botón **"Personalizar 🛠️"** (o **"Customize 🛠️"**):
1. **Editor en vivo:** Puedes cambiar el nombre de tu novio, tu firma, la pregunta del Nivel 1 y los párrafos de la carta final.
2. **Selector de temas:** Puedes probar el Tema Morado y el Tema Verde directamente desde el modal.
3. **Fotos:** Puedes ver la previsualización de cada fotografía o cargar fotos adicionales si lo deseas.
4. Presiona **"Guardar cambios ✨"** para guardar tus cambios locales.

---

## 💻 4. Estructura del código (`src/customization.ts`)
Si prefieres editar el código directamente, todo está organizado en un solo archivo: `src/customization.ts`.

- `boyfriendName`: Nombre o apodo cariñoso.
- `girlfriendSignature`: Tu firma con amor.
- `level1`: Pregunta romántica, opciones de respuesta y retroalimentación.
- `level2Messages`: Mensajes de consola tipo programador en LOVE.EXE.
- `level3Memories`: Galería de recuerdos con las 4 fotos, fechas y notas completas.
- `finalLetter`: La carta sorpresa final que se desbloquea al completar los 3 niveles.

---

## 🌐 5. Idiomas (Español 🇩🇴 | English 🇺🇸)
El idioma por defecto es **Español**. Se puede cambiar a **English** con un solo clic en la barra superior. Todos los textos y mensajes cuentan con su traducción completa.
