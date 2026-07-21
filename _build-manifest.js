#!/usr/bin/env node
// Genera manifest.json escaneando prototypes/.
// Ejecutar tras añadir/cambiar un prototipo: node _build-manifest.js
// El buscador del root (index.html) lee manifest.json — no lo edites a mano,
// salvo el campo "archived" que este script preserva entre ejecuciones.

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = __dirname;
const PROTO_DIR = path.join(ROOT, "prototypes");
const OUT = path.join(ROOT, "manifest.json");

// Preservar flags "archived" del manifest anterior
let previous = {};
try {
  for (const e of JSON.parse(fs.readFileSync(OUT, "utf8")).prototypes) {
    previous[e.slug] = e;
  }
} catch {
  /* primer build */
}

function gitDate(dir) {
  try {
    return execSync(`git log -1 --format=%cs -- "${dir}"`, {
      cwd: ROOT,
      encoding: "utf8",
    }).trim() || null;
  } catch {
    return null;
  }
}

function titleCase(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const entries = [];
for (const slug of fs.readdirSync(PROTO_DIR).sort()) {
  const dir = path.join(PROTO_DIR, slug);
  if (!fs.statSync(dir).isDirectory()) continue;

  const hasIndex = fs.existsSync(path.join(dir, "index.html"));
  if (!hasIndex) {
    console.warn(`AVISO: ${slug} no tiene index.html — excluido del manifest`);
    continue;
  }

  const ownMenu = path.join(dir, "menu.json");
  const hasOwnData = fs.existsSync(ownMenu);

  // Nombre: <title> del index.html (fuente fiable); menu.json de respaldo.
  // Tagline/location solo con datos propios — el menu.json compartido
  // describe un restaurante ficticio y etiquetaría mal la tarjeta.
  let title = "";
  const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
  const m = html.match(/<title>([^<]*)<\/title>/i);
  if (m) title = m[1].split(" - ")[0].trim();

  let restaurant = {};
  if (hasOwnData) {
    try {
      restaurant = JSON.parse(fs.readFileSync(ownMenu, "utf8")).restaurant || {};
    } catch {
      /* menu.json ilegible — se usan valores derivados del slug/título */
    }
  }

  entries.push({
    slug,
    name: title || restaurant.name || titleCase(slug),
    tagline: hasOwnData ? restaurant.tagline || "" : "",
    location: hasOwnData ? restaurant.location || "" : "",
    ownData: hasOwnData,
    updated: gitDate(`prototypes/${slug}`),
    archived: previous[slug]?.archived || false,
  });
}

fs.writeFileSync(
  OUT,
  JSON.stringify({ generated: true, prototypes: entries }, null, 2) + "\n",
  "utf8"
);
console.log(`manifest.json: ${entries.length} prototipos`);
