/**
 * What every Homeward template shares: the pet's fields (one pet.json fills all four), the look, and small helpers.
 *
 * The fields carry the advice from real lost-pet guides as rules, so a poster can't be printed wrong:
 * the last-seen place can't start with a house number (never put your home address on a public notice),
 * the date is a real date (written with the month spelled out), the phone is a phone number.
 */
import qrcode from "qrcode-generator";
import { Path, Svg, defineTheme, prop } from "@hyper-elements/react";
import { field, formatDate } from "@hyper-elements/react/template";

export const fields = {
  status: prop.choice(["lost", "found"], {
    label: "Status",
    default: "lost",
    guidance: "Switch to found when your pet is home: every poster, card, email and page turns into a thank-you.",
  }),
  kind: prop.choice(["dog", "cat", "rabbit", "bird", "tortoise", "pet"], { label: "Animal", required: true }),
  name: prop.text({ label: "Pet's name", required: true, maxLength: 16 }),
  description: prop.text({
    label: "Short description",
    required: true,
    maxLength: 70,
    guidance: "Breed or type, colour, size, age, collar. What a stranger can see from across the road.",
  }),
  markings: prop.text({ label: "Distinctive marks", maxLength: 70, guidance: "One thing that tells your pet apart: a white tail tip, a limp, a torn ear." }),
  approach: prop.choice(["shy", "friendly"], {
    label: "If someone sees them",
    default: "shy",
    guidance: "Most lost pets run from strangers, even friendly ones. Shy asks people not to chase.",
  }),
  lastSeenArea: prop.text({
    label: "Last seen near",
    required: true,
    maxLength: 48,
    pattern: "^[^0-9]",
    guidance: "A street corner or landmark, not your house number: posters are public.",
  }),
  town: prop.text({ label: "Town or neighbourhood", required: true, maxLength: 28 }),
  lastSeenDate: prop.date({ label: "Last seen on", required: true }),
  lastSeenTime: prop.text({ label: "Time (roughly)", maxLength: 16, guidance: "\"about 7 pm\", or leave it out if you don't know." }),
  phone: prop.text({
    label: "Call or text",
    required: true,
    maxLength: 20,
    pattern: "^\\+?[0-9][0-9 ().-]{6,18}$",
    guidance: "A number you can answer all day. A second number (Google Voice, a spare SIM) keeps your own off the street.",
  }),
  reward: prop.text({ label: "Reward", maxLength: 24 }),
  updatesUrl: prop.link({ label: "Updates page", guidance: "Where you post sightings and news. Printed as a QR code." }),
  locale: prop.choice(["en-GB", "en-US", "en-AU", "en-CA", "en-IE", "en-NZ"], { label: "Date style", default: "en-GB" }),
  photo: field.image({
    label: "Photo",
    required: true,
    fit: "cover",
    maxCrop: 0.55,
    minWidth: 900,
    accepts: ["jpeg", "png"],
    guidance: "A recent photo of the whole animal, its markings visible. No filters, no stickers.",
  }),
  foundDate: prop.date({ label: "Home on" }),
  foundNote: prop.text({ label: "Thank-you note", maxLength: 170 }),
  updates: prop.list(
    prop.object({ date: prop.date({ label: "Date", required: true }), note: prop.text({ label: "Update", required: true, maxLength: 160 }) }, { label: "Update" }),
    { label: "Sightings and updates", max: 8 },
  ),
};

/** The sample pet, also each template's `example`. A real dog photo, free to use (see README); the number is an Ofcom drama number. */
export const example = {
  status: "lost",
  kind: "dog",
  name: "Biscuit",
  description: "Beagle, black, tan and white, small, patterned harness",
  markings: "White tip on her tail, black saddle across her back",
  approach: "shy",
  lastSeenArea: "Corner of Elm Road and Station Lane",
  town: "Ashby Park",
  lastSeenDate: "2026-11-15",
  lastSeenTime: "about 7 pm",
  phone: "07700 900461",
  reward: "£200 reward",
  updatesUrl: "https://example.org/biscuit",
  locale: "en-GB",
  photo: { src: "../sample/photo.jpg", width: 1800, height: 1200 },
  updates: [
    { date: "2026-11-16", note: "Seen by the allotments behind Station Lane, early morning. Heading towards the railway path." },
    { date: "2026-11-15", note: "Slipped her collar during the evening walk near the Elm Road playground." },
  ],
} as const;

export type Pet = {
  status: "lost" | "found";
  kind: string;
  name: string;
  description: string;
  markings?: string;
  approach: "shy" | "friendly";
  lastSeenArea: string;
  town: string;
  lastSeenDate: string;
  lastSeenTime?: string;
  phone: string;
  reward?: string;
  updatesUrl?: string | { href: string };
  locale: string;
  foundDate?: string;
  foundNote?: string;
  updates: Array<{ date: string; note: string }>;
};

/** The look: a public notice. White paper, black ink, one signal orange for lost, one green for home. */
export const INK = "#14161A";
export const MUTED = "#5A6070";
export const RULE = "#D6D9DE";
export const PAPER = "#FFFFFF";
export const MIST = "#F2F3F5";
export const LOST = "#CF3E15";
export const FOUND = "#0F7A50";
export const accent = (p: Pet) => (p.status === "found" ? FOUND : LOST);

export const DISPLAY = "Anton, Impact, 'Arial Narrow', sans-serif";
export const BODY = "Archivo, 'Helvetica Neue', Arial, sans-serif";

/** Font files for the PDF and the image (relative to a template in templates/). */
export const FONT_FILES = [
  { family: "Anton", src: "../fonts/Anton-400.woff", weight: 400 },
  { family: "Archivo", src: "../fonts/Archivo-400.woff", weight: 400 },
  { family: "Archivo", src: "../fonts/Archivo-600.woff", weight: 600 },
  { family: "Archivo", src: "../fonts/Archivo-800.woff", weight: 800 },
];
/** The same fonts from a CDN, for the email and the web page. */
const CDN = "https://cdn.jsdelivr.net/npm/@fontsource";
export const FONT_URLS = [
  { family: "Anton", src: `${CDN}/anton@5.3.0/files/anton-latin-400-normal.woff2`, weight: 400 },
  { family: "Archivo", src: `${CDN}/archivo@5.3.0/files/archivo-latin-400-normal.woff2`, weight: 400 },
  { family: "Archivo", src: `${CDN}/archivo@5.3.0/files/archivo-latin-600-normal.woff2`, weight: 600 },
  { family: "Archivo", src: `${CDN}/archivo@5.3.0/files/archivo-latin-800-normal.woff2`, weight: 800 },
];

export const headline = (p: Pet) => (p.status === "found" ? "FOUND" : `LOST ${p.kind.toUpperCase()}`);

/** "Sunday 15 November, about 7 pm": the month spelled out, so no reader mixes up 11/15 and 15/11. */
export const when = (p: Pet) =>
  formatDate(p.lastSeenDate, p.locale, { weekday: "long", day: "numeric", month: "long" }) + (p.lastSeenTime ? `, ${p.lastSeenTime}` : "");

export const dayMonth = (date: string, locale: string) => formatDate(date, locale, { day: "numeric", month: "long" });

export const approachLine = (p: Pet) =>
  p.approach === "shy"
    ? `${p.name} is scared of strangers. Please don't chase or call out. Note where and when, and call us.`
    : `${p.name} is friendly and may come to you. If you can, keep ${p.name} safe and call us.`;

export const href = (link: Pet["updatesUrl"]) => (typeof link === "string" ? link : link?.href);

/** The updates link as a QR code: one vector Path, so it prints sharp at any size. */
export const Qr = ({ url, size, color = INK }: { url: string; size: number; color?: string }) => {
  const qr = qrcode(0, "M");
  qr.addData(url);
  qr.make();
  const n = qr.getModuleCount();
  let d = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
  return (
    <Svg width={size} height={size} viewBox={`-2 -2 ${n + 4} ${n + 4}`} title="QR code: the updates page">
      <Path d={d} style={{ fill: color }} />
    </Svg>
  );
};

/** The brand once, for the email and the page: body text, links and buttons take the status's colour. */
export const themeFor = (p: Pet) =>
  defineTheme({
    colors: { background: MIST, foreground: INK, primary: accent(p), primaryForeground: PAPER, muted: MUTED, border: RULE, paper: PAPER },
    fonts: { body: BODY, heading: DISPLAY },
    fontSizes: { body: 16 },
    lineHeights: { body: 1.55 },
    elements: {
      Heading: { fontWeight: 400, lineHeight: 1.1, by: { level: { 1: { fontSize: 44, mobile: { fontSize: 34 } }, 2: { fontSize: 28 } } } },
      Button: { fontWeight: 800, fontSize: 18, padding: [16, 28], borderRadius: 4, hover: { backgroundColor: INK } },
    },
    styles: {
      label: { fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: MUTED },
      card: { backgroundColor: PAPER, padding: 32, gap: 18 },
    },
  });

/** Never share a code: the scam the FTC warns lost-pet posters about. */
export const safetyLine = (p: Pet) =>
  `We will only ever ask where and when you saw ${p.name}. We will never ask you for a code, a payment or a deposit, and nobody should ask you for one in our name.`;
