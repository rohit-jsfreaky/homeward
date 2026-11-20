/**
 * The email to local shelters, vet practices, rescues and neighbours: shelters don't always have time to list every
 * stray they take in, so you send them the pet. When the pet is home, the same file writes the "you can stop looking".
 */
import { Button, Column, Email, Heading, Image, Link, Section, Table, TableCell, TableRow, Text, token } from "@hyper-elements/react";
import { lint } from "@hyper-elements/lint";
import { template } from "@hyper-elements/react/template";
import { FONT_URLS, PAPER, accent, approachLine, dayMonth, example, fields, headline, href, safetyLine, themeFor, when, type Pet } from "./_shared/pet";

const row = (name: string, value: string | undefined) =>
  value ? (
    <TableRow key={name}>
      <TableCell style={{ width: 140, color: token("colors.muted"), fontSize: 14, verticalAlign: "top" }}>{name}</TableCell>
      <TableCell style={{ fontWeight: 800, verticalAlign: "top" }}>{value}</TableCell>
    </TableRow>
  ) : null;

export default template({
  id: "homeward.Email",
  version: "1.0.0",
  label: "Lost pet email",
  guidance: "Send it to every shelter, vet and rescue within a few miles, and to neighbours. The photo must be a public https URL (photoUrl in pet.json) for email apps to show it.",
  root: "Email",
  fields,
  rules: { plugins: { lint: lint() }, require: { lint: ["link-text", "lang", "contrast"] }, links: { schemes: ["tel", "mailto"] }, root: { previewText: true } },
  example,
  render(v) {
    const p = v as unknown as Pet;
    const found = p.status === "found";
    const url = href(p.updatesUrl);
    const tel = `tel:${p.phone.replace(/[^+0-9]/g, "")}`;
    const kind = p.kind;

    return (
      <Email
        theme={themeFor(p)}
        lang={p.locale}
        width={600}
        fonts={FONT_URLS}
        title={found ? `${p.name} is home` : `${headline(p)}: ${p.name}`}
        previewText={
          found
            ? `${p.name} is home safe. Thank you for looking. You can stop now.`
            : `${p.name}, a ${kind}, last seen near ${p.lastSeenArea}, ${p.town}, ${when(p)}.`
        }
        style={{ gap: 0 }}
      >
        <Section style={{ backgroundColor: accent(p), padding: [18, 32] }}>
          <Text style={{ fontFamily: token("fonts.heading"), fontSize: 30, lineHeight: 1.2, color: PAPER, letterSpacing: 1 }}>
            {found ? "FOUND" : headline(p)} · {p.town.toUpperCase()}
          </Text>
        </Section>

        <Column style={{ apply: ["card"], padding: 0, gap: 0 }}>
          <Image field="photo" src={v.photo} alt={`${p.name}, the ${kind}`} style={{ width: 600 }} />
          <Column style={{ padding: 32, gap: 18 }}>
            {found ? (
              <>
                <Heading level={1}>{p.name} is home.</Heading>
                <Text>
                  {p.foundNote ??
                    `${p.name} was found${p.foundDate ? ` on ${dayMonth(p.foundDate, p.locale)}` : ""}, safe and well.`}
                </Text>
                <Text>
                  Thank you for looking out for {p.name}. You can take {p.name} off your lost list and stop looking. If you put up one of our posters,
                  we'd be grateful if you took it down.
                </Text>
              </>
            ) : (
              <>
                <Heading level={1}>Have you seen {p.name}?</Heading>
                <Text>
                  {p.name} went missing near {p.lastSeenArea}, {p.town}, {when(p)}. If you run a shelter, vet practice or rescue nearby, please check
                  for a {kind} like this one. If you live nearby, please check sheds, garages and under cars.
                </Text>
                <Table style={{ cellPadding: [10, 0], rowBorder: { width: 1, style: "solid", color: token("colors.border") } }}>
                  {row("Looks like", p.description)}
                  {row("Marks", p.markings)}
                  {row("Last seen", `${p.lastSeenArea}, ${p.town}`)}
                  {row("When", when(p))}
                  {row("Reward", p.reward)}
                </Table>
                <Text style={{ fontWeight: 600, color: token("colors.primary") }}>{approachLine(p)}</Text>
                <Button href={tel}>Call or text {p.phone}</Button>
                {url ? (
                  <Text>
                    Sightings and news: <Link href={url}>{p.name}'s updates page</Link>
                  </Text>
                ) : null}
              </>
            )}
          </Column>
        </Column>

        <Column style={{ padding: [20, 32], gap: 8 }}>
          <Text style={{ fontSize: 14, lineHeight: 1.5, color: token("colors.muted") }}>{safetyLine(p)}</Text>
        </Column>
      </Email>
    );
  },
});
