// pet.json + a photo -> the whole appeal, with the Hyper Elements CLI:
//   1. `design new` turns pet.json into one values file per template (appeal/*.values.json), checked by the template.
//   2. `render` draws each one: posters as PDF (3 paper sizes), the card as PNG, the email and the page as HTML.
// Usage: npm run appeal            (reads ./pet.json)
//        npm run appeal -- other.json
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { sniffImage } from "@hyper-elements/react/template";

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const petFile = resolve(process.argv[2] ?? join(root, "pet.json"));
const { photo, photoUrl, ...values } = JSON.parse(readFileSync(petFile, "utf8"));
if (!photo) throw new Error(`${petFile}: give "photo", the path to your pet's photo (JPEG or PNG)`);

const photoPath = resolve(dirname(petFile), photo);
const size = sniffImage(readFileSync(photoPath));
if (!size) throw new Error(`${photo}: not a JPEG or PNG`);

const cli = join(root, "node_modules", ".bin", "hyper-elements");
const run = (...args) => {
  try {
    execFileSync(cli, args, { cwd: root, stdio: "inherit" });
  } catch {
    console.error(`\nNothing new was written. Fix what's listed above in ${relative(process.cwd(), petFile)}, then run again.`);
    process.exit(1);
  }
};

const appeal = join(root, "appeal");
const out = join(root, "out", "appeal");
rmSync(appeal, { recursive: true, force: true });

const tmp = mkdtempSync(join(tmpdir(), "homeward-"));
const valuesFile = join(tmp, "values.json");
writeFileSync(valuesFile, JSON.stringify(values));

// Print and image read the file itself. Email and web need a URL: photoUrl if given, else a copy beside the HTML.
const local = `@${relative(root, photoPath)}`;
const webPhoto = photoUrl ?? `photo${extname(photoPath)}`;
const web = JSON.stringify({ src: webPhoto, width: size.width, height: size.height });

for (const [name, photoValue] of [["poster", local], ["card", local], ["email", web], ["page", web]]) {
  run("design", "new", `templates/${name}.tsx`, "-o", `appeal/${name}.values.json`, "--values", valuesFile, "--set", `photo=${photoValue}`);
}
rmSync(tmp, { recursive: true, force: true });

// Every values file passed its template's checks: only now replace the last appeal.
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
if (!photoUrl) copyFileSync(photoPath, join(out, basename(webPhoto)));
run("render", "appeal/");
console.log(`\n${values.status === "found" ? "FOUND notice" : "Appeal"} for ${values.name} is in out/appeal/`);
