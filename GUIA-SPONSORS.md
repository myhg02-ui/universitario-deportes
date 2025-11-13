# 🏆 Guía de Sponsors - Universitario de Deportes

## 📋 Sponsors Actuales en la Página

### **Patrocinador Principal:**
- **Yape** - Patrocinador principal del club

### **Patrocinadores Oficiales:**
1. **Adidas** - Indumentaria oficial
2. **Marathon** - Sponsor histórico
3. **Cerveza Cristal** - Bebidas
4. **Claro** - Telecomunicaciones
5. **BCP** (Banco de Crédito) - Servicios financieros
6. **Gatorade** - Bebidas deportivas

---

## 📸 Cómo Agregar Imágenes Reales de Sponsors

### **Paso 1: Preparar las Imágenes**

Consigue los logos de cada sponsor y guárdalos con estos nombres:

```
images/sponsors/
├── yape.png          (300x180px aprox)
├── adidas.png        (200x120px aprox)
├── marathon.png      (200x120px aprox)
├── cristal.png       (200x120px aprox)
├── claro.png         (200x120px aprox)
├── bcp.png           (200x120px aprox)
└── gatorade.png      (200x120px aprox)
```

**Recomendaciones:**
- ✅ Formato: PNG con fondo transparente
- ✅ Resolución: Alta calidad (mínimo 800x480px)
- ✅ Peso: Máximo 100KB por imagen
- ✅ Optimizar en: https://tinypng.com/

---

### **Paso 2: Crear la Carpeta**

Crea la carpeta de sponsors:
```
github-copilot/
└── images/
    └── sponsors/    ← Nueva carpeta
```

---

### **Paso 3: Actualizar el HTML**

Cuando tengas las imágenes, reemplaza los placeholders:

**ANTES:**
```html
<div class="sponsor-logo">
    <span class="sponsor-placeholder">YAPE</span>
    <p class="sponsor-name">Yape</p>
</div>
```

**DESPUÉS:**
```html
<div class="sponsor-logo">
    <img src="images/sponsors/yape.png" alt="Yape - Patrocinador Principal">
</div>
```

---

### **Paso 4: Actualizar CSS**

Agrega estos estilos cuando uses imágenes reales:

```css
.sponsor-logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: grayscale(100%);
    transition: var(--transition);
}

.sponsor-logo:hover img {
    filter: grayscale(0%);
}

.sponsor-logo-main img {
    filter: none;
}
```

---

## 🔍 Dónde Conseguir los Logos

### **Opción 1: Sitios Web Oficiales**
- Yape: https://www.yape.com.pe/
- Adidas: https://www.adidas.pe/
- Marathon: https://www.marathon.com.pe/
- BCP: https://www.viabcp.com/

### **Opción 2: Logos de Alta Calidad**
- https://worldvectorlogo.com/
- https://seeklogo.com/
- https://brandsoftheworld.com/

### **Opción 3: Contactar al Club**
Contacta a Universitario directamente para logos oficiales de sponsors.

---

## 🎨 Estado Actual (Con Placeholders)

✅ **Ventajas del diseño actual:**
- Sección completamente funcional
- Diseño profesional y responsive
- Muestra claramente dónde irá cada logo
- Fácil de actualizar después
- Se ve bien incluso sin imágenes

### Vista Previa Actual:

**Patrocinador Principal:**
```
┌─────────────────────┐
│                     │
│       YAPE          │
│       Yape          │
│                     │
└─────────────────────┘
```

**Patrocinadores Oficiales:**
```
┌────────┐ ┌────────┐ ┌────────┐
│ ADIDAS │ │MARATHON│ │CRISTAL │
│ Adidas │ │Marathon│ │Cerveza │
└────────┘ └────────┘ └────────┘
```

---

## 🚀 Próximos Pasos

1. **Ahora:** La página está lista con placeholders profesionales
2. **Cuando tengas logos:** Solo reemplaza los placeholders
3. **Opcional:** Agrega más sponsors si es necesario

---

## 📝 Agregar Más Sponsors

Si quieres agregar más sponsors, copia este código:

```html
<div class="sponsor-card">
    <div class="sponsor-logo">
        <span class="sponsor-placeholder">NOMBRE</span>
        <p class="sponsor-name">Nombre Completo</p>
    </div>
</div>
```

Y pégalo dentro de `<div class="sponsors-grid">` en el HTML.

---

## 💡 Tips Profesionales

1. **Logos en blanco y negro:** Algunos sitios muestran sponsors en escala de grises y a color al hacer hover (ya está implementado en el CSS)

2. **Enlaces a sponsors:** Puedes agregar links:
```html
<a href="https://sitio-sponsor.com" target="_blank" rel="noopener noreferrer">
    <div class="sponsor-logo">
        <img src="images/sponsors/logo.png" alt="Sponsor">
    </div>
</a>
```

3. **Orden de importancia:** El patrocinador principal siempre va primero y más grande (ya está así)

---

**¿Necesitas ayuda para agregar las imágenes? Solo pásalas y yo actualizo todo automáticamente.** 🚀
