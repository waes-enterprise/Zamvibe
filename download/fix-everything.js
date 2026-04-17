/**
 * STAYNOW COMPLETE FIX - v3
 * ==========================
 * Fixes EVERYTHING:
 *   - Adds Lodge + Reservation models to schema.prisma
 *   - Seeds 10 Zambian lodges
 *   - Upgrades all UI pages (hero, cards, detail, reservation)
 *   - Adds psychology-driven design (urgency, trust, animations)
 *
 * PREREQUISITE: fix-data.json MUST be in the same folder as this script
 *
 * RUN FROM YOUR STAYNOW PROJECT ROOT:
 *   node fix-everything.js
 *
 * THEN RUN:
 *   npx prisma db push
 *   npx prisma db seed
 *   git add -A && git commit -m "feat: complete upgrade" && git push
 */

"use strict";
var fs = require("fs");
var path = require("path");

var DEST = process.cwd();
var dataFile = path.join(__dirname, "fix-data.json");

if (!fs.existsSync(dataFile)) {
  console.log("");
  console.log("ERROR: fix-data.json not found!");
  console.log("Make sure fix-data.json is in the SAME folder as fix-everything.js");
  console.log("Then run: node fix-everything.js");
  console.log("");
  process.exit(1);
}

var FILES = JSON.parse(fs.readFileSync(dataFile, "utf8"));
var keys = Object.keys(FILES);

console.log("");
console.log("========================================");
console.log("  STAYNOW COMPLETE FIX - v3");
console.log("========================================");
console.log("");
console.log("Target: " + DEST);
console.log("");

var written = 0;

for (var i = 0; i < keys.length; i++) {
  var rel = keys[i];
  var dest = path.join(DEST, rel);
  var dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  var content = Buffer.from(FILES[rel], "base64").toString("utf8");
  fs.writeFileSync(dest, content, "utf8");
  console.log("  [OK] " + rel + " (" + content.length + " bytes)");
  written++;
}

console.log("");
console.log("--- " + written + "/" + keys.length + " files written ---");
console.log("");
console.log("NEXT - run these 3 commands in order:");
console.log("");
console.log("  1. npx prisma db push");
console.log("");
console.log("  2. npx prisma db seed");
console.log("");
console.log("  3. git add -A && git commit -m feat && git push");
console.log("");
