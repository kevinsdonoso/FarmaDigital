'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function TwoFactorSetupPage() {
  const [code, setCode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const usernameParam = searchParams.get('username');
    const passwordParam = searchParams.get('password');
    const qrParam = searchParams.get('qr');
    
    if (!usernameParam || !passwordParam || !qrParam) {
      router.push('/login');
      return;
    }
    
    setUsername(usernameParam);
    setPassword(passwordParam);
    setQrCode(qrParam);
  }, [searchParams, router]);

  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      const requestData = {
        username,
        password,
        twoFactorCode: code,
      };
      
      console.log('Enviando datos para verificación 2FA:', requestData);
      
      const res = await loginUser(requestData);
      
      console.log('Respuesta del servidor después de 2FA:', res);
      
      if (res.access_token) {
        console.log('✅ Login exitoso con 2FA - Token recibido');
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user_info));
        router.push('/dashboard');
      } else if (res.requires2FA) {
        console.log('❌ Código 2FA incorrecto o inválido');
        setError('Código 2FA inválido. Verifica que el código sea correcto y que tu aplicación esté sincronizada.');
      } else if (res.success) {
        console.log('✅ Login exitoso con 2FA - Success flag');
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user_info));
        router.push('/dashboard');
      } else {
        console.log('❌ Error en respuesta:', res);
        setError(res.message || 'Error en la verificación 2FA');
      }
    } catch (err) {
      console.error('Error en verificación 2FA:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        
        {/* Botón volver arriba a la izquierda */}
        <div className="">
          <Button 
            variant="outline"
            onClick={() => router.push('/login')} 
            className="text-sm px-4 py-2 text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            ← Volver al login
          </Button>
        </div>

        {/* Título centrado */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configura tu 2FA</h1>
          <p className="text-gray-600">Autenticación de dos factores para mayor seguridad</p>
        </div>

        {/* Instrucciones en caja azul */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-center mb-4">
              <h3 className="font-bold text-blue-900">🔐 Instrucciones</h3>
            </div>
            <ol className="text-blue-800 space-x-2 list-decimal list-inside text-sm">
              <li>👩‍💻Descarga <strong>Authenticator</strong> o usa tu aplicación de autenticación favorita</li>
              <li>📸 Escanea el código QR con la aplicación</li>
              <li>🔢Ingresa el código de 6 dígitos que aparece</li>
            </ol>
          </div>

        {/* Layout de dos columnas */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          
          {/* Columna izquierda - Instrucciones y QR */}
          <div className="space-y-6">
            
            
            {/* QR Code */}
            {qrCode && (
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-300 shadow-sm">
                  <img 
                    src={qrCode} 
                    alt="QR 2FA" 
                    className="w-48 h-48" 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha - Formulario */}
          <div className="space-y-6">
            
            {/* Título del formulario */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Código de Verificación</h2>
            </div>

            {/* Input del código */}
            <div className="text-center">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl tracking-[0.5rem] h-16 text-gray-900"
                style={{ letterSpacing: '0.5rem' }}
              />
              
              {/* Ojo para mostrar/ocultar */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            {/* Error */}
            {error && (
              <Alert type="error" className="text-sm">
                {error}
              </Alert>
            )}

            {/* Botón Confirmar */}
            <Button 
              onClick={handleConfirm} 
              disabled={loading || code.length !== 6} 
              className={`w-full h-14 text-lg font-semibold rounded-lg transition-all duration-200 ${
                code.length === 6 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Verificando...' : 'Confirmar Código'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}