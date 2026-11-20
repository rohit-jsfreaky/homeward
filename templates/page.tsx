/**
 * The updates page the poster's QR code opens: the pet, how to help, and every sighting so far, newest first.
 * The poster stays short; this page carries the news. One static HTML file: host it anywhere (GitHub Pages works).
 */
import { Button, Column, Heading, Image, Page, Row, Section, Table, TableCell, TableRow, Text, token } from "@hyper-elements/react";
import { lint } from "@hyper-elements/lint";
import { template } from "@hyper-elements/react/template";
import { FONT_URLS, PAPER, accent, approachLine, dayMonth, example, fields, headline, safetyLine, themeFor, when, type Pet } from "./_shared/pet";

export default template({
  id: "homeward.Page",
  version: "1.0.0",
  label: "Lost pet updates page",
  guidance: "Add every sighting to updates in pet.json, with its date, and render again.",
  root: "Page",
  fields,
  rules: { plugins: { lint: lint() }, require: { lint: ["link-text", "lang", "contrast"] }, links: { schemes: ["tel", "mailto"] } },
  example,
  render(v) {
    const p = v as unknown as Pet;
    const found = p.status === "found";
    const tel = `tel:${p.phone.replace(/[^+0-9]/g, "")}`;
    const updates = [...p.updates].sort((a, b) => b.date.localeCompare(a.date));

    const facts = (
      <Table style={{ cellPadding: [10, 0], rowBorder: { width: 1, style: "solid", color: token("colors.border") } }}>
        {[
          ["Looks like", p.description],
          ["Marks", p.markings],
          ["Last seen", `${p.lastSeenArea}, ${p.town}`],
          ["When", when(p)],
          ["Reward", found ? undefined : p.reward],
        ]
          .filter(([, value]) => value)
          .map(([name, value]) => (
            <TableRow key={name}>
              <TableCell style={{ width: 120, color: token("colors.muted"), fontSize: 14, verticalAlign: "top" }}>{name}</TableCell>
              <TableCell style={{ fontWeight: 800, verticalAlign: "top" }}>{value}</TableCell>
            </TableRow>
          ))}
      </Table>
    );

    return (
      <Page
        theme={themeFor(p)}
        lang={p.locale}
        width={1040}
        fonts={FONT_URLS}
        title={found ? `${p.name} is home` : `${headline(p)}: ${p.name}, ${p.town}`}
        description={found ? `${p.name} is home safe.` : `${p.name}, last seen near ${p.lastSeenArea}, ${p.town}. Call or text ${p.phone}.`}
        style={{ gap: 0 }}
      >
        <Section style={{ backgroundColor: accent(p), padding: [22, 24] }}>
          <Row style={{ alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <Text style={{ fontFamily: token("fonts.heading"), fontSize: 40, lineHeight: 1.1, color: PAPER, letterSpacing: 1, mobile: { fontSize: 30 } }}>
              {found ? "HOME SAFE" : headline(p)}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: 800, color: PAPER, letterSpacing: 1.5, textTransform: "uppercase", textAlign: "right" }}>{p.town}</Text>
          </Row>
        </Section>

        <Section style={{ backgroundColor: token("colors.paper"), padding: [40, 24], mobile: { padding: [24, 16] } }}>
          <Row style={{ gap: 40, alignItems: "start" }}>
            <Column style={{ width: 520 }}>
              <Image field="photo" src={v.photo} alt={`${p.name}, the ${p.kind}`} style={{ width: 520 }} />
            </Column>
            <Column style={{ gap: 20 }}>
              <Heading level={1} field="name">
                {found ? `${p.name} is home. Thank you.` : `Have you seen ${p.name}?`}
              </Heading>
              {found ? (
                <Text>
                  {p.foundNote ?? `${p.name} was found${p.foundDate ? ` on ${dayMonth(p.foundDate, p.locale)}` : ""}, safe. You can stop looking.`}
                </Text>
              ) : (
                <>
                  {facts}
                  <Text style={{ fontWeight: 600, color: token("colors.primary") }}>{approachLine(p)}</Text>
                  <Button href={tel}>Call or text {p.phone}</Button>
                </>
              )}
            </Column>
          </Row>
        </Section>

        {updates.length ? (
          <Section style={{ padding: [40, 24], gap: 20, mobile: { padding: [24, 16] } }}>
            <Heading level={2}>{found ? "How we found " + p.name : "Sightings and updates"}</Heading>
            <Column style={{ gap: 0 }}>
              {updates.map((u, i) => (
                <Row key={i} style={{ gap: 24, padding: [14, 0], border: { top: { width: 1, style: "solid", color: token("colors.border") } } }}>
                  <Column style={{ width: 150 }}>
                    <Text style={{ fontWeight: 800 }}>{dayMonth(u.date, p.locale)}</Text>
                  </Column>
                  <Column>
                    <Text>{u.note}</Text>
                  </Column>
                </Row>
              ))}
            </Column>
          </Section>
        ) : null}

        <Section style={{ padding: [28, 24], mobile: { padding: [20, 16] } }}>
          <Text style={{ fontSize: 14, color: token("colors.muted") }}>{safetyLine(p)}</Text>
        </Section>
      </Page>
    );
  },
});
