from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import json
from datetime import datetime

def setup_edge_driver():
    """Configurar Microsoft Edge para scraping"""
    print("🌐 Configurando Microsoft Edge...")
    
    options = Options()
    
    # Opciones para Edge
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    
    # User agent más realista para Edge
    options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0')
    
    # Desactivar características que detectan automatización
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    
    # Configuraciones adicionales para parecer más humano
    prefs = {
        "profile.default_content_setting_values.notifications": 2,
        "profile.default_content_settings.popups": 0,
        "profile.managed_default_content_settings.images": 1
    }
    options.add_experimental_option("prefs", prefs)
    
    try:
        driver = webdriver.Edge(options=options)
        
        # Ejecutar script para ocultar webdriver
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        print("✅ Microsoft Edge configurado exitosamente")
        return driver
        
    except Exception as e:
        print(f"❌ Error configurando Edge: {e}")
        print("💡 Asegúrate de tener Microsoft Edge instalado")
        print("💡 El EdgeDriver se descarga automáticamente")
        return None

def scrape_with_edge(url, site_name="Sitio Web"):
    """Scraper general usando Edge"""
    
    print(f"🚀 SCRAPER CON MICROSOFT EDGE")
    print("=" * 50)
    
    driver = setup_edge_driver()
    if not driver:
        return None
    
    try:
        print(f"🌐 Navegando a: {url}")
        driver.get(url)
        
        # Espera más natural (como un humano)
        print("⏳ Esperando carga inicial...")
        time.sleep(3)
        
        # Scroll natural
        print("📜 Simulando navegación humana...")
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight/4);")
        time.sleep(2)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight/2);")
        time.sleep(2)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(3)
        driver.execute_script("window.scrollTo(0, 0);")
        time.sleep(2)
        
        # Verificar si hay CAPTCHAs o bloqueos
        captcha_selectors = [
            '.g-recaptcha',
            '[class*="captcha"]',
            '[class*="challenge"]',
            'iframe[src*="recaptcha"]'
        ]
        
        captcha_detected = False
        for selector in captcha_selectors:
            try:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                if elements:
                    print(f"⚠️ Detectado posible CAPTCHA: {selector}")
                    captcha_detected = True
                    break
            except:
                continue
        
        if captcha_detected:
            print("🛡️ Sitio tiene protecciones anti-bot activas")
            print("💡 Considera usar sitios alternativos")
        
        # Obtener información básica
        titulo = driver.title
        url_actual = driver.current_url
        html_size = len(driver.page_source)
        
        print(f"📄 Título: {titulo}")
        print(f"🔗 URL actual: {url_actual}")
        print(f"📊 Tamaño HTML: {html_size} caracteres")
        
        # Buscar elementos de contenido
        print("\n🔍 BUSCANDO CONTENIDO...")
        print("-" * 30)
        
        # Selectores comunes para diferentes tipos de contenido
        content_selectors = [
            # Productos/Items
            '.product', '.item', '.card', '[class*="product"]', '[class*="item"]',
            # Texto con información
            'h1', 'h2', 'h3', '.title', '.name', '[class*="title"]', '[class*="name"]',
            # Precios
            '.price', '[class*="price"]', '*[text*="$"]', '*[text*="S/"]',
            # Contenido general
            'article', 'section', '.content', '[class*="content"]'
        ]
        
        elementos_encontrados = []
        
        for selector in content_selectors:
            try:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                elements_con_texto = [e for e in elements if e.text.strip() and len(e.text.strip()) > 5]
                
                if elements_con_texto:
                    print(f"✅ {selector}: {len(elements_con_texto)} elementos")
                    elementos_encontrados.extend(elements_con_texto[:10])  # Max 10 por selector
                    
            except Exception as e:
                continue
        
        # Remover duplicados
        elementos_unicos = []
        textos_vistos = set()
        
        for elem in elementos_encontrados:
            texto = elem.text.strip()
            if texto not in textos_vistos and len(texto) > 5:
                elementos_unicos.append(elem)
                textos_vistos.add(texto)
        
        # Extraer datos
        datos_extraidos = []
        
        if elementos_unicos:
            print(f"\n📦 PROCESANDO {len(elementos_unicos)} ELEMENTOS ÚNICOS:")
            print("-" * 40)
            
            for i, elem in enumerate(elementos_unicos[:20], 1):
                try:
                    texto = elem.text.strip()
                    tag = elem.tag_name
                    clases = elem.get_attribute('class') or ''
                    
                    # Intentar determinar el tipo de contenido
                    tipo_contenido = "general"
                    if any(word in clases.lower() for word in ['product', 'item']):
                        tipo_contenido = "producto"
                    elif any(word in clases.lower() for word in ['price', 'cost']):
                        tipo_contenido = "precio"
                    elif tag in ['h1', 'h2', 'h3']:
                        tipo_contenido = "titulo"
                    
                    item = {
                        'id': i,
                        'texto': texto[:200],  # Limitar texto
                        'tipo': tipo_contenido,
                        'tag': tag,
                        'clases': clases,
                        'sitio': site_name,
                        'extraido_en': datetime.now().isoformat()
                    }
                    
                    datos_extraidos.append(item)
                    
                    print(f"{i:2d}. [{tag}] {texto[:60]}")
                    if len(texto) > 60:
                        print(f"    ...{texto[60:120]}...")
                    
                except Exception as e:
                    print(f"❌ Error procesando elemento {i}: {e}")
                    continue
        
        else:
            print("❌ No se encontró contenido procesable")
            
            # Análisis básico como fallback
            all_text = driver.find_elements(By.XPATH, "//*[text()]")
            textos_relevantes = []
            
            for elem in all_text:
                try:
                    texto = elem.text.strip()
                    if (texto and 
                        len(texto) > 10 and len(texto) < 200 and
                        not any(skip in texto.lower() for skip in ['script', 'style', 'function'])):
                        textos_relevantes.append(texto)
                except:
                    continue
            
            if textos_relevantes:
                print(f"📝 Textos relevantes encontrados: {len(textos_relevantes)}")
                for texto in textos_relevantes[:10]:
                    datos_extraidos.append({
                        'texto': texto,
                        'tipo': 'texto_general',
                        'extraido_en': datetime.now().isoformat()
                    })
        
        # Guardar resultados
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        json_file = f"edge_scraping_{timestamp}.json"
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump({
                'sitio': site_name,
                'url': url_actual,
                'titulo': titulo,
                'captcha_detectado': captcha_detected,
                'elementos_extraidos': datos_extraidos,
                'total_elementos': len(datos_extraidos),
                'timestamp': timestamp
            }, f, ensure_ascii=False, indent=2)
        
        screenshot_file = f"edge_screenshot_{timestamp}.png"
        driver.save_screenshot(screenshot_file)
        
        print(f"\n💾 RESULTADOS:")
        print(f"📊 JSON: {json_file}")
        print(f"📸 Screenshot: {screenshot_file}")
        print(f"🎯 Total extraído: {len(datos_extraidos)} elementos")
        
        if datos_extraidos:
            print("🎉 ¡SCRAPING CON EDGE EXITOSO!")
        else:
            print("⚠️ Scraping parcial")
        
        return datos_extraidos
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return None
        
    finally:
        input("\n⏸️ Presiona Enter para cerrar Edge...")
        driver.quit()

def main():
    print("🌐 SCRAPER CON MICROSOFT EDGE")
    print("=" * 50)
    print("✅ Ventajas de Edge:")
    print("  • Menos detectado que Chrome")
    print("  • User-agent más realista")
    print("  • Configuraciones anti-detección")
    print("  • Descarga automática de EdgeDriver")
    print("=" * 50)
    
    opciones_sitios = {
        "1": {
            "nombre": "Pizza Hut Perú",
            "url": "https://www.pizzahut.com.pe/",
            "nota": "Sitio con protecciones (para probar Edge)"
        },
        "2": {
            "nombre": "Libros (sitio de prueba)",
            "url": "https://books.toscrape.com/",
            "nota": "Garantizado que funciona"
        },
        "3": {
            "nombre": "Citas famosas",
            "url": "https://quotes.toscrape.com/",
            "nota": "Sitio simple y confiable"
        },
        "4": {
            "nombre": "Sitio personalizado",
            "url": "",
            "nota": "Introduce tu propia URL"
        }
    }
    
    print("\n📋 SITIOS DISPONIBLES:")
    for key, sitio in opciones_sitios.items():
        print(f"{key}. {sitio['nombre']} - {sitio['nota']}")
    
    while True:
        eleccion = input("\n👉 Elige una opción (1-4): ").strip()
        
        if eleccion in opciones_sitios:
            sitio = opciones_sitios[eleccion]
            
            if eleccion == "4":
                url = input("🌐 Introduce la URL: ").strip()
                if not url.startswith('http'):
                    url = 'https://' + url
                nombre = input("📝 Nombre del sitio: ").strip() or "Sitio personalizado"
            else:
                url = sitio['url']
                nombre = sitio['nombre']
            
            print(f"\n🎯 Scrapeando: {nombre}")
            print(f"🔗 URL: {url}")
            
            resultado = scrape_with_edge(url, nombre)
            
            if resultado:
                print(f"\n✨ ¡Completado! {len(resultado)} elementos extraídos")
            else:
                print("\n❌ Scraping no exitoso")
            
            continuar = input("\n¿Probar otro sitio? (y/n): ").strip().lower()
            if continuar != 'y':
                break
                
        else:
            print("❌ Opción inválida")
    
    print("\n👋 ¡Gracias por usar el scraper con Edge!")

if __name__ == "__main__":
    # Verificar dependencias
    try:
        import selenium
        print("✅ Selenium disponible")
    except ImportError:
        print("❌ Selenium no instalado")
        print("💡 Ejecuta: py -m pip install selenium")
        input("Presiona Enter para salir...")
        exit()
    
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Programa interrumpido")
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        input("Presiona Enter para salir...")