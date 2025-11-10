# Etapa 1: Servidor web Nginx
# Usamos una imagen ligera de Nginx como base
FROM nginx:alpine

# Etiqueta para identificar al mantenedor de la imagen
LABEL maintainer="Gemini AI Assistant"

# Eliminar la configuración por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos de la aplicación (HTML, CSS, JS, imágenes)
# desde el directorio 'src' local al directorio de Nginx para servir contenido
COPY src/ /usr/share/nginx/html/

# Exponer el puerto 80 para permitir el tráfico HTTP hacia el contenedor
EXPOSE 8080

# El comando por defecto de la imagen de Nginx (`nginx -g 'daemon off;'`) 
# se ejecutará automáticamente, iniciando el servidor.
