export const loadRazorpayScript = (src: string) => {
  return new Promise((resolve, reject) => {
    // Check if the script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      console.log("Razorpay SDK already loaded.");
      // resolve with a number
      resolve(1);
      return;
    }

    // Create a script element
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      console.log("Razorpay SDK loaded.");
      // resolve with a number
      resolve(1);
    };
    script.onerror = () => {
      reject(new Error(`Failed to load script ${src}`));
    };

    // Append the script to the document's head
    document.head.appendChild(script);
  });
};
