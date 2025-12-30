#!/usr/bin/env python3
"""
Script para procesar Server Side Includes (SSI) en archivos HTML
Combina _header.html y _footer.html en cada página para desarrollo local
"""

import os
import re
from pathlib import Path

# Directorio de trabajo
SRC_DIR = Path(__file__).parent / "src"
HEADER_FILE = SRC_DIR / "_header.html"
FOOTER_FILE = SRC_DIR / "_footer.html"

def read_file(filepath):
    """Lee el contenido de un archivo"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def process_ssi(content, header_content, footer_content):
    """Reemplaza las directivas SSI con el contenido real"""
    # Reemplazar header
    content = re.sub(
        r'<!--#\s*include\s+virtual="/_header\.html"\s*-->',
        header_content,
        content
    )
    # Reemplazar footer
    content = re.sub(
        r'<!--#\s*include\s+virtual="/_footer\.html"\s*-->',
        footer_content,
        content
    )
    return content

def main():
    """Procesa todos los archivos HTML en src/"""
    
    # Leer header y footer
    print("📖 Leyendo _header.html y _footer.html...")
    header_content = read_file(HEADER_FILE)
    footer_content = read_file(FOOTER_FILE)
    
    # Encontrar todos los archivos HTML (excepto _header y _footer)
    html_files = [
        f for f in SRC_DIR.glob("*.html") 
        if not f.name.startswith("_")
    ]
    
    print(f"\n🔄 Procesando {len(html_files)} archivos HTML...\n")
    
    for html_file in html_files:
        print(f"   ✓ {html_file.name}")
        content = read_file(html_file)
        
        # Procesar SSI
        processed_content = process_ssi(content, header_content, footer_content)
        
        # Guardar archivo procesado
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(processed_content)
    
    print(f"\n✅ ¡Completado! {len(html_files)} archivos procesados.")
    print("\n⚠️  NOTA: Este script es solo para desarrollo local.")
    print("   En producción, Nginx procesará los SSI automáticamente.\n")

if __name__ == "__main__":
    main()
