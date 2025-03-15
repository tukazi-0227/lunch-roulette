export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig().public;
    const apiKey = config.GOOGLE_MAPS_API_KEY; 
  
    if (!apiKey) {
      console.error("Google Maps API key not found in runtimeConfig");
      return;
    }
  
    if (document.getElementById("google-maps-script")) {
      return;
    }
  
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
  
    document.head.appendChild(script);
  });
  