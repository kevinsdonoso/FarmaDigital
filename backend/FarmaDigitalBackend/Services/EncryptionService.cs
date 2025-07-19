using System.Security.Cryptography;
using System.Text;

namespace FarmaDigitalBackend.Services
{
    public static class EncryptionService
    {
        private static readonly string EncryptionKey = "FarmaDigital2024SuperSecretKey!!"; // 32 caracteres; // 32 caracteres exactos

        public static string Encrypt(string plainText)
        {
            try
            {
                using var aes = Aes.Create();
                aes.Key = Encoding.UTF8.GetBytes(EncryptionKey);
                aes.GenerateIV();

                using var encryptor = aes.CreateEncryptor();
                using var ms = new MemoryStream();
                using var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write);
                using var writer = new StreamWriter(cs);

                writer.Write(plainText);
                writer.Close();

                var encryptedBytes = ms.ToArray();
                var result = new byte[aes.IV.Length + encryptedBytes.Length];
                Buffer.BlockCopy(aes.IV, 0, result, 0, aes.IV.Length);
                Buffer.BlockCopy(encryptedBytes, 0, result, aes.IV.Length, encryptedBytes.Length);

                return Convert.ToBase64String(result);
            }
            catch
            {
                throw new Exception("Error al encriptar los datos");
            }
        }

        public static string Decrypt(string cipherText)
        {
            try
            {
                var fullCipher = Convert.FromBase64String(cipherText);

                using var aes = Aes.Create();
                aes.Key = Encoding.UTF8.GetBytes(EncryptionKey);

                var iv = new byte[aes.IV.Length];
                var cipher = new byte[fullCipher.Length - iv.Length];

                Buffer.BlockCopy(fullCipher, 0, iv, 0, iv.Length);
                Buffer.BlockCopy(fullCipher, iv.Length, cipher, 0, cipher.Length);

                aes.IV = iv;

                using var decryptor = aes.CreateDecryptor();
                using var ms = new MemoryStream(cipher);
                using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
                using var reader = new StreamReader(cs);

                return reader.ReadToEnd();
            }
            catch
            {
                throw new Exception("Error al desencriptar los datos");
            }
        }
    }
}