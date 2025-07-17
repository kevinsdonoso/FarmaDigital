import React from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const TwoFactorForm = ({
  qrCode,
  twoFactorCode,
  onChange,
  onSubmit,
  loading,
  error,
}) => (
  <div>
    <div className="text-center mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Paso 1: Escanea el código QR
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Usa Google Authenticator, Authy, o cualquier app de autenticación
      </p>
      {qrCode && (
        <div className="flex justify-center">
          <img
            src={qrCode}
            alt="Código QR para 2FA"
            className="border-2 border-primary rounded-lg"
            style={{ maxWidth: '200px', maxHeight: '200px' }}
          />
        </div>
      )}
    </div>
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Código de 6 dígitos"
        name="twoFactorCode"
        type="text"
        value={twoFactorCode}
        onChange={onChange}
        maxLength={6}
        placeholder="000000"
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button
        type="submit"
        loading={loading}
        disabled={loading || twoFactorCode.length !== 6}
        className="w-full"
      >
        Verificar y Continuar
      </Button>
    </form>
  </div>
);