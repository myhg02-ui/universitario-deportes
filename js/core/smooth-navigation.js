/**
 * SMOOTH NAVIGATION SYSTEM
 * Evita parpadeos del header al cambiar de página
 * Comportamiento similar a Word: El header permanece fijo
 */

(function() {
    'use strict';

    // ============================================
    // 1. MARCAR PÁGINA COMO CARGADA
    // ============================================
    
    // Marcar cuando el DOM está listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', markPageLoaded);
    } else {
        markPageLoaded();
    }

    function markPageLoaded() {
        // Agregar clase para indicar que la página está lista
        document.documentElement.classList.add('page-loaded');
        document.body.classList.add('page-loaded');
    }

    // ============================================
    // 2. PRELOAD HEADER CRÍTICO
    // ============================================
    
    // Asegurar que el header se renderice inmediatamente
    window.addEventListener('load', function() {
        const header = document.querySelector('header');
        if (header) {
            // Forzar repaint para estabilizar header
            header.style.transform = 'translateZ(0)';
        }
    });

    // ============================================
    // 3. TRANSICIÓN SUAVE AL CAMBIAR PÁGINA
    // ============================================
    
    // Capturar clicks en links de navegación
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        
        // Solo aplicar a links internos del header
        if (link && isHeaderLink(link)) {
            const href = link.getAttribute('href');
            
            // Si es un link válido (no logout, no #)
            if (href && href !== '#' && !href.includes('logout')) {
                // Aplicar transición suave al contenido (no al header)
                fadeOutContent();
            }
        }
    });

    function isHeaderLink(link) {
        // Verificar si el link está dentro del header o nav
        return link.closest('header') || 
               link.closest('nav') || 
               link.classList.contains('nav-link-unified') ||
               link.classList.contains('dropdown-item');
    }

    function fadeOutContent() {
        const main = document.querySelector('main') || document.body;
        
        // Fade out suave del contenido (NO del header)
        main.style.transition = 'opacity 0.15s ease';
        main.style.opacity = '0.8';
    }

    // ============================================
    // 4. OPTIMIZAR HEADER EN CADA CARGA
    // ============================================
    
    function optimizeHeader() {
        const header = document.querySelector('header');
        
        if (header) {
            // Asegurar posición fija
            header.style.position = 'fixed';
            header.style.top = '0';
            header.style.left = '0';
            header.style.right = '0';
            header.style.zIndex = '9999';
            
            // Evitar parpadeo
            header.style.backfaceVisibility = 'hidden';
            header.style.transform = 'translateZ(0)';
            header.style.willChange = 'transform';
        }
    }

    // Optimizar header cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', optimizeHeader);
    } else {
        optimizeHeader();
    }

    // ============================================
    // 5. MANTENER HEADER VISIBLE DURANTE NAVEGACIÓN
    // ============================================
    
    // Antes de que la página se descargue
    window.addEventListener('beforeunload', function() {
        const header = document.querySelector('header');
        
        if (header) {
            // Mantener header visible
            header.style.opacity = '1';
            header.style.visibility = 'visible';
        }
    });

    // ============================================
    // 6. CACHE DE ESTILOS DEL HEADER
    // ============================================
    
    // Guardar estado del header en sessionStorage
    function cacheHeaderState() {
        const header = document.querySelector('header');
        
        if (header) {
            sessionStorage.setItem('headerLoaded', 'true');
        }
    }

    // Restaurar header inmediatamente si ya estaba cargado
    function restoreHeaderState() {
        if (sessionStorage.getItem('headerLoaded') === 'true') {
            const header = document.querySelector('header');
            
            if (header) {
                header.style.opacity = '1';
                header.style.visibility = 'visible';
            }
        }
    }

    // Ejecutar al cargar
    restoreHeaderState();
    window.addEventListener('load', cacheHeaderState);

    // ============================================
    // 7. SMOOTH SCROLL (BONUS)
    // ============================================
    
    // Scroll suave para links internos (si aplica)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#') {
                const target = document.querySelector(targetId);
                
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ============================================
    // 8. PERFORMANCE MONITORING (OPCIONAL)
    // ============================================
    
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', function() {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            
            console.log('🚀 Página cargada en:', loadTime + 'ms');
            
            // Si la carga es muy rápida, el parpadeo será mínimo
            if (loadTime < 500) {
                console.log('✅ Carga rápida - Parpadeo minimizado');
            }
        });
    }

    // ============================================
    // 9. FALLBACK PARA NAVEGADORES ANTIGUOS
    // ============================================
    
    // Si el navegador no soporta algunas características
    if (!('classList' in document.documentElement)) {
        console.warn('⚠️ Navegador antiguo detectado - Algunas optimizaciones deshabilitadas');
    }

    // ============================================
    // 10. EXPORT PARA USO EXTERNO
    // ============================================
    
    window.smoothNavigation = {
        optimize: optimizeHeader,
        cache: cacheHeaderState,
        restore: restoreHeaderState
    };

})();
