"use client";
import { useCart } from "@/components/cart/CartContext";
import { useRouter } from "next/navigation";

export default function CarritoPage() {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Carrito de compras</h1>
      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">Tu carrito está vacío.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Ver productos
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{item.nombre}</h3>
                      <p className="text-gray-600">${item.precio.toFixed(2)} c/u</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Cantidad:</label>
                        <input
                          type="number"
                          value={item.cantidad}
                          min={1}
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                          className="border rounded-md px-2 py-1 w-20 text-center"
                        />
                      </div>
                      <div className="text-right min-w-[100px]">
                        <div className="font-medium">${(item.precio * item.cantidad).toFixed(2)}</div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-2xl font-bold">${total.toFixed(2)}</span>
            </div>
            
            <div className="flex gap-4 justify-end">
              <button
                onClick={clearCart}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                Vaciar carrito
              </button>
              <button
                onClick={() => router.push("/pago")}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Proceder al pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}