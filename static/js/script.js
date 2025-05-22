document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mainContent = document.querySelector('.main-content');
    const themeToggle = document.getElementById('theme-toggle');
    const predictionForm = document.getElementById('prediction-form');
    const predictButton = document.getElementById('predict-button');
    const resultCard = document.getElementById('result-card');
    const predictionNumber = document.getElementById('prediction-number');
    const exportBtn = document.getElementById('export-btn');
    const shareBtn = document.getElementById('share-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    const toastContainer = document.getElementById('toast-container');

    // Form Elements
    const storeIdInput = document.getElementById('store_id');
    const skuIdInput = document.getElementById('sku_id');
    const totalPriceInput = document.getElementById('total_price');
    const basePriceInput = document.getElementById('base_price');
    
    // Error Message Elements
    const storeIdError = document.getElementById('store_id_error');
    const skuIdError = document.getElementById('sku_id_error');
    const totalPriceError = document.getElementById('total_price_error');
    const basePriceError = document.getElementById('base_price_error');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // Check for saved sidebar state
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState === 'true') {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }

    // Toggle Sidebar
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });

    // Toggle Theme
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDarkTheme = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        
        if (isDarkTheme) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        showToast('Theme Changed', `Switched to ${isDarkTheme ? 'dark' : 'light'} theme`, 'info');
    });

    // Form Validation
    function validateForm() {
        let isValid = true;
        
        // Reset error messages
        storeIdError.textContent = '';
        skuIdError.textContent = '';
        totalPriceError.textContent = '';
        basePriceError.textContent = '';
        
        // Validate Store ID
        if (!storeIdInput.value) {
            storeIdError.textContent = 'Store ID is required';
            isValid = false;
        } else if (parseInt(storeIdInput.value) <= 0) {
            storeIdError.textContent = 'Store ID must be a positive number';
            isValid = false;
        }
        
        // Validate SKU ID
        if (!skuIdInput.value) {
            skuIdError.textContent = 'SKU ID is required';
            isValid = false;
        } else if (parseInt(skuIdInput.value) <= 0) {
            skuIdError.textContent = 'SKU ID must be a positive number';
            isValid = false;
        }
        
        // Validate Total Price
        if (!totalPriceInput.value) {
            totalPriceError.textContent = 'Total Price is required';
            isValid = false;
        } else if (parseFloat(totalPriceInput.value) <= 0) {
            totalPriceError.textContent = 'Total Price must be a positive number';
            isValid = false;
        }
        
        // Validate Base Price
        if (!basePriceInput.value) {
            basePriceError.textContent = 'Base Price is required';
            isValid = false;
        } else if (parseFloat(basePriceInput.value) <= 0) {
            basePriceError.textContent = 'Base Price must be a positive number';
            isValid = false;
        }
        
        // Validate Base Price is not greater than Total Price
        if (parseFloat(basePriceInput.value) > parseFloat(totalPriceInput.value)) {
            basePriceError.textContent = 'Base Price should not exceed Total Price';
            isValid = false;
        }
        
        return isValid;
    }

    // Form Submission
    predictionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showToast('Validation Error', 'Please fix the errors in the form', 'error');
            return;
        }
        
        // Show loading overlay
        loadingOverlay.style.display = 'flex';
        
        // Get form values
        const formData = {
            store_id: parseInt(storeIdInput.value),
            sku_id: parseInt(skuIdInput.value),
            total_price: parseFloat(totalPriceInput.value),
            base_price: parseFloat(basePriceInput.value),
            is_featured_sku: document.querySelector('input[name="is_featured_sku"]:checked').value,
            is_display_sku: document.querySelector('input[name="is_display_sku"]:checked').value
        };
        
        // Simulate API call delay
        setTimeout(() => {
            try {
                const prediction = calculatePrediction(formData);
                displayPrediction(prediction);
                showToast('Prediction Complete', 'Sales prediction has been calculated successfully', 'success');
            } catch (error) {
                showToast('Prediction Error', error.message, 'error');
            } finally {
                loadingOverlay.style.display = 'none';
            }
        }, 1500);
    });

    // Calculate Prediction (Mock ML Model)
    function calculatePrediction(data) {
        // Input validation
        if (data.store_id <= 0 || data.sku_id <= 0) {
            throw new Error("Store ID and SKU ID must be positive numbers");
        }

        if (data.total_price <= 0 || data.base_price <= 0) {
            throw new Error("Prices must be positive numbers");
        }

        // Check if base price is higher than total price
        if (data.base_price > data.total_price) {
            throw new Error("Base price should not exceed total price");
        }

        // More sophisticated mock prediction algorithm
        const baseUnits = Math.floor(Math.random() * 15) + 5; // Random base between 5-20

        // Store factors - different stores have different sales patterns
        const storeFactors = {
            1: 1.2, // High performing store
            2: 0.9, // Average store
            3: 1.5, // Top performing store
            4: 0.7, // Underperforming store
            5: 1.1, // Good performing store
        };

        // Use store factor if available, otherwise calculate based on ID
        const storeMultiplier = storeFactors[data.store_id] || 0.8 + (data.store_id % 10) * 0.1;

        // SKU popularity factor
        const skuMultiplier = (data.sku_id % 5) + 0.5;

        // Price elasticity - how price sensitive is this product
        const priceRatio = data.base_price / data.total_price;
        const priceElasticity = priceRatio > 0.8 ? 1.2 : 0.9; // Higher ratio (smaller discount) means less price sensitive

        // Marketing factors
        const featuredBonus = data.is_featured_sku === "1" ? 1.5 : 1;
        const displayBonus = data.is_display_sku === "1" ? 1.3 : 1;

        // Seasonal factor (based on current month)
        const currentMonth = new Date().getMonth() + 1;
        const seasonalFactor = 0.9 + (currentMonth % 12) * 0.02;

        // Calculate prediction
        let prediction = baseUnits * storeMultiplier * skuMultiplier * priceElasticity * featuredBonus * displayBonus * seasonalFactor;

        // Add some randomness to simulate real-world variability
        const randomFactor = 0.85 + Math.random() * 0.3; // Between 0.85 and 1.15
        prediction = prediction * randomFactor;

        // Round to nearest whole number
        return Math.round(prediction);
    }

    // Display Prediction Result
    function displayPrediction(prediction) {
        // Show result card
        resultCard.style.display = 'block';
        resultCard.classList.add('animate-slide-up');
        
        // Animate the prediction number
        animateNumber(0, prediction, 1500, predictionNumber);
        
        // Scroll to result card
        setTimeout(() => {
            resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    // Animate Number
    function animateNumber(start, end, duration, element) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = end;
            }
        };
        window.requestAnimationFrame(step);
    }

    // Export Prediction
    exportBtn.addEventListener('click', function() {
        try {
            const prediction = parseInt(predictionNumber.textContent);
            const formData = {
                store_id: storeIdInput.value,
                sku_id: skuIdInput.value,
                total_price: totalPriceInput.value,
                base_price: basePriceInput.value,
                is_featured_sku: document.querySelector('input[name="is_featured_sku"]:checked').value === "1" ? "Yes" : "No",
                is_display_sku: document.querySelector('input[name="is_display_sku"]:checked').value === "1" ? "Yes" : "No"
            };
            
            // Create CSV content with all form parameters
            const csvContent = `data:text/csv;charset=utf-8,Prediction,Timestamp,Store ID,SKU ID,Total Price,Base Price,Is Featured,Is Display\n${prediction},${new Date().toLocaleString()},${formData.store_id},${formData.sku_id},${formData.total_price},${formData.base_price},${formData.is_featured_sku},${formData.is_display_sku}`;

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `sales_prediction_${new Date().getTime()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('Export Successful', 'The prediction data has been exported to CSV', 'success');
        } catch (error) {
            showToast('Export Failed', 'Failed to export prediction data', 'error');
        }
    });

    // Share Prediction
    shareBtn.addEventListener('click', function() {
        try {
            const prediction = predictionNumber.textContent;
            const formData = {
                store_id: storeIdInput.value,
                sku_id: skuIdInput.value,
                total_price: totalPriceInput.value,
                base_price: basePriceInput.value,
                is_featured_sku: document.querySelector('input[name="is_featured_sku"]:checked').value === "1" ? "Yes" : "No",
                is_display_sku: document.querySelector('input[name="is_display_sku"]:checked').value === "1" ? "Yes" : "No"
            };
            
            const shareText = `Sales Prediction Result: ${prediction} units\n\nParameters:\nStore ID: ${formData.store_id}\nSKU ID: ${formData.sku_id}\nTotal Price: $${formData.total_price}\nBase Price: $${formData.base_price}\nFeatured: ${formData.is_featured_sku}\nDisplay: ${formData.is_display_sku}`;

            if (navigator.share) {
                navigator.share({
                    title: 'Sales Prediction',
                    text: shareText,
                    url: window.location.href,
                })
                .then(() => {
                    showToast('Shared Successfully', 'The prediction has been shared', 'success');
                })
                .catch((error) => {
                    if (error.name !== 'AbortError') {
                        showToast('Share Failed', 'Failed to share prediction', 'error');
                    }
                });
            } else {
                navigator.clipboard.writeText(shareText)
                    .then(() => {
                        showToast('Copied to Clipboard', 'The prediction details have been copied to your clipboard', 'success');
                    })
                    .catch(() => {
                        showToast('Copy Failed', 'Failed to copy prediction to clipboard', 'error');
                    });
            }
        } catch (error) {
            showToast('Share Failed', 'An error occurred while trying to share the prediction', 'error');
        }
    });

    // Toast Notification System
    function showToast(title, message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, 5000);
        
        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        });
    }

    // About Card Buttons
    const aboutButtons = document.querySelectorAll('.about-buttons .btn');
    aboutButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            if (buttonText.includes('Source Code')) {
                showToast('Source Code', 'Opening source code repository in a new tab', 'info');
            } else if (buttonText.includes('Report Issue')) {
                showToast('Report Issue', 'Opening issue reporter in a new tab', 'info');
            } else if (buttonText.includes('Help')) {
                showToast('Help', 'Documentation is available in the Help section', 'info');
            }
        });
    });

    // Mobile Navigation
    function handleResize() {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        } else {
            if (localStorage.getItem('sidebarCollapsed') !== 'true') {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('expanded');
            }
        }
    }

    // Initial check on page load
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);
});