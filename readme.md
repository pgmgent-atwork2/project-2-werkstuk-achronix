# Ping Pong Tool

Een webapplicatie voor het beheren van ping pong wedstrijden, teams, gebruikers en bestellingen.

## Ontwikkelaars

Dit project is ontwikkeld door:
- **Pieter**
- **Daan** 
- **Quinten**

## Gebruikte Technologieën

### Backend
- **Node.js** - Server-side runtime
- **Express.js** - Web framework
- **Objection.js** - ORM voor database operations
- **Knex.js** - SQL query builder
- **SQLite** - Database
- **bcrypt** - Password hashing
- **JWT** - Authentication tokens

### Frontend
- **EJS/CSS/JavaScript** - Client-side development
- **Handlebars** - Templating engine
- **Vanilla JavaScript** - DOM manipulation en API calls

### Development Tools
- **ESLint** - Code linting
- **Docker** - Containerization (docker-compose.yml)

## Project Structuur

```
├── src/
│   ├── app.js             # Main application file
│   ├── controllers/       # Route handlers
│   ├── models/            # Database models
│   ├── middleware/        # Custom middleware
│   ├── routes/            # API routes
│   └── views/             # Handlebars templates
├── public/
│   ├── scripts/           # Client-side JavaScript
│   ├── styles/            # CSS files
│   └── assets/            # Images en andere static files
└── migrations/            # Database migrations
```

## Installatie en Setup

### Vereisten
- Node.js 
- npm
- Docker 

### Stappen

1. **Clone de repository**
   ```bash
   git clone https://github.com/pgmgent-atwork2/project-2-werkstuk-achronix.git
   cd project-2-achronix
   ```

2. **Installeer dependencies**
   ```bash
   npm install
   ```

3. **Environment variabelen**
   - Maak een `.env` bestand aan in de root directory of copy paste de .env-defaults van uit ons project. 
   - Voeg de volgende configuratie toe:
   ```env
   DATABASE_NAME="pingpong_tool.sqlite3"
   SMTP_HOST=localhost
   SMTP_PORT=1025
   SMTP_USER=
   SMTP_PASS=
   TOKEN_SALT=Toodooloo
   MOLLIE_API_KEY=test_9ar9UTkQ7Ukmr28mqD4mnGrRq6Mh9H
   APP_URL=http://localhost:3000
   ```
   
4. **Database setup**
   ```bash
   # Run migrations
   npm run migrate:latest
   
   # Run seeds (optioneel)
   npm run seed:run
   ```

5. **Start de applicatie**
   ```bash
   - Development mode
   npm run dev
   ```

## Docker

Docker moet worden gestart zodat de mailing functies werken ( Mailhog)

```bash
docker compose up
```

## Functionaliteiten

- **Gebruikersbeheer**: Beheer van gebruikers, rollen en authenticatie
- **Wedstrijdenbeheer**: Aanmaken, bewerken en verwijderen van ping pong wedstrijden
- **Teambeheer**: Organisatie van teams en spelers
- **Bestellingensysteem**: Beheer van consumables en bestellingen
- **Notificatiesysteem**: Push notificaties naar gebruikers
- **Data Export**: Exporteren van wedstrijddata
- **Responsive Design**: Werkt op desktop en mobiele apparaten
- **En nog veel meer!**

## Scripts

```bash
npm run dev             # Start development server
npx knex migrate:latest # Run database migrations
npx knex seed:run       # Run database seeds
```

## Database

Het project gebruikt SQLite als database (pingpong_tool.sqlite3) met Knex.js voor migrations en Objection.js als ORM.