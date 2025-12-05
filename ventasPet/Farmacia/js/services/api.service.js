export const farmaciaService = {
    getAllRecipes: async () => {
      const response = await fetch("https://dev.monaros.co/medical/recipes");
      return await response.json();
    },
  
    searchProducts: async (name, concentration) => {
      const response = await fetch(
        `https://dev.monaros.co/api/v1/admin/products/searchProduct?name=${encodeURIComponent(name)}&concentration=${encodeURIComponent(concentration)}`
      );
      return await response.json();
    },
  
    getPaymentMethods: async () => {
      const response = await fetch("https://dev.monaros.co/api/v1/admin/payment-methods");
      return await response.json();
    },
  
    completeDelivery: async (products) => {
      const response = await fetch("https://dev.monaros.co/api/v1/admin/pharmacy/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products })
      });
      return await response.json();
    }
  };