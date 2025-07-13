import { useContext } from 'react';
import { CartContext } from '@/context/CartProvider';
export default function useCart() {
  return useContext(CartContext);
}