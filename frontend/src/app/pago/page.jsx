'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createFactura } from '@/lib/api';

export default function PagoPage() {
  const router = useRouter();
  const [factura, setFactura] = useState(null);

  const [numero, setNumero] = useState('');
  const [expiracion, setExpiracion] = useState('');
  const [cvv, setCvv] = useState('');
  const [guardarTarjeta, setGuardarTarjeta] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const temp = localStorage.getItem('facturaTemp');
    if (temp) {
      setFactura(JSON.parse(temp));
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  const sanitize = (text) =>
    String(text)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[<>"'`|\\{}]/g, '')
      .trim()
      .slice(0, 100);

  const handleEnviarFactura = async () => {
    setError('');

    const regexExp = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const numeroSan = numero.replace(/\D/g, '');
    const cvvSan = cvv.replace(/\D/g, '');

    if (numeroSan.length !== 16) {
      setError('El número de tarjeta debe tener 16 dígitos.');
      return;
    }
    if (!regexExp.test(expiracion)) {
      setError('La fecha de expiración debe estar en formato MM/YY.');
      return;
    }
    if (cvvSan.length < 3 || cvvSan.length > 4) {
      setError('El CVV debe tener entre 3 y 4 dígitos.');
      return;
    }

    const facturaData = {
      ...factura,
      metodoPago: sanitize('tarjeta_credito'),
      referenciaPago: sanitize('ref-mock-123'),
      ultimos4Tarjeta: sanitize(numeroSan.slice(-4)),
      numeroTarjeta: sanitize(numeroSan),
      fechaExpiracion: sanitize(expiracion),
      cvv: sanitize(cvvSan),
      guardarTarjeta: guardarTarjeta
    };

    console.log('📦 Enviando factura completa:', facturaData);

    setLoading(true);
    try {
      await createFactura(facturaData);
      localStorage.removeItem('facturaTemp');
      router.push('/historialCompras');
    } catch (err) {
      console.error('❌ Error al crear factura:', err);
      setError('No se pudo generar la factura');
    } finally {
      setLoading(false);
    }
  };

  if (!factura) return null;

  return (
    <main className="max-w-md mx-auto p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Pago de: {factura.nombreProducto}</h1>
      <p className="text-sm text-gray-600 mb-2">Total a pagar: ${factura.total.toFixed(2)}</p>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Número de tarjeta"
          value={numero}
          onChange={(e) =>
            setNumero(e.target.value.replace(/\D/g, '').slice(0, 16))
          }
          className="border rounded w-full px-3 py-2"
          maxLength={16}
        />
        <input
          type="text"
          placeholder="MM/YY"
          value={expiracion}
          onChange={(e) =>
            setExpiracion(
              e.target.value.replace(/[^\d/]/g, '').slice(0, 5)
            )
          }
          className="border rounded w-full px-3 py-2"
        />
        <input
          type="text"
          placeholder="CVV"
          value={cvv}
          onChange={(e) =>
            setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
          }
          className="border rounded w-full px-3 py-2"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={guardarTarjeta}
            onChange={(e) => setGuardarTarjeta(e.target.checked)}
          />
          <span className="text-sm">Guardar tarjeta para compras futuras</span>
        </label>
      </div>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <button
        onClick={handleEnviarFactura}
        disabled={loading}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Enviando factura...' : 'Confirmar y pagar'}
      </button>
    </main>
  );
}