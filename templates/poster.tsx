/**
 * The poster for lamp posts and noticeboards: one page, readable from across the road, with tear-off phone tabs.
 * Tabloid (11 × 17 in) by default, because a Letter sheet on a pole can't be read from a car; Letter and A4 for
 * shop windows and home printers. When the pet is home, the same file prints the FOUND notice to tape over it.
 */
import { Column, Document, Heading, Image, Layer, LineBreak, Row, Text } from "@hyper-elements/react";
import { template } from "@hyper-elements/react/template";
import { BODY, DISPLAY, FONT_FILES, INK, MIST, MUTED, PAPER, Qr, RULE, accent, approachLine, dayMonth, example, fields, headline, href, when, type Pet } from "./_shared/pet";

/** Each paper's content box (96 px to the inch, less the margin) and the sizes that fill it. */
const PAPERS = {
  tabloid: { size: "Tabloid", margin: 40, width: 976, photo: 660, found: 690, s: 1.3, tabs: 7 },
  letter: { size: "Letter", margin: 30, width: 756, photo: 290, found: 360, s: 1, tabs: 6 },
  a4: { size: "A4", margin: 30, width: 734, photo: 330, found: 410, s: 1, tabs: 6 },
} as const;

const label = (s: number) => ({ fontFamily: BODY, fontSize: 13 * s, fontWeight: 800, letterSpacing: 1.6, textTransform: "uppercase", color: MUTED }) as const;

export default template({
  id: "homeward.Poster",
  version: "1.0.0",
  label: "Lost pet poster",
  guidance: "One photo, big words, a phone number people can read from across the road. Nothing private: no home address, no microchip number.",
  root: "Document",
  formats: {
    tabloid: { size: "Tabloid", orientation: "portrait" },
    letter: { size: "Letter", orientation: "portrait" },
    a4: { size: "A4", orientation: "portrait" },
  },
  fields,
  rules: { require: { core: ["document/overflow"] } },
  example,
  render(v, { format }) {
    const p = v as unknown as Pet;
    const f = PAPERS[format];
    const s = f.s;
    const color = accent(p);
    const found = p.status === "found";
    const url = href(p.updatesUrl);
    const tabWidth = f.width / f.tabs;

    const photo = (
      <Layer style={{ width: f.width, height: found ? f.found : f.photo }}>
        <Image field="photo" src={v.photo} alt={`${p.name}, the ${p.kind}`} />
      </Layer>
    );

    const banner = (
      <Column style={{ backgroundColor: color, padding: [6 * s, 0, 10 * s] }}>
        <Heading level={1} style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 124 * s, lineHeight: 1.2, letterSpacing: 2, color: PAPER, textAlign: "center" }}>
          {headline(p)}
        </Heading>
      </Column>
    );

    if (found) {
      return (
        <Document size={f.size} margin={f.margin} title={`${p.name} is home`} fonts={FONT_FILES} style={{ fontFamily: BODY, color: INK, gap: 22 * s }}>
          {banner}
          {photo}
          <Column style={{ gap: 18 * s }}>
            <Heading level={2} style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 80 * s, lineHeight: 1.2, textAlign: "center" }}>
              {p.name} is home.
              <LineBreak />
              Thank you.
            </Heading>
            <Text style={{ fontSize: 24 * s, lineHeight: 1.45, textAlign: "center", color: MUTED }}>
              {p.foundNote ?? `${p.name} was found${p.foundDate ? ` on ${dayMonth(p.foundDate, p.locale)}` : ""}, safe. To everyone who looked, called and shared: thank you.`}
            </Text>
          </Column>
          <Column style={{ backgroundColor: MIST, padding: [16 * s, 24 * s] }}>
            <Text style={{ fontSize: 19 * s, lineHeight: 1.45, fontWeight: 600, textAlign: "center" }}>
              You can stop looking. If you see one of our LOST posters around {p.town}, please take it down, or tape this over it.
            </Text>
          </Column>
        </Document>
      );
    }

    return (
      <Document size={f.size} margin={f.margin} title={`${headline(p)}: ${p.name}`} fonts={FONT_FILES} style={{ fontFamily: BODY, color: INK, gap: 14 * s }}>
        {banner}
        {photo}

        <Column style={{ gap: 4 * s }}>
          <Text field="name" style={{ fontFamily: DISPLAY, fontSize: 72 * s, lineHeight: 1.15 }}>
            {p.name.toUpperCase()}
          </Text>
          <Text field="description" style={{ fontSize: 21 * s, fontWeight: 600, lineHeight: 1.3 }}>
            {p.description}
          </Text>
          {p.markings ? (
            <Text field="markings" style={{ fontSize: 17 * s, lineHeight: 1.35, color: MUTED }}>
              {p.markings}
            </Text>
          ) : null}
        </Column>

        <Row style={{ gap: 0, border: { top: `3px solid ${INK}`, bottom: `1px solid ${RULE}` } }}>
          <Column style={{ padding: [10 * s, 16 * s, 10 * s, 0], gap: 2 }}>
            <Text style={label(s)}>Last seen</Text>
            <Text style={{ fontSize: 21 * s, fontWeight: 800, lineHeight: 1.2 }}>{p.lastSeenArea}</Text>
            <Text style={{ fontSize: 16 * s, lineHeight: 1.3 }}>{p.town}</Text>
          </Column>
          <Column style={{ padding: [10 * s, 0, 10 * s, 16 * s], gap: 2, border: { left: `1px solid ${RULE}` } }}>
            <Text style={label(s)}>On</Text>
            <Text style={{ fontSize: 21 * s, fontWeight: 800, lineHeight: 1.2 }}>{when(p)}</Text>
          </Column>
        </Row>

        <Text style={{ fontSize: 17 * s, lineHeight: 1.35, fontWeight: 600, color }}>{approachLine(p)}</Text>

        <Row style={{ gap: 20 * s, alignItems: "center" }}>
          <Column style={{ gap: 0 }}>
            <Text style={label(s)}>Call or text, any time</Text>
            <Text field="phone" style={{ fontFamily: DISPLAY, fontSize: 70 * s, lineHeight: 1.05, letterSpacing: 1 }}>
              {p.phone}
            </Text>
          </Column>
          {p.reward ? (
            <Column style={{ width: 200 * s, flex: "none", backgroundColor: INK, padding: [12 * s, 8 * s] }}>
              <Text style={{ fontFamily: DISPLAY, fontSize: 26 * s, lineHeight: 1.1, color: PAPER, textAlign: "center" }}>{p.reward.toUpperCase()}</Text>
            </Column>
          ) : null}
          {url ? (
            <Column style={{ width: 90 * s, flex: "none", gap: 2, alignItems: "center" }}>
              <Qr url={url} size={86 * s} />
              <Text style={{ ...label(s), fontSize: 10 * s, letterSpacing: 1 }}>Updates</Text>
            </Column>
          ) : null}
        </Row>

        {/* Tear-off tabs: the number goes home in a pocket. */}
        <Row style={{ gap: 0, border: { top: `1.5px dashed ${INK}` } }}>
          {Array.from({ length: f.tabs }, (_, i) => (
            <Column
              key={i}
              style={{ width: tabWidth, padding: [12 * s, 4, 10 * s], gap: 3, alignItems: "center", border: i ? { left: `1.5px dashed ${INK}` } : undefined }}
            >
              <Text style={{ fontSize: 11 * s, fontWeight: 800, letterSpacing: 1, lineHeight: 1.3, color, textAlign: "center" }}>
                {headline(p)}
                <LineBreak />
                {p.name.toUpperCase()}
              </Text>
              <Text style={{ fontSize: Math.min(14 * s, tabWidth / 9), fontWeight: 800, textAlign: "center" }}>{p.phone}</Text>
            </Column>
          ))}
        </Row>
      </Document>
    );
  },
});

export { PAPERS };
