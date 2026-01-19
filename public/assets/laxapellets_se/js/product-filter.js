// Product filter functionality
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-category');
    const products = document.querySelectorAll('.product_wrapper .product');
    
    console.log('Product filter initialized', { 
      filterButtons: filterButtons.length, 
      products: products.length 
    });
    
    if (!filterButtons.length || !products.length) return;
    
    // Define category mapping based on product URL patterns
    const categoryMapping = {
      // Värmepellets (category 18)
      'varmepellets': '18',
      'storsack-varmepellets': '18',
      // Ströprodukter (category 165)
      'stropellets': '165',
      'storsack-stropellets': '165',
      'kutterspan': '165',
      'finspan': '165'
    };
    
    // Assign categories to products based on href
    products.forEach(function(product) {
      const href = product.getAttribute('href') || '';
      let category = '';
      
      for (const [pattern, cat] of Object.entries(categoryMapping)) {
        if (href.includes(pattern)) {
          category = cat;
          break;
        }
      }
      
      product.setAttribute('data-category', category);
    });
    
    // Function to remove all loading states
    function removeLoadingStates() {
      console.log('Removing loading states...');
      
      // Remove submitting class from spinner
      const spinner = document.querySelector('.spinner');
      if (spinner) {
        spinner.classList.remove('submitting');
        console.log('Removed submitting from spinner');
      }
      
      // Remove submitting class from main and any parent
      const main = document.querySelector('main');
      if (main) {
        main.classList.remove('submitting');
      }
      
      // Remove submitting from product wrapper
      const productWrapper = document.querySelector('.product_wrapper');
      if (productWrapper) {
        productWrapper.classList.remove('submitting');
      }
      
      // Remove any blockUI overlays
      const blockOverlays = document.querySelectorAll('.blockUI, .blockOverlay, .blockMsg');
      blockOverlays.forEach(function(overlay) {
        overlay.remove();
        console.log('Removed blockUI overlay');
      });
      
      // jQuery unblock if available
      if (typeof jQuery !== 'undefined') {
        try {
          if (jQuery.fn.unblock) {
            jQuery('.product_wrapper').unblock();
            jQuery('main').unblock();
            jQuery('body').unblock();
          }
          // Also try to remove any loading classes jQuery might have added
          jQuery('.submitting').removeClass('submitting');
          jQuery('.loading').removeClass('loading');
        } catch(e) {
          console.log('jQuery unblock error:', e);
        }
      }
    }
    
    // Filter functionality
    filterButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log('Filter clicked:', this.getAttribute('data-filter'));
        
        const filter = this.getAttribute('data-filter');
        
        // Update active state
        filterButtons.forEach(function(btn) {
          btn.classList.remove('active');
        });
        this.classList.add('active');
        
        // Filter products
        products.forEach(function(product) {
          const productCategory = product.getAttribute('data-category');
          
          if (filter === 'all' || productCategory === filter) {
            product.style.display = '';
          } else {
            product.style.display = 'none';
          }
        });
        
        // Remove loading states immediately
        removeLoadingStates();
        
        // Also remove after a short delay in case another script adds them
        setTimeout(removeLoadingStates, 50);
        setTimeout(removeLoadingStates, 200);
        setTimeout(removeLoadingStates, 500);
        
        return false;
      }, true); // Use capture phase to run first
    });
    
    // Set "Visa alla" as active by default
    const showAllBtn = document.querySelector('.filter-category[data-filter="all"]');
    if (showAllBtn) {
      showAllBtn.classList.add('active');
    }
  });
})();
