var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.FarmaDigitalBackend>("farmadigitalbackend");

builder.Build().Run();
