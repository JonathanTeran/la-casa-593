# Publicación de La Casa 593 en DonDominio

## Archivos que debes subir

Sube **el contenido de esta carpeta**, no la carpeta completa:

- `index.html`
- `styles.css`
- `script.js`
- `site.webmanifest`
- `robots.txt`
- carpeta `assets`

## Si tienes hosting contratado en DonDominio

1. Entra a tu Área de cliente.
2. Ve a **Hosting y Correo → Mis planes**.
3. Abre el plan asociado a tu dominio.
4. Entra a **Cuentas FTP** y consulta o crea la contraseña.
5. Conéctate con FileZilla o Cyberduck.
6. Sube todos los archivos dentro de la carpeta remota **`public`**.
7. Confirma que `index.html` esté directamente dentro de `public`, en minúsculas.
8. Activa el certificado SSL desde el apartado **Certificados SSL**.
9. Abre `https://tudominio.com` y prueba también `https://www.tudominio.com`.

Datos FTP habituales:

- Servidor: `ftp.tudominio.com` o `ftp.dondominio.com`
- Usuario: el indicado en el panel FTP
- Puerto FTP: 21

## Si solo tienes el dominio, pero no hosting

Un dominio no almacena la página. Necesitas una de estas opciones:

### Opción A — contratar hosting en DonDominio

Contrata un alojamiento básico, asígnalo al dominio y sigue el procedimiento FTP anterior.

### Opción B — alojamiento externo

Publica estos archivos en Cloudflare Pages, Netlify, Vercel, GitHub Pages o un servidor propio. Después configura en DonDominio los registros DNS que te entregue ese proveedor.

## Recomendación

Para esta página temporal, un hosting estático externo puede ser suficiente. Para la plataforma final con Next.js 16 y Laravel 13 se necesitará una infraestructura diferente; no conviene montar el sistema final dentro de un hosting estático básico.
