export const Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: "",
          email: "",
          full_name: "",
          phone: null,
          account_type: "retail",
          wholesale_approved: false,
          company_name: null,
          business_registration: null,
          created_at: "",
          updated_at: ""
        },
        Insert: {},
        Update: {}
      },

      addresses: {
        Row: {
          id: "",
          user_id: "",
          address_type: "shipping",
          full_name: "",
          phone: "",
          street_address: "",
          city: "",
          state: "",
          postal_code: null,
          country: "",
          is_default: false,
          created_at: ""
        },
        Insert: {},
        Update: {}
      },

      products: {
        Row: {
          id: "",
          name: "",
          slug: "",
          description: "",
          grade: "",
          weight_per_uni: 0,
          retail_price: 0,
          images: [],        // <-- FIXED (no longer null)
          stock_quantity: 0,
          min_wholesale_quantity: 0,
          featured: false,
          active: false,
          created_at: "",
          updated_at: "",
          cut_type: "",        // 'STRIPS', 'CUBES', 'WHOLE', 'SHREDDED'
          texture: "",         // 'BUBBLY', 'SMOOTH', 'CRINKLED', 'MIXED'
          drying_method: "",   // 'SUN-DRIED', 'SMOKED', 'OVEN-DRIED'
          prep_time: "",       // 'READY IN 15MIN', 'SOAK OVERNIGHT', etc.
          cleanliness: "",     // 'HAIRLESS', 'WELL-TRIMMED', 'PROPERLY CLEANED'
          rating: 0,           // 0-5 scale
          review_count: 0,    // integer count
          best_for: "",        // 'Perfect for soups & stews'
          packaging: "",       // 'VACUUM SEALED', 'HYGIENIC PACK'
          certification: "",   // 'NAFDAC APPROVED', 'FDA CERTIFIED'
          seller_trust: "",    // 'TRUSTED SELLER', 'LOCAL FARMER'
          is_fresh: true,       // true/false
          featured_badge: "",  // 'Chef''s Choice', 'Customer Favorite'
        },
        Insert: {},
        Update: {}
      },

      wholesale_pricing: {
        Row: {
          id: "",
          product_id: "",
          min_quantity: 0,
          max_quantity: null,
          price_per_unit: 0,
          created_at: ""
        },
        Insert: {},
        Update: {}
      },

      orders: {
        Row: {
          id: "",
          order_number: "",
          user_id: "",
          order_type: "retail",
          status: "pending",
          subtotal: 0,
          shipping_cost: 0,
          total: 0,
          shipping_address: null,
          billing_address: null,
          payment_method: null,
          payment_status: "pending",
          notes: null,
          created_at: "",
          updated_at: ""
        },
        Insert: {},
        Update: {}
      },

      order_items: {
        Row: {
          id: "",
          order_id: "",
          product_id: "",
          product_name: "",
          quantity: 0,
          unit_price: 0,
          total_price: 0,
          created_at: ""
        },
        Insert: {},
        Update: {}
      },

      cart_items: {
        Row: {
          id: "",
          user_id: "",
          product_id: "",
          quantity: 0,
          created_at: "",
          updated_at: ""
        },
        Insert: {},
        Update: {}
      },

      wishlist: {
        Row: {
          id: "",
          user_id: "",
          product_id: "",
          created_at: ""
        },
        Insert: {},
        Update: {}
      },

      wholesale_quotes: {
        Row: {
          id: "",
          user_id: null,
          company_name: "",
          email: "",
          phone: "",
          product_details: null,
          estimated_quantity: 0,
          message: null,
          status: "pending",
          admin_notes: null,
          created_at: ""
        },
        Insert: {},
        Update: {}
      }
    }
  }
};
