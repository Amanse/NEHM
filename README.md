# NEHS STACK

Basic app using Node, Express, Htmx and sqlite. Super simple

## To run

### Setup sqlite

```bash
sqlite3 database.db < migrations/*init*
```

### Nix/Nixos

```bash
nix develop
run
```

### others

```bash
npx tailwindcss -i input.css -o public/output.css
npm run dev
```
