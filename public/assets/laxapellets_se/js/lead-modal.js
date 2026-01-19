// Lead Modal Form for Buy Request
(function() {
  // Available products list
  const products = [
    { id: 'laxa-finspan', name: 'Laxå Finspån', price: '3 598.00 kr/pall' },
    { id: 'laxa-kutterspan', name: 'Laxå Kutterspån', price: '2 698.00 kr/pall' },
    { id: 'storsack-stropellets-8mm', name: 'Storsäck Ströpellets', price: '2 523.00 kr' },
    { id: 'storsack-varmepellets-8mm', name: 'Storsäck Pellets 8mm', price: '2 523.00 kr' },
    { id: 'stropellets-bulk-8mm', name: 'Ströpellets bulk 8mm', price: 'Kontakta oss' },
    { id: 'stropellets', name: 'Ströpellets', price: '2 198.00 kr/pall' },
    { id: 'varmepellets-6mm', name: 'Värmepellets 6mm', price: '4 198.00 kr/pall' },
    { id: 'varmepellets-8mm-bulk', name: 'Värmepellets 8mm Bulk', price: 'Kontakta oss' },
    { id: 'varmepellets-8mm', name: 'Värmepellets 8mm', price: '4 198.00 kr/pall' }
  ];

  // Shipping costs based on quantity
  const shippingTiers = [
    { min: 1, max: 1, label: '1 pall', cost: '1 000.00 kr' },
    { min: 2, max: 2, label: '2 pallar', cost: '750.00 kr' },
    { min: 3, max: 3, label: '3 pallar', cost: '500.00 kr' },
    { min: 4, max: Infinity, label: '4+ pallar', cost: 'Fri frakt' }
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

  // Get shipping cost display
  function getShippingDisplay(quantity) {
    const tier = shippingTiers.find(t => quantity >= t.min && quantity <= t.max);
    return tier ? tier.cost : 'Fri frakt';
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
              <label>Välj produkter *</label>
              <div class="lead-products-list" id="lead-products-list">
                ${products.map(p => `
                  <label class="lead-product-item ${currentProduct && currentProduct.id === p.id ? 'selected' : ''}">
                    <input type="checkbox" name="products" value="${p.id}" ${currentProduct && currentProduct.id === p.id ? 'checked' : ''}>
                    <span class="lead-product-name">${p.name}</span>
                    <span class="lead-product-price">${p.price}</span>
                  </label>
                `).join('')}
              </div>
            </div>
            
            <div class="lead-form-group">
              <label for="lead-quantity">Antal pallar *</label>
              <select id="lead-quantity" name="quantity" required>
                <option value="1">1 pall</option>
                <option value="2">2 pallar</option>
                <option value="3">3 pallar</option>
                <option value="4">4 pallar</option>
                <option value="5">5 pallar</option>
                <option value="6">6 pallar</option>
                <option value="7">7 pallar</option>
                <option value="8">8 pallar</option>
                <option value="9">9 pallar</option>
                <option value="10">10+ pallar</option>
              </select>
              <div class="lead-shipping-info" id="lead-shipping-info">
                <span class="shipping-label">Uppskattad frakt:</span>
                <span class="shipping-cost" id="lead-shipping-cost">1 000.00 kr</span>
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
    const quantitySelect = document.getElementById('lead-quantity');
    const productCheckboxes = overlay.querySelectorAll('input[name="products"]');
    
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
    
    // Update shipping cost on quantity change
    quantitySelect.addEventListener('change', function() {
      const quantity = parseInt(this.value);
      document.getElementById('lead-shipping-cost').textContent = getShippingDisplay(quantity);
    });
    
    // Toggle selected class on product items
    productCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        this.closest('.lead-product-item').classList.toggle('selected', this.checked);
      });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const selectedProducts = Array.from(productCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => products.find(p => p.id === cb.value)?.name)
        .join(', ');
      
      if (!selectedProducts) {
        alert('Vänligen välj minst en produkt.');
        return;
      }
      
      // Here you would normally send the data to a server
      // For now, we'll just show a success message
      const data = {
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        phone: formData.get('phone'),
        products: selectedProducts,
        quantity: formData.get('quantity'),
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
