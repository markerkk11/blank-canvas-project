// Product filter functionality
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-category');
    const products = document.querySelectorAll('.product_wrapper .product');
    
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
    
    // Filter functionality
    filterButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
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
        
        // Remove any loading spinner that might have been triggered
        const spinner = document.querySelector('.spinner');
        if (spinner) {
          spinner.classList.remove('submitting');
        }
        
        // Also unblock any jQuery blockUI if present
        if (typeof jQuery !== 'undefined' && jQuery.fn.unblock) {
          jQuery('.product_wrapper').unblock();
        }
      });
    });
    
    // Set "Visa alla" as active by default
    const showAllBtn = document.querySelector('.filter-category[data-filter="all"]');
    if (showAllBtn) {
      showAllBtn.classList.add('active');
    }
  });
})();
