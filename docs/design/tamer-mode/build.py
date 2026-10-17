import base64, io, json, os, re, sys
from collections import Counter
from PIL import Image

here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from kits import KITS, TIERS, TIER_STEP, SPELLS

game = "D:/Lloegrys-Idle/"
monsters = json.load(open(os.path.join(here, "monsters.json"), encoding="utf8"))
by_name = {m["name"]: m for m in monsters}
kit_names = [k[0] for k in KITS]

missing = [m["name"] for m in monsters if m["name"] not in kit_names]
unknown = [n for n in kit_names if n not in by_name]
dupes = [n for n, c in Counter(kit_names).items() if c > 1]
assert not missing and not unknown and not dupes, (missing, unknown, dupes)
assert len(KITS) == 72, len(KITS)

# What keeps pets from feeling the same, and keeps magic about spells
kit = {k[0]: k for k in KITS}
problems = []
for key, count in Counter(k[8] for k in KITS).items():
    if count > 2:
        problems.append("passive %s used %d times" % (key, count))
for pair, count in Counter((k[5], k[8]) for k in KITS).items():
    if count > 1:
        problems.append("skill and passive %s used together %d times" % (pair, count))
for tower_name in TIERS:
    here_kits = [kit[m["name"]] for m in monsters if m["tower"] == tower_name]
    for index, what in ((5, "skill"), (8, "passive")):
        for key, count in Counter(k[index] for k in here_kits).items():
            if count > 1:
                problems.append("%s: two pets share the %s %s" % (tower_name, what, key))
    paths_here = set(k[1] for k in here_kits)
    if paths_here != {"P", "M", "R"}:
        problems.append("%s has no pet of path %s" % (tower_name, {"P", "M", "R"} - paths_here))
spell_passives = {"summonCdr", "regenCdr"}
for k in KITS:
    if k[1] == "M" and "spell" not in k[8].lower() and k[8] not in spell_passives:
        problems.append("magic pet %s has a passive that is not about spells (%s)" % (k[0], k[8]))
for k in KITS:
    if k[1] == "M" and k[0] not in SPELLS:
        problems.append("magic pet %s has no spell worth written down" % k[0])
for name, (cooldown, worth, how) in SPELLS.items():
    if kit[name][1] != "M":
        problems.append("%s has a spell worth but is not magic" % name)
    if worth < cooldown:
        problems.append("%s's spell is worth %s turns but takes %s to come back" % (name, worth, cooldown))
print("\n".join(problems) or "no two pets play the same; every magic passive is about spells; every spell is worth its wait; every tower has all three paths")

PATHS = {"P": ("Physical", "phys"), "M": ("Magic", "mag"), "R": ("Primal", "prim")}
ROLES = {"clear": "Room clearer", "boss": "Boss killer", "deep": "Deep floors", "farm": "Farmer",
         "burst": "Burst", "sustain": "Sustain", "armor": "Armor breaker"}


def thumb(path, size=64):
    image = Image.open(game + path).convert("RGBA")
    image.thumbnail((size, size), Image.LANCZOS)
    out = io.BytesIO()
    image.save(out, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(out.getvalue()).decode()


def esc(text):
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


rows = []
tower = None
for m in monsters:
    if m["tower"] != tower:
        tower = m["tower"]
        tier_number = TIERS.index(tower) + 1
        rows.append('<tr class="sep" data-tower="%s"><td colspan="5">Tier %d · %s · badge %s</td></tr>' % (esc(tower), tier_number, esc(tower), ["I","II","III","IV","V","VI","VII","VIII"][tier_number - 1]))
    k = next(k for k in KITS if k[0] == m["name"])
    name, path, dtype, skill, skill_text, skill_key, passive, passive_text, passive_key, pick, role = k
    tier = TIERS.index(tower) + 1
    power = TIER_STEP ** (tier - 1) * (TIER_STEP ** 0.5 if m["boss"] else 1)
    label, cls = PATHS[path]
    spell_note = ""
    if name in SPELLS:
        cooldown, worth, how = SPELLS[name]
        spell_note = '<span class="worth">every %d turns · worth %s turns (%s)</span>' % (cooldown, ("%.1f" % worth).rstrip("0").rstrip("."), esc(how))
    boss = '<span class="bossmark">Boss tame</span>' if m["boss"] else ""
    rows.append(
        '<tr data-tower="%s" data-path="%s" data-boss="%s" data-role="%s">'
        '<td><div class="pet"><img src="%s" alt="" loading="lazy"><div><b>%s</b><i>"%s"</i>%s</div></div></td>'
        '<td><span class="tag %s">%s</span><span class="dtype">%s</span><span class="power">power x%s</span></td>'
        '<td><em>%s.</em> %s%s</td><td><em>%s.</em> %s</td>'
        '<td class="niche"><span class="role">%s</span>%s</td></tr>'
        % (esc(tower), cls, "yes" if m["boss"] else "no", role, thumb(m["art"]), esc(name), esc(m["text"]), boss,
           cls, label, esc(dtype), ("%.1f" % power).rstrip("0").rstrip("."), esc(skill), esc(skill_text), spell_note, esc(passive), esc(passive_text), ROLES[role], esc(pick)))

paths = Counter(PATHS[k[1]][0] for k in KITS)
roles = Counter(ROLES[k[10]] for k in KITS)
bosses = sum(1 for m in monsters if m["boss"])
summary = "%d pets: %d Physical, %d Magic, %d Primal. %d are boss tames. Jobs: %s." % (
    len(KITS), paths["Physical"], paths["Magic"], paths["Primal"], bosses,
    ", ".join("%s %d" % (r, c) for r, c in roles.most_common()))
print(summary)

src = open(os.path.join(here, "tamer-mode.src.html"), encoding="utf8").read()
start = src.index("<!--KITS-->")
end = src.index("<!--/KITS-->") + len("<!--/KITS-->")
src_out = src[:start] + "<!--KITS-->" + "\n".join(rows) + "<!--/KITS-->" + src[end:]
src_out = src_out.replace("{{SUMMARY}}", esc(summary))

big = {"drake": "venom-drake", "warg": "warg", "bear": "dire-bear"}
for key, file in big.items():
    data = base64.b64encode(open(game + "art/monsters/%s.png" % file, "rb").read()).decode()
    src_out = src_out.replace("{{%s}}" % key, "data:image/png;base64," + data)
assert "{{" not in src_out
open(os.path.join(here, "tamer-mode.html"), "w", encoding="utf8").write(src_out)
print(len(src_out) // 1024, "KB")
