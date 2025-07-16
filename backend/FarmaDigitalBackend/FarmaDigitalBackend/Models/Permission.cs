using System.Text.Json.Serialization;

namespace FarmaDigitalBackend.Models
{
    public class Permission
    {
        [JsonPropertyName("module")]
        public string Module { get; set; }
        
        [JsonPropertyName("action")]
        public string Action { get; set; }
        
        [JsonPropertyName("resource")]
        public string Resource { get; set; }
        
        public Permission(string module, string action, string resource = "all")
        {
            Module = module;
            Action = action;
            Resource = resource;
        }
        
        public Permission() { }
    }
}