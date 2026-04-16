/**
 * StayNow Psychology UI Upgrade
 * Single-file installer — run from project root: node apply-upgrade.js
 */
"use strict";
var fs = require("fs");
var path = require("path");
var FILES = JSON.parse(require("fs").readFileSync(path.join(__dirname, "files.b64.json"), "utf8"));
var DEST = process.cwd();

console.log("\n  StayNow Psychology UI Upgrade\n");
console.log("Writing to: " + DEST + "\n");

var keys = Object.keys(FILES);
for (var i = 0; i < keys.length; i++) {
  var p = path.join(DEST, keys[i]);
  var d = path.dirname(p);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  var c = Buffer.from(FILES[keys[i]], "base64").toString("utf8");
  fs.writeFileSync(p, c, "utf8");
  console.log("  [OK] " + keys[i] + " (" + c.length + " bytes)");
}

console.log("\nDone! " + keys.length + " files written.\n");
console.log("Next steps:");
console.log("  1. npx prisma db seed");
console.log("  2. npm run dev");
console.log("  3. git add -A && git commit -m \"feat: psychology UI upgrade\" && git push\n");
