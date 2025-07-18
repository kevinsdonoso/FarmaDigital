export function LoginForm({ formData, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="text"
        name="username"
        placeholder="DNI o usuario"
        value={formData.username}
        onChange={onChange}
        className="border p-2 w-full"
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={onChange}
        className="border p-2 w-full"
      />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? 'Cargando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
