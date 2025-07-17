# See https://aka.ms/customizecontainer to learn how to customize your debug container

# Base de ejecución (runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Etapa de compilación
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY FarmaDigitalBackend.csproj ./
RUN dotnet restore "./FarmaDigitalBackend.csproj"
COPY . ./
RUN dotnet build "FarmaDigitalBackend.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Etapa de publicación
FROM build AS publish
RUN dotnet publish "FarmaDigitalBackend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Imagen final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FarmaDigitalBackend.dll"]
