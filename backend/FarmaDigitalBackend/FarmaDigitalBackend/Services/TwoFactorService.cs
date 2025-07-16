using FarmaDigitalBackend.Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace FarmaDigitalBackend.Services
{
    public class TwoFactorService : ITwoFactorService
    {
        private readonly string _issuer = "FarmaDigital";

        public async Task<string> GenerateSecretKey()
        {
            var key = new byte[20];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(key);
            }
            var base32String = ToBase32String(key);
            return await Task.FromResult(base32String);
        }

        public async Task<string> GenerateQrCode(string userEmail, string secretKey)
        {
            var otpUri = $"otpauth://totp/{Uri.EscapeDataString(_issuer)}:{Uri.EscapeDataString(userEmail)}?secret={secretKey}&issuer={Uri.EscapeDataString(_issuer)}";
            var qrUrl = $"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={Uri.EscapeDataString(otpUri)}";

            return await Task.FromResult(qrUrl);
        }

        public async Task<bool> ValidateCode(string secretKey, string code)
        {
            try
            {
                var keyBytes = FromBase32String(secretKey);
                var unixTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                var timeStep = unixTime / 30;

                for (int i = -1; i <= 1; i++)
                {
                    var testCode = GenerateTotp(keyBytes, timeStep + i);

                    if (testCode == code)
                        return await Task.FromResult(true);
                }

                return await Task.FromResult(false);
            }
            catch
            {
                return await Task.FromResult(false);
            }
        }

        private string GenerateTotp(byte[] key, long timeStep)
        {
            var timeBytes = BitConverter.GetBytes(timeStep);
            if (BitConverter.IsLittleEndian)
                Array.Reverse(timeBytes);

            using var hmac = new HMACSHA1(key);
            var hash = hmac.ComputeHash(timeBytes);

            var offset = hash[hash.Length - 1] & 0xf;
            var binary = ((hash[offset] & 0x7f) << 24) |
                        ((hash[offset + 1] & 0xff) << 16) |
                        ((hash[offset + 2] & 0xff) << 8) |
                        (hash[offset + 3] & 0xff);

            var otp = binary % 1000000;
            return otp.ToString("D6");
        }
        private string ToBase32String(byte[] bytes)
        {
            const string alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
            var result = new StringBuilder();
            int bits = 0;
            int value = 0;

            foreach (byte b in bytes)
            {
                value = (value << 8) | b;
                bits += 8;

                while (bits >= 5)
                {
                    result.Append(alphabet[(value >> (bits - 5)) & 31]);
                    bits -= 5;
                }
            }

            if (bits > 0)
            {
                result.Append(alphabet[(value << (5 - bits)) & 31]);
            }

            return result.ToString();
        }

        private byte[] FromBase32String(string base32)
        {
            const string alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
            var result = new List<byte>();
            int bits = 0;
            int value = 0;

            foreach (char c in base32.ToUpper())
            {
                if (alphabet.Contains(c))
                {
                    value = (value << 5) | alphabet.IndexOf(c);
                    bits += 5;

                    if (bits >= 8)
                    {
                        result.Add((byte)((value >> (bits - 8)) & 255));
                        bits -= 8;
                    }
                }
            }

            return result.ToArray();
        }
    }
}