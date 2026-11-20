/**
 * The card for the neighbourhood's Facebook group, Nextdoor and WhatsApp: a 4:5 image (1080 × 1350), the shape a
 * feed shows at full height. The phone number is in the picture, because a shared image travels without its caption.
 */
import { Canvas, Column, Heading, Image, Layer, Row, Text } from "@hyper-elements/react";
import { template } from "@hyper-elements/react/template";
import { BODY, DISPLAY, FONT_FILES, INK, MUTED, PAPER, accent, dayMonth, example, fields, headline, when, type Pet } from "./_shared/pet";

const W = 1080;
const PAD = 56;

export default template({
  id: "homeward.Card",
  version: "1.0.0",
  label: "Lost pet social card",
  guidance: "For local groups. The number is in the image so it survives being shared without its caption.",
  root: "Canvas",
  formats: { post: { width: 1080, height: 1350, scale: 1 } },
  fields,
  rules: { require: { core: ["image/overflow", "image/glyph", "image/fit"] } },
  example,
  render(v) {
    const p = v as unknown as Pet;
    const color = accent(p);
    const found = p.status === "found";
    const inner = W - PAD * 2;

    return (
      <Canvas width={1080} height={1350} fonts={FONT_FILES} style={{ backgroundColor: PAPER, fontFamily: BODY, color: INK, gap: 0 }}>
        <Row style={{ backgroundColor: color, padding: [18, PAD], alignItems: "center", justifyContent: "space-between" }}>
          <Heading level={1} style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 96, lineHeight: 1.15, color: PAPER }}>
            {found ? "HOME SAFE" : headline(p)}
          </Heading>
          <Text style={{ fontSize: 30, fontWeight: 800, color: PAPER, textAlign: "right", letterSpacing: 1, textTransform: "uppercase" }}>{p.town}</Text>
        </Row>

        <Layer style={{ width: W, height: found ? 760 : 680 }}>
          <Image field="photo" src={v.photo} alt={`${p.name}, the ${p.kind}`} />
        </Layer>

        {found ? (
          <Column style={{ padding: [40, PAD], gap: 18 }}>
            <Text field="name" fit={{ sizes: [104, 92, 80, 68], maxLines: 1 }} style={{ fontFamily: DISPLAY, lineHeight: 1.1 }}>
              {p.name} is home.
            </Text>
            <Text style={{ fontSize: 32, lineHeight: 1.4, color: MUTED }}>
              {p.foundNote ?? `Found${p.foundDate ? ` on ${dayMonth(p.foundDate, p.locale)}` : ""}, safe. Thank you to everyone who looked, called and shared.`}
            </Text>
          </Column>
        ) : (
          <Column style={{ padding: [28, PAD, 0], gap: 14, width: W }}>
            <Row style={{ gap: 24, alignItems: "end" }}>
              <Text field="name" fit={{ sizes: [110, 96, 84, 72], maxLines: 1 }} style={{ fontFamily: DISPLAY, lineHeight: 1.05, width: p.reward ? inner - 300 : inner }}>
                {p.name.toUpperCase()}
              </Text>
              {p.reward ? (
                <Column style={{ width: 276, flex: "none", backgroundColor: INK, padding: [10, 12] }}>
                  <Text fit={{ sizes: [36, 32, 28], maxLines: 1 }} style={{ fontFamily: DISPLAY, color: PAPER, textAlign: "center" }}>{p.reward.toUpperCase()}</Text>
                </Column>
              ) : null}
            </Row>
            <Text field="description" style={{ fontSize: 31, fontWeight: 600, lineHeight: 1.3, width: inner }}>
              {p.description}
            </Text>
            <Column style={{ gap: 2, width: inner }}>
              <Text style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: MUTED, textTransform: "uppercase" }}>Last seen</Text>
              <Text style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.3 }}>{p.lastSeenArea}</Text>
              <Text style={{ fontSize: 29, lineHeight: 1.3 }}>{when(p)}</Text>
            </Column>
          </Column>
        )}

        {found ? null : (
          <Row style={{ padding: [24, PAD], gap: 24, alignItems: "center", justifyContent: "space-between" }}>
            <Column style={{ gap: 0 }}>
              <Text style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: MUTED, textTransform: "uppercase" }}>
                {p.approach === "shy" ? "Don't chase · call or text" : "Call or text"}
              </Text>
              <Text field="phone" fit={{ sizes: [96, 88, 80, 72, 64], maxLines: 1 }} style={{ fontFamily: DISPLAY, lineHeight: 1.1, color, width: inner - 250 }}>
                {p.phone}
              </Text>
            </Column>
            <Text style={{ width: 220, fontSize: 24, fontWeight: 800, color: MUTED, textAlign: "right", letterSpacing: 1.5, textTransform: "uppercase" }}>Please share</Text>
          </Row>
        )}
      </Canvas>
    );
  },
});
