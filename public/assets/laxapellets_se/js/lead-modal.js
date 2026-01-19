// Lead Modal Form for Buy Request
(function() {
  // Available products list with units
  const products = [
    { id: 'laxa-finspan', name: 'Laxå Finspån', price: '3 598.00 kr/pall', unit: 'pall', unitPlural: 'pallar' },
    { id: 'laxa-kutterspan', name: 'Laxå Kutterspån', price: '2 698.00 kr/pall', unit: 'pall', unitPlural: 'pallar' },
    { id: 'storsack-stropellets-8mm', name: 'Storsäck Ströpellets', price: '2 523.00 kr/st', unit: 'säck', unitPlural: 'säckar' },
    { id: 'storsack-varmepellets-8mm', name: 'Storsäck Pellets 8mm', price: '2 523.00 kr/st', unit: 'säck', unitPlural: 'säckar' },
    { id: 'stropellets-bulk-8mm', name: 'Ströpellets bulk 8mm', price: '4 548.00 kr/ton', unit: 'ton', unitPlural: 'ton' },
    { id: 'stropellets', name: 'Ströpellets', price: '2 198.00 kr/pall', unit: 'pall', unitPlural: 'pallar' },
    { id: 'varmepellets-6mm', name: 'Värmepellets 6mm', price: '4 198.00 kr/pall', unit: 'pall', unitPlural: 'pallar' },
    { id: 'varmepellets-8mm-bulk', name: 'Värmepellets 8mm Bulk', price: '4 548.00 kr/ton', unit: 'ton', unitPlural: 'ton' },
    { id: 'varmepellets-8mm', name: 'Värmepellets 8mm', price: '4 198.00 kr/pall', unit: 'pall', unitPlural: 'pallar' }
  ];

  // Get current product from page
  function getCurrentProduct() {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      const productName = ogTitle.getAttribute('content');
      return products.find(p => p.name === productName) || null;
    }
    return null;
  }

  // Generate quantity options based on unit
  function getQuantityOptions(product) {
    if (product.unit === 'ton') {
      return [
        { value: '5', label: '5 ton' },
        { value: '10', label: '10 ton' },
        { value: '15', label: '15 ton' },
        { value: '20', label: '20 ton' },
        { value: '25', label: '25 ton' },
        { value: '30', label: '30+ ton' }
      ];
    } else if (product.unit === 'säck') {
      return [
        { value: '1', label: '1 säck' },
        { value: '2', label: '2 säckar' },
        { value: '3', label: '3 säckar' },
        { value: '4', label: '4 säckar' },
        { value: '5', label: '5+ säckar' }
      ];
    } else {
      // Default: pall
      return [
        { value: '1', label: '1 pall' },
        { value: '2', label: '2 pallar' },
        { value: '3', label: '3 pallar' },
        { value: '4', label: '4 pallar' },
        { value: '5', label: '5 pallar' },
        { value: '6', label: '6 pallar' },
        { value: '7', label: '7 pallar' },
        { value: '8', label: '8 pallar' },
        { value: '9', label: '9 pallar' },
        { value: '10', label: '10+ pallar' }
      ];
    }
  }

  // Create modal HTML
  function createModal() {
    const currentProduct = getCurrentProduct();
    
    const modalHTML = `
      <div id="lead-modal-overlay" class="lead-modal-overlay">
        <div class="lead-modal">
          <button type="button" class="lead-modal-close" aria-label="Stäng">&times;</button>
          
          <div class="lead-modal-header">
            <h2>Skicka köpförfrågan</h2>
            <p>Fyll i formuläret så kontaktar vi dig med en offert.</p>
          </div>
          
          <form id="lead-form" class="lead-form">
            <div class="lead-form-row">
              <div class="lead-form-group">
                <label for="lead-firstname">Förnamn *</label>
                <input type="text" id="lead-firstname" name="firstname" required>
              </div>
              <div class="lead-form-group">
                <label for="lead-lastname">Efternamn *</label>
                <input type="text" id="lead-lastname" name="lastname" required>
              </div>
            </div>
            
            <div class="lead-form-group">
              <label for="lead-phone">Telefonnummer *</label>
              <input type="tel" id="lead-phone" name="phone" required>
            </div>
            
            <div class="lead-form-group">
              <label>Välj produkter och antal *</label>
              <div class="lead-products-list" id="lead-products-list">
                ${products.map(p => {
                  const isSelected = currentProduct && currentProduct.id === p.id;
                  const options = getQuantityOptions(p);
                  return `
                  <div class="lead-product-item ${isSelected ? 'selected' : ''}" data-product-id="${p.id}">
                    <label class="lead-product-checkbox">
                      <input type="checkbox" name="products" value="${p.id}" ${isSelected ? 'checked' : ''}>
                      <span class="lead-product-info">
                        <span class="lead-product-name">${p.name}</span>
                        <span class="lead-product-price">${p.price}</span>
                      </span>
                    </label>
                    <div class="lead-product-quantity ${isSelected ? 'visible' : ''}">
                      <select name="quantity-${p.id}" class="lead-quantity-select">
                        ${options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                      </select>
                    </div>
                  </div>
                `}).join('')}
              </div>
            </div>
            
            <div class="lead-form-group">
              <label for="lead-message">Övrig information</label>
              <textarea id="lead-message" name="message" rows="3" placeholder="Ange eventuell extra information om din beställning..."></textarea>
            </div>
            
            <button type="submit" class="lead-submit-btn">Skicka förfrågan</button>
          </form>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    const overlay = document.getElementById('lead-modal-overlay');
    const closeBtn = overlay.querySelector('.lead-modal-close');
    const form = document.getElementById('lead-form');
    const productItems = overlay.querySelectorAll('.lead-product-item');
    
    // Close modal on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeModal();
      }
    });
    
    // Close modal on close button click
    closeBtn.addEventListener('click', closeModal);
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeModal();
      }
    });
    
    // Toggle selected class and quantity visibility on product items
    productItems.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      const quantityDiv = item.querySelector('.lead-product-quantity');
      
      checkbox.addEventListener('change', function() {
        item.classList.toggle('selected', this.checked);
        quantityDiv.classList.toggle('visible', this.checked);
      });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const selectedProducts = [];
      
      productItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
          const productId = checkbox.value;
          const product = products.find(p => p.id === productId);
          const quantity = formData.get(`quantity-${productId}`);
          selectedProducts.push({
            name: product.name,
            quantity: quantity,
            unit: product.unit
          });
        }
      });
      
      if (selectedProducts.length === 0) {
        alert('Vänligen välj minst en produkt.');
        return;
      }
      
      // Format products for display
      const productsDisplay = selectedProducts
        .map(p => `${p.name}: ${p.quantity} ${p.quantity === '1' ? p.unit : products.find(pr => pr.name === p.name)?.unitPlural || p.unit}`)
        .join(', ');
      
      // Here you would normally send the data to a server
      const data = {
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        phone: formData.get('phone'),
        products: selectedProducts,
        message: formData.get('message')
      };
      
      console.log('Lead form submitted:', data);
      
      // Show success message
      form.innerHTML = `
        <div class="lead-success">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1d525c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h3>Tack för din förfrågan!</h3>
          <p>Vi återkommer till dig så snart som möjligt med en offert.</p>
          <button type="button" class="lead-submit-btn" onclick="closeLeadModal()">Stäng</button>
        </div>
      `;
    });
  }
  
  // Open modal
  function openModal() {
    let overlay = document.getElementById('lead-modal-overlay');
    if (!overlay) {
      createModal();
      overlay = document.getElementById('lead-modal-overlay');
    }
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  
  // Close modal
  function closeModal() {
    const overlay = document.getElementById('lead-modal-overlay');
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
  
  // Expose functions globally
  window.openLeadModal = openModal;
  window.closeLeadModal = closeModal;
  
  // Initialize - attach click handlers to buy request buttons
  document.addEventListener('DOMContentLoaded', function() {
    const buyButtons = document.querySelectorAll('.buy-request-container button');
    buyButtons.forEach(btn => {
      btn.addEventListener('click', openModal);
    });
  });
})();
