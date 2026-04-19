// src/hooks/useToast.js
export function useToast() {
  const showToast = ({ type, message }) => {
    console.log(`[Toast ${type}]: ${message}`);
  };
  return { showToast };
}
