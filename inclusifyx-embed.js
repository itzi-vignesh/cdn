/**
 * InclusifyX Accessibility Widget - Universal Embed Script
 * Version: 1.0.0
 * 
 * Works with: Vanilla JS, jQuery, WordPress, Shopify, Wix, Squarespace, React, Vue, Angular, etc.
 * 
 * USAGE - Basic:
 * <script src="https://your-domain.com/inclusifyx-embed.js"></script>
 * 
 * USAGE - With Configuration:
 * <script>
 *   window.InclusifyXConfig = {
 *     position: 'right', // 'left' or 'right'
 *     language: 'en',
 *     debug: false,
 *   };
 * </script>
 * <script src="https://your-domain.com/inclusifyx-embed.js"></script>
 * 
 * USAGE - With jQuery:
 * <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
 * <script src="https://your-domain.com/inclusifyx-embed.js"></script>
 * <script>
 *   $(document).ready(function() {
 *     // Widget auto-initializes, or use:
 *     $('body').inclusifyX({ position: 'left' });
 *   });
 * </script>
 */

(function(window, document) {
  'use strict';

  // Prevent multiple loads
  if (window.InclusifyX && window.InclusifyX.loaded) {
    console.warn('[InclusifyX] Widget already loaded');
    return;
  }

  // ============================================
  // CONFIGURATION - Your CDN URL
  // ============================================
  const CDN_BASE_URL = 'https://cdn.hack4life.me';
  
  // Default configuration
  const defaultConfig = {
    cdnUrl: CDN_BASE_URL,
    position: 'right', // 'left' or 'right'
    language: 'en',
    autoInit: true,
    debug: true,  // Enable debug mode to see loading issues
  };

  // Merge with user config
  const config = Object.assign({}, defaultConfig, window.InclusifyXConfig || {});

  // Debug logger
  function log(message, data) {
    if (config.debug) {
      console.log('[InclusifyX] ' + message, data || '');
    }
  }

  // Load CSS file
  function loadCSS(callback) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = config.cdnUrl + '/inclusifyx-widget.css';
    
    link.onload = function() {
      log('✅ CSS loaded from: ' + link.href);
      callback(null);
    };
    
    link.onerror = function() {
      console.error('[InclusifyX] ❌ Failed to load CSS from: ' + link.href);
      console.error('[InclusifyX] Check: 1) File exists on server, 2) CORS headers enabled, 3) SSL certificate valid');
      callback(new Error('Failed to load CSS'));
    };
    
    log('Loading CSS from: ' + link.href);
    document.head.appendChild(link);
  }

  // Load JavaScript file
  function loadJS(callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = config.cdnUrl + '/inclusifyx-widget.js';
    script.defer = true;
    
    script.onload = function() {
      log('✅ JavaScript loaded from: ' + script.src);
      callback(null);
    };
    
    script.onerror = function() {
      console.error('[InclusifyX] ❌ Failed to load JS from: ' + script.src);
      console.error('[InclusifyX] Check: 1) File exists on server, 2) CORS headers enabled, 3) SSL certificate valid');
      callback(new Error('Failed to load JavaScript'));
    };
    
    log('Loading JavaScript from: ' + script.src);
    document.head.appendChild(script);
  }

  // Wait for DOM to be ready
  function onDOMReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  // Initialize widget
  function initialize() {
    log('Initializing widget...', config);
    
    // Load assets in parallel
    let cssLoaded = false;
    let jsLoaded = false;
    let errors = [];
    
    function checkComplete() {
      if (cssLoaded && jsLoaded) {
        if (errors.length > 0) {
          console.error('[InclusifyX] Failed to load:', errors);
        } else {
          log('Widget initialized successfully');
          
          // Call initialization hook if provided
          if (typeof config.onInit === 'function') {
            config.onInit(window.InclusifyX);
          }
        }
      }
    }
    
    loadCSS(function(err) {
      if (err) errors.push(err);
      cssLoaded = true;
      checkComplete();
    });
    
    loadJS(function(err) {
      if (err) errors.push(err);
      jsLoaded = true;
      checkComplete();
    });
  }

  // Public API (before widget loads)
  window.InclusifyX = {
    version: '1.0.0',
    loaded: true,
    config: config,
    
    init: function() {
      initialize();
    },
    
    // Placeholder methods (will be replaced when widget loads)
    show: function() {
      log('Widget not ready yet');
    },
    
    hide: function() {
      log('Widget not ready yet');
    },
    
    destroy: function() {
      const container = document.getElementById('inclusifyx-widget-root');
      if (container) container.remove();
      delete window.InclusifyX;
    },
  };

  // jQuery plugin registration
  function registerJQueryPlugin() {
    const $ = window.jQuery || window.$;
    
    if ($) {
      $.fn.inclusifyX = function(options) {
        if (options) {
          Object.assign(config, options);
        }
        initialize();
        return this;
      };
      
      log('jQuery plugin registered');
    }
  }

  // Auto-initialize
  if (config.autoInit !== false) {
    onDOMReady(function() {
      initialize();
      registerJQueryPlugin();
    });
  } else {
    onDOMReady(registerJQueryPlugin);
  }

})(window, document);
