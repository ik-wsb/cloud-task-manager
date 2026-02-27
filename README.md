# Cloud Task Manager
Autor: Igor Kotlik, Nr albumu: 95581

Projekt natywnej aplikacji chmurowej realizowany w architekturze 3-warstwowej.

## Deklaracja Architektury (Mapowanie Azure)
Ten projekt został zaplanowany z myślą o usługach PaaS (Platform as a Service) w chmurze Microsoft Azure.

| Warstwa | Komponent Lokalny | Usługa Azure |
| :--- | :--- | :--- |
| **Presentation** | React 19 (Vite) | Azure Static Web Apps |
| **Application** | API (.NET 9) | Azure App Service |
| **Data** | SQL Server (Dev) | Azure SQL Database (Serverless) |

## Status Projektu i Dokumentacja
- [x] **Artefakt 1:** Zaplanowano strukturę folderów i diagram C4 (dostępny w `/docs`).
- [ ] **Artefakt 2:** Środowisko wielokontenerowe uruchomione lokalnie (Docker Compose).


