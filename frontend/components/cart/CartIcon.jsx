import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartIcon() {
  const { cart } = useCart();
  const router = useRouter();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button onClick={() => router.push("/carrito")} className="relative">
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-gray-700 hover:text-blue-600"
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="m1 1 4 4 1 10h13l1-7H8"></path>
      </svg>
      
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
          {count}
        </span>
      )}
    </button>
  );
}