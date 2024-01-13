# NEHM STACK

Basic app using Node, Express, Htmx and Mongodb. Super simple

## Setup

1. Have Nodejs installed and a Mongodb server running
2. Cope .env.example to .env and fill the required values(secret for jwt tokens and mongodb uri)
3. `npm i`

## To run

### Nix/Nixos

(It will automatically watch changes in files and update both tailwind ouput and restart server)

```bash
nix develop
run # zellij users can try zrun which runs it in floating window
```

### others

```bash
npx tailwindcss -i input.css -o public/output.css
npm run dev
```
