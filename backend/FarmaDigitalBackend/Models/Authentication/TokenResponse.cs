using Newtonsoft.Json;

namespace FarmaDigitalBackend.Models.Authentication
{
    public class TokenResponse
    {
        [JsonProperty("access_token")]
        public string AccessToken { get; set; }
        
        [JsonProperty("expires_in")]
        public DateTime ExpiresIn { get; set; }
        
        [JsonProperty("token_type")]
        public string TokenType { get; set; }
        
        [JsonProperty("user_info")]
        public UserInfo UserInfo { get; set; }
        
        public TokenResponse(string token, DateTime expires, string tokenType, UserInfo userInfo)
        {
            AccessToken = token;
            ExpiresIn = expires;
            TokenType = tokenType;
            UserInfo = userInfo;
        }
    }
    
    public class UserInfo
    {
        public int UserId { get; set; }
        public string Nombre { get; set; }
        public string Correo { get; set; }
        public string Rol { get; set; }
        public List<string> Permissions { get; set; }
    }
}