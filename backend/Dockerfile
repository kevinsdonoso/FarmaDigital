# Base de ejecución (runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Etapa de compilación
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# 👇 Ruta corregida al .csproj
COPY FarmaDigitalBackend/FarmaDigitalBackend.csproj ./FarmaDigitalBackend/
WORKDIR /src/FarmaDigitalBackend
RUN dotnet restore

# 👇 Copia todo el proyecto
COPY FarmaDigitalBackend/ ./

RUN dotnet build "FarmaDigitalBackend.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Etapa de publicación
FROM build AS publish
RUN dotnet publish "FarmaDigitalBackend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Imagen final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "FarmaDigitalBackend.dll"]