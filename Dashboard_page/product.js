// ============================================================================
// PRODUCT RECOMMENDATION PAGE - JAVASCRIPT
// ============================================================================
// This file handles:
// 1. Reading disease and confidence from URL parameters
// 2. Rendering product sections dynamically
// 3. Highlighting the detected condition section
// 4. Auto-scrolling to the highlighted section
// 5. Handling product card interactions and buy button clicks
// ============================================================================

// ============================================================================
// 1. PRODUCT DATA STRUCTURE
// ============================================================================
// Comprehensive product database organized by skin condition
const productDatabase = {
    acne: {
        title: "Acne Treatment Products",
        icon: "fa-spray-can-sparkles",
        products: [
            {
                name: "Neutrogena Oil-Free Acne Wash",
                reason: "Contains 2% salicylic acid to unclog pores, reduce inflammation, and prevent future breakouts",
                skinTypes: ["Oily", "Combination", "Acne-Prone"],
                badge: "Dermatologist Recommended",
                buyLink: "https://www.amazon.in/s?k=Neutrogena+Oil-Free+Acne+Wash"
            },
            {
                name: "The Ordinary Niacinamide 10% + Zinc 1%",
                reason: "Reduces sebum production, minimizes pores, and improves overall skin texture for acne-prone skin",
                skinTypes: ["Oily", "Acne-Prone", "Combination"],
                badge: "Best Seller",
                buyLink: "https://www.amazon.in/s?k=The+Ordinary+Niacinamide"
            },
            {
                name: "Cetaphil Pro Oil Removing Foam Wash",
                reason: "Gentle yet effective cleanser that removes excess oil without stripping skin's natural moisture barrier",
                skinTypes: ["Oily", "Sensitive", "Acne-Prone"],
                badge: "Gentle Formula",
                buyLink: "https://www.amazon.in/s?k=Cetaphil+Pro+Oil+Removing+Foam"
            },
            {
                name: "Plum Green Tea Clear Face Mask",
                reason: "Natural ingredients with tea tree oil and green tea extract to combat acne and reduce inflammation",
                skinTypes: ["All Types", "Acne-Prone"],
                badge: "Natural & Vegan",
                buyLink: "https://www.amazon.in/s?k=Plum+Green+Tea+Clear+Face+Mask"
            }
        ]
    },
    oily: {
        title: "Oily Skin Care Products",
        icon: "fa-droplet",
        products: [
            {
                name: "Bioré Charcoal Deep Cleansing Pore Strips",
                reason: "Deep cleans pores, removes excess oil and blackheads for visibly clearer skin",
                skinTypes: ["Oily", "Combination"],
                badge: "Deep Cleansing",
                buyLink: "https://www.amazon.in/s?k=Biore+Charcoal+Pore+Strips"
            },
            {
                name: "Minimalist Salicylic Acid 2% Face Serum",
                reason: "Controls oil production, unclogs pores, and prevents breakouts with beta hydroxy acid",
                skinTypes: ["Oily", "Acne-Prone"],
                badge: "Oil Control",
                buyLink: "https://www.amazon.in/s?k=Minimalist+Salicylic+Acid+Serum"
            },
            {
                name: "Lotus Herbals Oil Control Mattifying Gel",
                reason: "Lightweight gel formula that controls shine and keeps skin matte throughout the day",
                skinTypes: ["Oily", "Combination"],
                badge: "Matte Finish",
                buyLink: "https://www.amazon.in/s?k=Lotus+Oil+Control+Gel"
            },
            {
                name: "Innisfree Super Volcanic Pore Clay Mask",
                reason: "Absorbs excess sebum, tightens pores, and provides a deep cleansing treatment",
                skinTypes: ["Oily", "Combination"],
                badge: "Pore Care",
                buyLink: "https://www.amazon.in/s?k=Innisfree+Volcanic+Clay+Mask"
            }
        ]
    },
    dry: {
        title: "Dry Skin Hydration Products",
        icon: "fa-hand-holding-droplet",
        products: [
            {
                name: "CeraVe Moisturizing Cream",
                reason: "Rich, non-greasy formula with ceramides and hyaluronic acid for 24-hour hydration",
                skinTypes: ["Dry", "Sensitive", "Normal"],
                badge: "Intense Hydration",
                buyLink: "https://www.amazon.in/s?k=CeraVe+Moisturizing+Cream"
            },
            {
                name: "Neutrogena Hydro Boost Water Gel",
                reason: "Hyaluronic acid-based gel that provides deep hydration without feeling heavy or greasy",
                skinTypes: ["Dry", "Combination", "Normal"],
                badge: "Lightweight",
                buyLink: "https://www.amazon.in/s?k=Neutrogena+Hydro+Boost"
            },
            {
                name: "The Body Shop Vitamin E Moisture Cream",
                reason: "Nourishing cream with vitamin E that protects and hydrates dry, parched skin",
                skinTypes: ["Dry", "Very Dry", "Sensitive"],
                badge: "Vitamin Enriched",
                buyLink: "https://www.amazon.in/s?k=Body+Shop+Vitamin+E+Cream"
            },
            {
                name: "Nivea Soft Light Moisturizer",
                reason: "Jojoba oil and vitamin E provide instant moisture and long-lasting softness",
                skinTypes: ["Dry", "Normal", "Sensitive"],
                badge: "Quick Absorbing",
                buyLink: "https://www.amazon.in/s?k=Nivea+Soft+Moisturizer"
            }
        ]
    },
    fungal: {
        title: "Fungal Infection Treatment Products",
        icon: "fa-shield-virus",
        products: [
            {
                name: "Ketomac Anti-Fungal Cream",
                reason: "Contains ketoconazole to effectively treat fungal skin infections and prevent recurrence",
                skinTypes: ["All Types", "Infected"],
                badge: "Medical Grade",
                buyLink: "https://www.amazon.in/s?k=Ketomac+Antifungal+Cream"
            },
            {
                name: "Sebamed Anti-Fungal Shampoo",
                reason: "pH 5.5 formula with piroctone olamine fights scalp fungal infections and dandruff",
                skinTypes: ["Scalp", "Sensitive"],
                badge: "Dermatologist Tested",
                buyLink: "https://www.amazon.in/s?k=Sebamed+Antifungal+Shampoo"
            },
            {
                name: "Tea Tree Oil Pure & Natural",
                reason: "Natural antifungal and antibacterial properties help treat various skin fungal infections",
                skinTypes: ["All Types"],
                badge: "100% Natural",
                buyLink: "https://www.amazon.in/s?k=Tea+Tree+Oil+Pure"
            },
            {
                name: "Canesten Antifungal Cream",
                reason: "Clotrimazole-based broad-spectrum antifungal treatment for various skin fungal conditions",
                skinTypes: ["All Types", "Infected"],
                badge: "Clinically Proven",
                buyLink: "https://www.amazon.in/s?k=Canesten+Antifungal+Cream"
            }
        ]
    },
    normal: {
        title: "Normal Skin Maintenance Products",
        icon: "fa-face-smile",
        products: [
            {
                name: "Cetaphil Gentle Skin Cleanser",
                reason: "Mild, soap-free formula that cleanses without disrupting skin's natural protective barrier",
                skinTypes: ["Normal", "Sensitive", "All Types"],
                badge: "Universal Favorite",
                buyLink: "https://www.amazon.in/s?k=Cetaphil+Gentle+Cleanser"
            },
            {
                name: "Olay Regenerist Micro-Sculpting Cream",
                reason: "Advanced anti-aging formula with amino-peptides maintains skin health and youthful appearance",
                skinTypes: ["Normal", "Mature", "All Types"],
                badge: "Anti-Aging",
                buyLink: "https://www.amazon.in/s?k=Olay+Regenerist+Cream"
            },
            {
                name: "La Roche-Posay Effaclar Duo+",
                reason: "Prevents blemishes, reduces marks, and maintains clear, healthy-looking skin",
                skinTypes: ["Normal", "Combination"],
                badge: "Prevents Blemishes",
                buyLink: "https://www.amazon.in/s?k=La+Roche+Posay+Effaclar"
            },
            {
                name: "Simple Kind to Skin Hydrating Light Moisturizer",
                reason: "No-nonsense moisturizer with pro-vitamin B5 that keeps normal skin balanced and healthy",
                skinTypes: ["Normal", "Sensitive"],
                badge: "No Harsh Chemicals",
                buyLink: "https://www.amazon.in/s?k=Simple+Hydrating+Moisturizer"
            }
        ]
    }
};

// ============================================================================
// 2. URL PARAMETER HANDLING
// ============================================================================
/**
 * Extracts URL parameters from the current page URL
 * @returns {Object} Object containing disease and confidence values
 */
function getURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        disease: urlParams.get('disease') || 'Normal',
        confidence: urlParams.get('confidence') || '0'
    };
}

// ============================================================================
// 3. SECTION KEY MAPPING
// ============================================================================
/**
 * Maps disease names to product database keys
 * @param {string} disease - Disease name from URL
 * @returns {string} Corresponding database key
 */
function getDiseaseKey(disease) {
    const diseaseMap = {
        'acne': 'acne',
        'oily skin': 'oily',
        'oily': 'oily',
        'dry skin': 'dry',
        'dry': 'dry',
        'fungal infection': 'fungal',
        'fungal': 'fungal',
        'normal': 'normal',
        'healthy': 'normal'
    };
    
    const normalizedDisease = disease.toLowerCase().trim();
    return diseaseMap[normalizedDisease] || 'normal';
}

// ============================================================================
// 4. PRODUCT CARD RENDERING
// ============================================================================
/**
 * Creates HTML for a single product card
 * @param {Object} product - Product data object
 * @returns {string} HTML string for product card
 */
function createProductCard(product) {
    const skinTypeTags = product.skinTypes.map(type => 
        `<span class="skin-tag">${type}</span>`
    ).join('');

    return `
        <div class="product-card">
            <div class="product-image">
                <i class="fas fa-pump-soap"></i>
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-content">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-reason">
                    <i class="fas fa-check-circle"></i>
                    <span>${product.reason}</span>
                </div>
                <div class="skin-type-tags">
                    ${skinTypeTags}
                </div>
                <button class="buy-button" onclick="buyProduct('${product.buyLink}')">
                    <i class="fas fa-shopping-cart"></i>
                    Buy Best Option
                </button>
            </div>
        </div>
    `;
}

// ============================================================================
// 5. SECTION RENDERING
// ============================================================================
/**
 * Creates HTML for a complete product section
 * @param {string} key - Section key (acne, oily, dry, etc.)
 * @param {Object} section - Section data from database
 * @param {boolean} isHighlighted - Whether this section should be highlighted
 * @returns {string} HTML string for product section
 */
function createProductSection(key, section, isHighlighted = false) {
    const productCards = section.products.map(product => 
        createProductCard(product)
    ).join('');

    return `
        <div class="product-section ${isHighlighted ? 'highlighted' : ''}" id="section-${key}">
            <div class="section-header">
                <div class="section-icon">
                    <i class="fas ${section.icon}"></i>
                </div>
                <h2>${section.title}</h2>
                <span class="recommended-badge">
                    <i class="fas fa-star"></i> Recommended for You
                </span>
            </div>
            <div class="product-grid">
                ${productCards}
            </div>
        </div>
    `;
}

// ============================================================================
// 6. MAIN RENDERING FUNCTION
// ============================================================================
/**
 * Renders all product sections with proper highlighting
 */
function renderProductSections() {
    const { disease, confidence } = getURLParameters();
    const detectedKey = getDiseaseKey(disease);
    
    // Update detection card
    document.getElementById('detectedCondition').textContent = disease;
    document.getElementById('confidenceScore').textContent = confidence;
    
    // Define section order (detected condition first, then others)
    const sectionOrder = ['acne', 'oily', 'dry', 'fungal', 'normal'];
    
    // Move detected section to the top
    const orderedSections = [
        detectedKey,
        ...sectionOrder.filter(key => key !== detectedKey)
    ];
    
    // Generate HTML for all sections
    let sectionsHTML = '';
    orderedSections.forEach(key => {
        if (productDatabase[key]) {
            const isHighlighted = (key === detectedKey);
            sectionsHTML += createProductSection(key, productDatabase[key], isHighlighted);
        }
    });
    
    // Insert into DOM
    document.getElementById('productSections').innerHTML = sectionsHTML;
    
    // Smooth scroll to highlighted section after a short delay
    setTimeout(() => {
        scrollToHighlightedSection(detectedKey);
    }, 300);
}

// ============================================================================
// 7. SMOOTH SCROLLING TO HIGHLIGHTED SECTION
// ============================================================================
/**
 * Smoothly scrolls to the highlighted product section
 * @param {string} sectionKey - Key of the section to scroll to
 */
function scrollToHighlightedSection(sectionKey) {
    const section = document.getElementById(`section-${sectionKey}`);
    if (section) {
        // Calculate offset to account for fixed header
        const offset = 100; // Pixels from top
        const sectionPosition = section.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
            top: sectionPosition,
            behavior: 'smooth'
        });
    }
}

// ============================================================================
// 8. BUY BUTTON HANDLER
// ============================================================================
/**
 * Handles buy button clicks - opens product link in new tab
 * @param {string} link - Product purchase URL
 */
function buyProduct(link) {
    // Open in new tab
    window.open(link, '_blank', 'noopener,noreferrer');
    
    // Optional: Track analytics or show confirmation
    console.log('Opening product link:', link);
    
    // You can add a subtle confirmation feedback here
    showBuyConfirmation();
}

// ============================================================================
// 9. VISUAL FEEDBACK FOR BUY ACTION
// ============================================================================
/**
 * Shows a brief confirmation when buy button is clicked
 */
function showBuyConfirmation() {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00d9ff, #00a8cc);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 8px 25px rgba(0, 217, 255, 0.4);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    notification.innerHTML = `
        <i class="fas fa-check-circle" style="margin-right: 8px;"></i>
        Opening product page...
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// ============================================================================
// 10. INITIALIZATION
// ============================================================================
/**
 * Initialize the page when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Product Recommendation Page Initialized');
    
    // Get URL parameters
    const params = getURLParameters();
    console.log('URL Parameters:', params);
    
    // Render all product sections
    renderProductSections();
    
    // Add smooth scroll behavior to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ============================================================================
// 11. ADDITIONAL HELPER FUNCTIONS
// ============================================================================

/**
 * Add CSS animations for notifications
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================================================
// END OF PRODUCT.JS
// ============================================================================