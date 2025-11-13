# 🎨 COLORES OFICIALES - Universitario de Deportes

## Paleta de Colores Principal

### 🔴 Rojo Crema (Institucional)
```css
/* Color principal del club */
#c41e3a
rgb(196, 30, 58)

/* Variantes */
#8B0000  /* Rojo oscuro - para degradados */
#a00000  /* Rojo medio - para hover effects */
#d41e3a  /* Rojo más brillante */
```

**Uso:** 
- Botones principales
- Títulos importantes
- Headers
- Links en hover
- Elementos destacados

---

### ✨ Crema/Beige (Tradicional)
```css
/* El color histórico del club */
#fcf9ea
rgb(252, 249, 234)

/* Variantes */
#fffef5  /* Crema más claro */
#f5f2e3  /* Crema más oscuro */
```

**Uso:**
- Fondos de sección
- Texto sobre fondos oscuros
- Backgrounds claros
- Tarjetas y cards

---

### 🏆 Dorado/Oro (Campeonatos)
```css
/* Color de la gloria y los títulos */
#d4af37
rgb(212, 175, 55)

/* Variantes */
#ffd700  /* Dorado brillante - hover */
#c19b2e  /* Dorado oscuro */
#f4d03f  /* Dorado amarillo */
```

**Uso:**
- Estrellas de campeonatos
- Botones secundarios
- Badges y medallas
- Detalles premium
- Títulos especiales

---

### ⚫ Negro (Elegancia)
```css
/* Color de contraste y elegancia */
#000000
rgb(0, 0, 0)

/* Variantes */
#1a1a1a  /* Negro ligeramente más claro */
#2c2c2c  /* Gris muy oscuro */
#0d0d0d  /* Negro profundo */
```

**Uso:**
- Footer
- Headers oscuros
- Texto principal
- Overlays
- Fondos de contraste

---

## 🎨 Gradientes Oficiales

### Gradiente Hero Principal
```css
background: linear-gradient(135deg, #c41e3a 0%, #8B0000 50%, #000000 100%);
```

### Gradiente Dorado (Botones Premium)
```css
background: linear-gradient(135deg, #d4af37, #ffd700);
```

### Gradiente Rojo (Botones Principales)
```css
background: linear-gradient(135deg, #c41e3a, #8B0000);
```

### Gradiente Negro Elegante
```css
background: linear-gradient(to bottom, #000000 0%, #1a1a1a 100%);
```

### Línea Decorativa Dorada
```css
background: linear-gradient(90deg, transparent, #d4af37, transparent);
```

### Línea Decorativa Multicolor
```css
background: linear-gradient(90deg, #c41e3a 0%, #d4af37 50%, #c41e3a 100%);
```

---

## 🌈 Colores Complementarios

### Grises (para textos y fondos)
```css
#f8f9fa  /* Gris muy claro - backgrounds alternativos */
#e9ecef  /* Gris claro - borders */
#6c757d  /* Gris medio - texto secundario */
#495057  /* Gris oscuro - texto */
```

### Colores de Estado
```css
/* Success/Éxito */
#27ae60  /* Verde - mensajes de éxito */

/* Error */
#e74c3c  /* Rojo error - alertas */

/* Warning/Advertencia */
#f39c12  /* Naranja - advertencias */

/* Info */
#3498db  /* Azul - información */
```

---

## 📊 Uso de Colores por Sección

### Header/Navegación
- Fondo: `#ffffff` (blanco)
- Hover links: `#c41e3a` (rojo crema)
- Botón Login: Border `#c41e3a`, fondo transparente
- Botón Registro: Fondo `#c41e3a`, texto blanco

### Hero Section
- Fondo: Gradiente `#c41e3a → #8B0000 → #000000`
- Título: `#ffffff` (blanco)
- Subtítulo: `#d4af37` (dorado)
- Botón primario: Fondo `#d4af37`, texto `#000000`
- Botón secundario: Border `#ffffff`, fondo transparente

### Secciones de Contenido
- Fondo alterno: `#fcf9ea` (crema)
- Fondo principal: `#ffffff` (blanco)
- Títulos: `#c41e3a` (rojo crema)
- Texto: `#2c2c2c` (gris oscuro)

### Cards/Tarjetas
- Fondo: `#ffffff`
- Border top: `#d4af37` (dorado)
- Shadow: `rgba(196, 30, 58, 0.1)`
- Hover shadow: `rgba(196, 30, 58, 0.2)`

### Footer
- Fondo: `#000000` (negro)
- Texto: `#fcf9ea` (crema)
- Títulos: `#d4af37` (dorado)
- Links hover: `#d4af37`
- Border top: Gradiente dorado-rojo

### Botones
- Primario: Fondo `#d4af37`, texto `#000000`
- Secundario: Fondo `#c41e3a`, texto `#fcf9ea`
- Terciario: Border `#c41e3a`, fondo transparente

---

## 🎯 Accesibilidad de Colores

### Contraste de Texto

#### Alto Contraste (Recomendado)
- Texto negro `#000000` sobre crema `#fcf9ea` ✅
- Texto blanco `#ffffff` sobre rojo `#c41e3a` ✅
- Texto negro `#000000` sobre dorado `#d4af37` ✅
- Texto crema `#fcf9ea` sobre negro `#000000` ✅

#### Contraste Medio
- Texto gris oscuro `#2c2c2c` sobre blanco `#ffffff` ✅
- Texto blanco `#ffffff` sobre rojo oscuro `#8B0000` ✅

---

## 💡 Tips de Uso

### Para Fondos Claros
```css
background: #fcf9ea;
color: #2c2c2c; /* texto */
h1, h2 { color: #c41e3a; } /* títulos */
a { color: #c41e3a; } /* links */
```

### Para Fondos Oscuros
```css
background: #000000;
color: #fcf9ea; /* texto */
h1, h2 { color: #d4af37; } /* títulos */
a { color: #d4af37; } /* links */
```

### Para Elementos Destacados
```css
/* Badge de campeón */
background: #d4af37;
color: #000000;
box-shadow: 0 3px 10px rgba(212, 175, 55, 0.4);

/* Elemento urgente */
background: #c41e3a;
color: #ffffff;
box-shadow: 0 3px 10px rgba(196, 30, 58, 0.3);
```

---

## 🌟 Efectos Especiales

### Overlay Oscuro
```css
background: rgba(0, 0, 0, 0.7); /* 70% opacidad */
```

### Overlay Rojo
```css
background: rgba(196, 30, 58, 0.9); /* 90% opacidad */
```

### Pattern de Estrellas
```css
background-image: 
    radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(196, 30, 58, 0.1) 0%, transparent 50%);
```

### Brillo/Glow Dorado
```css
box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
text-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
```

### Brillo/Glow Rojo
```css
box-shadow: 0 0 20px rgba(196, 30, 58, 0.5);
text-shadow: 0 0 10px rgba(196, 30, 58, 0.7);
```

---

## 📱 Colores en Diferentes Estados

### Normal → Hover → Active

**Botón Primario (Dorado)**
```css
/* Normal */
background: #d4af37;

/* Hover */
background: #ffd700;

/* Active */
background: #c19b2e;
```

**Botón Secundario (Rojo)**
```css
/* Normal */
background: #c41e3a;

/* Hover */
background: #a00000;

/* Active */
background: #8B0000;
```

**Links**
```css
/* Normal */
color: #2c2c2c;

/* Hover */
color: #c41e3a;

/* Active */
color: #8B0000;
```

---

## 🎨 Variables CSS Completas

```css
:root {
    /* Colores principales */
    --color-rojo-crema: #c41e3a;
    --color-rojo-oscuro: #8B0000;
    --color-rojo-medio: #a00000;
    
    --color-crema: #fcf9ea;
    --color-crema-claro: #fffef5;
    --color-crema-oscuro: #f5f2e3;
    
    --color-dorado: #d4af37;
    --color-dorado-brillante: #ffd700;
    --color-dorado-oscuro: #c19b2e;
    
    --color-negro: #000000;
    --color-negro-claro: #1a1a1a;
    --color-gris-oscuro: #2c2c2c;
    
    --color-blanco: #ffffff;
    
    /* Gradientes */
    --gradiente-hero: linear-gradient(135deg, #c41e3a 0%, #8B0000 50%, #000000 100%);
    --gradiente-dorado: linear-gradient(135deg, #d4af37, #ffd700);
    --gradiente-rojo: linear-gradient(135deg, #c41e3a, #8B0000);
    
    /* Sombras */
    --sombra-suave: 0 2px 10px rgba(0, 0, 0, 0.1);
    --sombra-media: 0 4px 15px rgba(196, 30, 58, 0.15);
    --sombra-fuerte: 0 8px 25px rgba(196, 30, 58, 0.25);
    --sombra-dorada: 0 4px 20px rgba(212, 175, 55, 0.3);
}
```

---

🔥 **¡VAMOS UNIVERSITARIO!** 🔥

Esta es la paleta oficial del club más grande del Perú.
