// Lead Modal Form for Buy Request
(function() {
  // Available products list with units and numeric prices
  const products = [
    { id: 'laxa-finspan', name: 'Laxå Finspån', price: '2 450.00 kr/pall', numericPrice: 2450, unit: 'pall', unitPlural: 'pallar' },
    { id: 'laxa-kutterspan', name: 'Laxå Kutterspån', price: '1 820.00 kr/pall', numericPrice: 1820, unit: 'pall', unitPlural: 'pallar' },
    { id: 'storsack-stropellets-8mm', name: 'Storsäck Ströpellets', price: '1 770.00 kr/st', numericPrice: 1770, unit: 'säck', unitPlural: 'säckar' },
    { id: 'storsack-varmepellets-8mm', name: 'Storsäck Pellets 8mm', price: '1 770.00 kr/st', numericPrice: 1770, unit: 'säck', unitPlural: 'säckar' },
    { id: 'stropellets-bulk-8mm', name: 'Ströpellets bulk 8mm', price: '3 180.00 kr/ton', numericPrice: 3180, unit: 'ton', unitPlural: 'ton' },
    { id: 'stropellets', name: 'Ströpellets', price: '2 800.00 kr/pall', numericPrice: 2800, unit: 'pall', unitPlural: 'pallar' },
    { id: 'varmepellets-6mm', name: 'Värmepellets 6mm', price: '2 940.00 kr/pall', numericPrice: 2940, unit: 'pall', unitPlural: 'pallar' },
    { id: 'varmepellets-8mm-bulk', name: 'Värmepellets 8mm Bulk', price: '3 180.00 kr/ton', numericPrice: 3180, unit: 'ton', unitPlural: 'ton' },
    { id: 'varmepellets-8mm', name: 'Värmepellets 8mm', price: '2 940.00 kr/pall', numericPrice: 2940, unit: 'pall', unitPlural: 'pallar' }
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

  // Get unit label for quantity input
  function getUnitLabel(product) {
    return product.unit;
  }

  // Calculate total price
  function calculateTotal() {
    const productItems = document.querySelectorAll('.lead-product-item');
    let total = 0;
    
    productItems.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        const productId = checkbox.value;
        const product = products.find(p => p.id === productId);
        const quantityInput = item.querySelector('.lead-quantity-input');
        let quantity = parseFloat(quantityInput.value) || 1;
        
        if (product && product.numericPrice) {
          total += product.numericPrice * quantity;
        }
      }
    });
    
    // Update total display
    const totalDisplay = document.getElementById('lead-total-price');
    if (totalDisplay) {
      const formattedTotal = total.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      totalDisplay.textContent = `${formattedTotal} kr`;
      totalDisplay.parentElement.style.display = total > 0 ? 'flex' : 'none';
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
                <input type="text" id="lead-firstname" name="firstname" required pattern="[A-Za-zÀ-ÿ\\s\\-']+" title="Endast bokstäver tillåtna">
                <span class="lead-error-message" id="firstname-error"></span>
              </div>
              <div class="lead-form-group">
                <label for="lead-lastname">Efternamn *</label>
                <input type="text" id="lead-lastname" name="lastname" required pattern="[A-Za-zÀ-ÿ\\s\\-']+" title="Endast bokstäver tillåtna">
                <span class="lead-error-message" id="lastname-error"></span>
              </div>
            </div>
            
            <div class="lead-form-group">
              <label for="lead-phone">Telefonnummer *</label>
              <input type="tel" id="lead-phone" name="phone" required pattern="[0-9\\s\\-\\+()]+" title="Endast siffror tillåtna">
              <span class="lead-error-message" id="phone-error"></span>
            </div>
            
            <div class="lead-form-group">
              <label>Välj produkter och antal *</label>
              <div class="lead-products-list" id="lead-products-list">
                ${products.map(p => {
                  const isSelected = currentProduct && currentProduct.id === p.id;
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
                      <div class="lead-quantity-wrapper">
                        <input type="number" name="quantity-${p.id}" class="lead-quantity-input" value="1" min="0.1" max="999" step="0.1">
                        <span class="lead-unit-label">${p.unit}</span>
                      </div>
                    </div>
                  </div>
                `}).join('')}
              </div>
            </div>
            
            <div class="lead-order-total" style="display: none;">
              <span class="lead-total-label">Totalt ordervärde:</span>
              <span id="lead-total-price" class="lead-total-amount">0.00 kr</span>
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
      const quantityInput = item.querySelector('.lead-quantity-input');
      
      checkbox.addEventListener('change', function() {
        item.classList.toggle('selected', this.checked);
        quantityDiv.classList.toggle('visible', this.checked);
        calculateTotal();
      });
      
      // Update total on input (allow empty while typing)
      quantityInput.addEventListener('input', function() {
        calculateTotal();
      });
      
      // Validate minimum on blur (when user leaves the field)
      quantityInput.addEventListener('blur', function() {
        const val = parseFloat(this.value);
        if (isNaN(val) || val < 0.1) {
          this.value = 1;
        }
        calculateTotal();
      });
    });
    
    // Add real-time validation for name fields
    const firstnameInput = document.getElementById('lead-firstname');
    const lastnameInput = document.getElementById('lead-lastname');
    const phoneInput = document.getElementById('lead-phone');
    
    function validateName(input, errorId) {
      const value = input.value;
      const errorEl = document.getElementById(errorId);
      const hasNumbers = /[0-9]/.test(value);
      
      if (hasNumbers) {
        errorEl.textContent = 'Siffror är inte tillåtna i namn';
        input.classList.add('lead-input-error');
        return false;
      } else {
        errorEl.textContent = '';
        input.classList.remove('lead-input-error');
        return true;
      }
    }
    
    function validatePhone(input) {
      const value = input.value;
      const errorEl = document.getElementById('phone-error');
      const hasLetters = /[a-zA-ZÀ-ÿ]/.test(value);
      
      if (hasLetters) {
        errorEl.textContent = 'Endast siffror tillåtna i telefonnummer';
        input.classList.add('lead-input-error');
        return false;
      } else {
        errorEl.textContent = '';
        input.classList.remove('lead-input-error');
        return true;
      }
    }
    
    // Filter input as user types
    firstnameInput.addEventListener('input', function() {
      this.value = this.value.replace(/[0-9]/g, '');
      validateName(this, 'firstname-error');
    });
    
    lastnameInput.addEventListener('input', function() {
      this.value = this.value.replace(/[0-9]/g, '');
      validateName(this, 'lastname-error');
    });
    
    phoneInput.addEventListener('input', function() {
      this.value = this.value.replace(/[a-zA-ZÀ-ÿ]/g, '');
      validatePhone(this);
    });
    
    // Calculate initial total if product is pre-selected
    calculateTotal();
    
    // Form submission
    form.addEventListener('submit', async function(e) {
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
      
      // Get total price
      const totalPriceEl = document.getElementById('lead-total-price');
      const totalPrice = totalPriceEl ? totalPriceEl.textContent : 'Ej beräknat';
      
      // Prepare data for submission
      const data = {
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        phone: formData.get('phone'),
        products: selectedProducts,
        message: formData.get('message'),
        totalPrice: totalPrice
      };
      
      console.log('Lead form submitted:', data);
      
      // Show loading state
      const submitBtn = form.querySelector('.lead-submit-btn');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Skickar...';
      submitBtn.disabled = true;
      
      // Send to Telegram via edge function
      try {
        const response = await fetch('https://uisrdborglycmwhdrouo.supabase.co/functions/v1/send-telegram-lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        console.log('Telegram response:', result);
        
        if (!response.ok) {
          console.error('Failed to send to Telegram:', result);
        }
      } catch (error) {
        console.error('Error sending to Telegram:', error);
      }
      
      // Show success message regardless (don't block user experience)
      form.innerHTML = `
        <div class="lead-success">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1d525c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h3>Tack för din förfrågan!</h3>
          <p>Vi återkommer till dig så snart som möjligt med en offert.</p>
          <div class="lead-success-buttons">
            <button type="button" class="lead-submit-btn lead-new-order-btn" onclick="window.startNewOrder()">Ny beställning</button>
            <button type="button" class="lead-submit-btn lead-close-btn" onclick="closeLeadModal()">Stäng</button>
          </div>
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
  
  // Start new order - reset form and reopen
  function startNewOrder() {
    const overlay = document.getElementById('lead-modal-overlay');
    if (overlay) {
      overlay.remove();
    }
    createModal();
    const newOverlay = document.getElementById('lead-modal-overlay');
    newOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  
  // Expose functions globally
  window.openLeadModal = openModal;
  window.closeLeadModal = closeModal;
  window.startNewOrder = startNewOrder;
  
  // Initialize - attach click handlers to buy request buttons
  document.addEventListener('DOMContentLoaded', function() {
    const buyButtons = document.querySelectorAll('.buy-request-container button');
    buyButtons.forEach(btn => {
      btn.addEventListener('click', openModal);
    });
  });
})();
