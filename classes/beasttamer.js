// =====================================================================
//  The Beast Tamer - a staff, and an animal that does the fighting
// =====================================================================
// The eighth class. It is opened with legend marks (see legendUnlocks in data.js and
// "unlock" below), so a player meets it late.
//
// The Beast Tamer's "weapon" is its COMPANION, picked at the blacksmith like any other
// class's weapon. The tamer only taps the enemy with a staff; the animal does the rest.
//   Wolf Pack - MANY SMALL BITES. Three wolves bite every turn, and each bite in a turn
//               lands harder than the one before it.
//   Bear      - ONE HEAVY BLOW, AND A GUARD. A maul that can stun, and the bear stands
//               in front of you: you take less damage.
//   Hawk      - A STORM SPELL. Weak dives, and every few turns Storm Dive, a lightning
//               spell that can strike critically, after which the enemy's next attack misses.
// The Beast Tamer is a game of its own: "ownPath" below, and "The Beast Tamer's own
// path" in data.js.
//
// Bonus words only the Beast Tamer uses:
//   bond         extra companion damage for every 10% of your
//                health that is missing                        (0.05 means +5%)
//   packSize     wolf pack: more wolves                        (1 means +1 wolf)
//   bitePower    wolf pack: extra damage of every bite         (0.03 means +3% of attack)
//   packTactics  wolf pack: how much harder each bite in a
//                turn lands than the one before                (0.1 means +10%)
//   maulPower    bear: extra damage of the maul                (0.05 means +5% of attack)
//   stunChance   bear: chance the maul stuns                   (0.1 means +10%)
//   guard        bear: share of every hit the bear takes       (0.05 means +5%)
//   skillHaste   physical pet: its skill comes back faster     (0.03 means 3% faster)
//   care         extra pet damage while it has more than half
//                its health (Bond's other side)                 (0.05 means +5%)
//   critChance   hawk: chance of a critical dive               (0.1 means +10%)
//   critPower    hawk: extra damage of a critical dive         (0.1 means +10%)
// and the words of its keystones (floor 51; see "Keystones" in data.js):
//   alpha        wolf pack: 1 = one great wolf with the whole pack's bite in one
//   bodyguard    bear: extra share of every hit the bear takes
//   blindingDive hawk: chance a critical dive makes the enemy miss its next turn
//
// Words a perk can MULTIPLY (see "multiply" in data.js):
//   wolf      every wolf bite
//   bear      every maul
//   hawkCrit  the damage of a hawk's critical dives
//   bond      the extra damage Bond gives
//
// See classes/barbarian.js for what each list is for.

classes.beasttamer = {
  name: "Beast Tamer",
  icon: "🐺",
  art: "art/beasttamer.png",
  // The picture in the fight, with only the companion in use beside the tamer (the
  // one above, with all three, is for the hero tiles). Any class can have this: its
  // kinds of weapon or element, each with a picture.
  artWith: { wolf: "art/beasttamer-wolf.png", bear: "art/beasttamer-bear.png", hawk: "art/beasttamer-hawk.png" },
  fervour: "The Hunt",
  text: "A legendary class that never fights itself: its pet does. Starts with a bear, a wolf pack and a hawk, and catches the monsters it beats. Walks its own path: it earns totems where others earn fame.",
  // (a legendary class, opened with legend marks, and stronger than the others on purpose:
  // the owner, 17 October 2026)
  perLevel: { maxHp: 12, attack: 4 },
  base: { maxHp: 115, attack: 16, bleedStacks: 6, bond: 0.05, packTactics: 0.1, stunChance: 0.15, critChance: 0.3 },

  // Bought with legend marks: the id of the entry in legendUnlocks (data.js) that opens it
  unlock: "beastTamer",
  // A game of its own: nothing from the other classes, and totems in place of fame
  // (see "The Beast Tamer's own path" in data.js)
  ownPath: true,

  // No blacksmith: its pets grow by themselves (see "Pets" in game/equipment.js)
  fightsWithPets: true,
  dotType: "affliction",

  gearLabel: "Pet",
  // (the three paths, each named after its starter's id: a pet's "weapon" is its path, so
  // these names are the tags on everything that belongs to one path: "Physical: ...")
  gearTypes: { wolf: "Primal", bear: "Physical", hawk: "Magic" },
  gearIcons: { wolf: "🐺", bear: "🐻", hawk: "🦅" },
  // An animal is not made of bronze: these are the names of its tiers at the blacksmith,
  // who for this class is a trainer (see gearTiers in data.js; keep the list the same length)
  gearTiers: ["Young", "Grown", "Seasoned", "Alpha", "Elder", "Mythic"],

  upgrades: [
    { id: "wildHeart", name: "Wild Heart", text: "+5% attack", bonus: { attackPercent: 0.05 } },
    { id: "thickHide", name: "Thick Hide", text: "+5% health", bonus: { healthPercent: 0.05 } },
    { id: "packLeader", name: "Pack Leader", text: "Primal: bites deal +4% of your attack more", build: "wolf", bonus: { bitePower: 0.04 } },
    { id: "grizzled", name: "Grizzled", text: "Physical: its blow deals +15% of your attack more", build: "bear", bonus: { maulPower: 0.15 } },
    { id: "keenTalons", name: "Keen Talons", text: "Magic: +5% critical spell chance", build: "hawk", bonus: { critChance: 0.05 } },
    { id: "kinship", name: "Kinship", text: "Bond: +2% companion damage for every 10% of your health that is missing", bonus: { bond: 0.02 } }
  ],

  // Power, Toughness, one skill for each companion, and Bond for all of them
  skills: [
    // (the ids are the old ones, kept for old saves: "wolfMastery" is Instinct, and so on)
    { id: "command", name: "Command", text: "+3% your pet's attack", bonus: { attackPercent: 0.03 }, cost: 1 },
    // (Care was +3% health and +1.5% attack, and a tamer climbed as deep or deeper with it
    // never bought: health is worth little, and the less hurt the pet is, the less its Bond
    // gives. So Care is Bond's other side now: one for a pet that is kept whole, one for a
    // pet that fights hurt. 22 October 2026)
    { id: "hardiness", name: "Care", text: "Care: +3.5% pet damage while it has more than half its health", bonus: { care: 0.035 }, cost: 1 },
    { id: "bond", name: "Bond", text: "Bond: +3.5% pet damage for every 10% of its health that is missing", bonus: { bond: 0.035 }, cost: 1 },
    // (Might was only blow damage, which the Grizzled boon also gives, so it did nothing a
    // bear could feel: it came back faster too, as Arcana's spells do. 22 October 2026)
    { id: "bearMastery", name: "Might", text: "Physical: grown by Might. Its blow deals +9% of your attack more, +1% stun chance, and its skill comes back 3% faster", bonus: { maulPower: 0.09, stunChance: 0.01, skillHaste: 0.03 }, cost: 1 },
    { id: "hawkMastery", name: "Arcana", text: "Magic: grown by Arcana. +4.5% spell damage, spells come back 3% faster, and +2% critical chance", bonus: { spellPower: 0.045, spellHaste: 0.03, critChance: 0.02 }, cost: 1 },
    { id: "wolfMastery", name: "Instinct", text: "Primal: grown by Instinct. Bites deal +1.5% of your attack more, and bleeding +5%", bonus: { bitePower: 0.015, dotPower: 0.05 }, cost: 1 }
  ],

  milestones: [
    {
      floor: 5,
      perks: [
        { id: "weathered", name: "Weathered", text: "health x1.1", multiply: { health: 1.1 } },
        { id: "firmHand", name: "Firm Hand", text: "attack x1.1", multiply: { attack: 1.1 } }
      ]
    },
    {
      floor: 10,
      perks: [
        { id: "hideArmor", name: "Hide Armor", text: "+3 armor", bonus: { armor: 3 } },
        { id: "bloodBond", name: "Blood Bond", text: "Bond: +3% companion damage for every 10% of your health that is missing", bonus: { bond: 0.03 } }
      ]
    },
    {
      floor: 20,
      perks: [
        { id: "fourthWolf", name: "Fourth Wolf", text: "Primal: one more bite a turn", bonus: { packSize: 1 } },
        { id: "greatBear", name: "Great Bear", text: "Physical: +10% stun chance and your pet takes +5% more of every hit", bonus: { stunChance: 0.1, guard: 0.05 } },
        { id: "falconer", name: "Falconer", text: "Magic: +10% critical spell chance", bonus: { critChance: 0.1 } },
        { id: "packmate", name: "Packmate", text: "Bond: +6% companion damage for every 10% of your health that is missing", bonus: { bond: 0.06 } }
      ]
    },
    {
      floor: 35,
      perks: [
        { id: "plunderer", name: "Plunderer", text: "gold x2, and the gear the blacksmith makes is 10% stronger", multiply: { gold: 2, gear: 1.1 } },
        { id: "veteran", name: "Veteran", text: "+25% experience", bonus: { experience: 0.25 } }
      ]
    },
    {
      floor: 50,
      perks: [
        // (Beastlord and Old Growth were 20 to 50 floors behind each path's own perk here, so
        // each has more attack: x1.2 and x1.3, from x1.1 and x1.2. 22 October 2026)
        { id: "beastlord", name: "Beastlord", text: "attack x1.2, and +0.5% damage for every kill this run (up to +100%)", bonus: { killStreak: 0.005 }, multiply: { attack: 1.2 } },
        { id: "oldGrowth", name: "Old Growth", text: "health x1.5, armor x1.4 and attack x1.3", multiply: { health: 1.5, armor: 1.4, attack: 1.3 } },
        { id: "direPack", name: "Dire Pack", text: "Primal: bite damage x1.5", multiply: { wolf: 1.5 } },
        { id: "caveBear", name: "Cave Bear", text: "Physical: blow damage x1.8", multiply: { bear: 1.8 } },
        { id: "stormHawk", name: "Storm Hawk", text: "Magic: critical spell damage x1.8", multiply: { hawkCrit: 1.8 } },
        { id: "oneSoul", name: "One Soul", text: "Bond x3: three times the companion damage for your missing health", multiply: { bond: 3 } }
      ]
    },
    // KEYSTONES: each changes a rule of one companion, and costs something. This milestone is
    // optional: pick one, or none (press the chosen one again to let it go).
    // See "Keystones" in data.js.
    {
      floor: 51,
      keystones: true,
      perks: [
        { id: "alpha", name: "Alpha", keystone: true, text: "Primal: one great bite instead of many: all of them in one, +30%, but no bite lands harder than the one before", bonus: { alpha: 1 } },
        { id: "bodyguard", name: "Bodyguard", keystone: true, text: "Physical: your pet takes 20% more of every hit for you. Blow damage x0.75", bonus: { bodyguard: 0.2 }, multiply: { bear: 0.75 } },
        { id: "blindingDive", name: "Blinding Dive", keystone: true, text: "Magic: a critical spell has a 50% chance to make the enemy miss its next turn. Critical spell damage x0.8", bonus: { blindingDive: 0.5 }, multiply: { hawkCrit: 0.8 } }
      ]
    },
    {
      floor: 75,
      perks: [
        { id: "apex", name: "Apex", text: "attack x1.3, all your damage +75% against bosses, and your abilities are ready a fifth sooner", bonus: { bossSlayer: 0.75, quickHands: 0.2 }, multiply: { attack: 1.3 } },
        // (attack x1.2, then x1.3, was last or near it for every path. 22 October 2026)
        { id: "ironwoodHeart", name: "Ironwood Heart", text: "health x1.6, attack x1.4, and once a run survive a killing blow on half health", bonus: { secondWind: 1 }, multiply: { health: 1.6, attack: 1.4 } },
        { id: "wolfKing", name: "Wolf King", text: "Primal: attack x1.3, one more bite a turn, and bites deal +10% of your attack more", bonus: { packSize: 1, bitePower: 0.1 }, multiply: { attack: 1.3 } },
        { id: "ursine", name: "Ursine", text: "Physical: attack x1.3, its blow deals +80% of your attack more, and +8% stun chance", bonus: { maulPower: 0.8, stunChance: 0.08 }, multiply: { attack: 1.3 } },
        { id: "skyHunter", name: "Sky Hunter", text: "Magic: attack x1.3, +10% critical spell chance and +80% critical damage", bonus: { critChance: 0.1, critPower: 0.8 }, multiply: { attack: 1.3 } },
        // (+25% attack was added to every other attack bonus, so it was worth far less than it
        // read: last or near it for every path. 22 October 2026)
        { id: "kindred", name: "Kindred", text: "attack x1.2, and Bond: +10% companion damage for every 10% of your health that is missing", bonus: { bond: 0.1 }, multiply: { attack: 1.2 } },
        // (Wary was attack x1.2, and came last at this milestone for every path: taking less
        // damage is worth little to a tamer, and costs it Bond. 22 October 2026)
        { id: "wary", name: "Wary", text: "You take 25% less damage, and attack x1.35", multiply: { damageTaken: 0.75, attack: 1.35 } }
      ]
    },
    {
      floor: 100,
      perks: [
        // (x1.15 was 32 floors behind One Heart for the wolf pack. 22 October 2026)
        { id: "fenrir", name: "Fenrir's Brood", text: "Primal: bite damage x1.4 again", multiply: { wolf: 1.4 } },
        { id: "ursaMajor", name: "Ursa Major", text: "Physical: blow damage x2.4 again", multiply: { bear: 2.4 } },
        { id: "roc", name: "Roc", text: "Magic: critical spell damage x1.8 again", multiply: { hawkCrit: 1.8 } },
        { id: "oneHeart", name: "One Heart", text: "Bond x3 again", multiply: { bond: 3 } },
        // (attack x1.4 came last at this milestone for every path, 11 to 55 floors behind. 22 October 2026)
        { id: "ancientOne", name: "Ancient One", text: "health x2, armor x1.5, attack x1.7, and you heal 2% of your health every turn of a fight", bonus: { prayer: 0.02 }, multiply: { health: 2, armor: 1.5, attack: 1.7 } }
      ]
    }
  ],

  // Extra choices at every BREAKTHROUGH (floor 150 and beyond), beside the ones every
  // class has. One for each build: it multiplies that build's own damage again.
  breakthroughs: [
    { id: "sharperFangs", name: "Sharper Fangs", text: "Primal: bite damage x1.5", multiply: { wolf: 1.5 } },
    { id: "heavierPaws", name: "Heavier Paws", text: "Physical: blow damage x1.5", multiply: { bear: 1.5 } },
    { id: "higherDives", name: "Higher Dives", text: "Magic: critical spell damage x1.5", multiply: { hawkCrit: 1.5 } },
    { id: "deeperBond", name: "Deeper Bond", text: "Bond x2", multiply: { bond: 2 } }
  ],

  // Special moves on a cooldown, put in the slots that open on floors 10, 35 and 75
  // (rules in game/abilities.js). "cooldown" is in turns of fighting. "build" works as
  // for boons. A "bossKiller" starts set to "Bosses only". "use" is what it does, built
  // from the pieces in game/abilities.js (abilityHit, abilitySpell, abilityStun...).
  abilities: [
    { id: "packHunt", name: "Pack Hunt", text: "Primal: every bite at once, for 3 turns of your damage", build: "wolf", cooldown: 6,
      use: function () { abilityTurns(3); } },
    { id: "bearHug", name: "Bear Hug", text: "Physical: 2.5 turns of your damage, and the enemy is held for a turn", build: "bear", cooldown: 7,
      use: function () { abilityTurns(2.5); abilityStun(); } },
    { id: "stoop", name: "Stoop", text: "Magic: a strike from above for 3 turns of your damage", build: "hawk", cooldown: 6,
      use: function () { abilityTurns(3); } },
    { id: "tendWounds", name: "Tend Wounds", text: "Heal 30% of your health", cooldown: 12,
      use: function () { abilityHeal(0.3); } },
    { id: "stampede", name: "Stampede", text: "Boss killer: every beast in earshot, for 10 turns of your damage", cooldown: 30, bossKiller: true,
      use: function () { abilityTurns(10); } }
  ],

  relics: [
    { id: "wolfsTooth", name: "Wolf's Tooth", text: "Primal: one more bite a turn, and all your damage +20% against an enemy below half health", build: "wolf", bonus: { packSize: 1, finisher: 0.2 } },
    { id: "bearClaw", name: "Bear Claw", text: "Physical: +10% stun chance, and 15% of every attack against you is thrown back at the enemy", build: "bear", bonus: { stunChance: 0.1, brace: 0.15 } },
    { id: "hawkHood", name: "Hawk Hood", text: "Magic: +8% critical spell chance, and all your damage +50% on the first turn of every fight", build: "hawk", bonus: { critChance: 0.08, opener: 0.5 } },
    { id: "tamersWhistle", name: "Tamer's Whistle", text: "Bond: +4% companion damage for every 10% of your health that is missing, and you heal for 3% of the damage your turns deal", bonus: { bond: 0.04, leech: 0.03 } },
    { id: "alphasFang", name: "Alpha's Fang", legendary: true, text: "Primal: bite damage x2.5, and health x1.5", build: "wolf", bonus: {}, multiply: { wolf: 2.5, health: 1.5 } },
    { id: "ursineHeart", name: "Ursine Heart", legendary: true, text: "Physical: blow damage x2.5, and health x1.5", build: "bear", bonus: {}, multiply: { bear: 2.5, health: 1.5 } },
    { id: "skyTalon", name: "Sky Talon", legendary: true, text: "Magic: critical spell damage x2.5, and health x1.5", build: "hawk", bonus: {}, multiply: { hawkCrit: 2.5, health: 1.5 } }
  ],

  startFight: tamerStartFight,
  quickFight: tamerQuickFight,
  damageTypes: tamerDamageTypes,
  attack: tamerAttack,
  whenAttacked: tamerWhenAttacked,
  damageDivider: tamerDamageDivider,
  dotPerStack: tamerDotPerStack,
  statLine: tamerStatLine,
  gearInfo: tamerGearInfo
};

// The numbers behind the pets. Change these to retune them.
const wolfCount = 3;          // a Primal pet bites this many times a turn (the wolf pack's wolves)
const wolfBite = 0.35;        // each bites for this share of your attack
const wolfBleed = 0.06;       // each bleed stack on the enemy deals this share of your attack a turn
const bearMaul = 1.7;         // a Physical pet's blow hits for this many times your attack
const hawkDive = 0.92;        // a Magic pet's dive hits for this many times your attack...
const hawkPlain = 0.55;       // ...but a plain dive, between spells, only this share of it
const hawkCrit = 2.0;         // a critical spell multiplies its damage by this
const spellTurn = 0.5;        // a turn of a spell's damage, as a share of your attack. (Storm
                              // Dive, 3 turns, was 3 dives at first: the hawk then climbed 90
                              // floors past the bear, so it is 2 dives now. 17 October 2026)
const bondGuard = 0.2;        // for Bond, this share of a guarding pet's guard counts as health missing
                              // (0.2: a bear's Bond is about the wolf pack's. With 1 it climbed 115
                              // floors deeper, with 0.5 about 70. 22 October 2026)
const alphaBonus = 1.3;       // the Alpha keystone's one wolf bites for the whole pack, times this
// Arcana makes a magic pet's spells come back faster, but at most this much faster (0.5:
// Storm Dive every 2 turns, not 3). Haste past it adds to the spell's damage instead.
// Might does the same for a physical pet's skill (every 4 turns, not 6), with no extra past it.
// (Uncapped, a deep hawk cast every turn, and Storm Eye made every attack miss.)
const petHasteMost = 0.5;

// The pets and their kits are in classes/pets.js.

// Turns of fighting since the pet's skill was last used. It carries from one fight to
// the next, so a fight that ends early never wastes it (saved with the fight: fightParts
// in game/save.js). Arcana makes a magic pet's charge build faster ("spellHaste").
let petCharge = 0;

// The enemy's next attack misses (Storm Eye, a curse...)
let enemyDazzled = false;

// Damage a skill dealt beyond the kill. It lands on the next monster, so a big skill on
// a nearly dead monster is never wasted.
let petOverflow = 0;

// The kit of the pet you are bonded with
function petKit() {
  return petKits[pet] || petKits[weapon];
}

// The turns between two uses of its skill: its path's, unless the kit says otherwise
function petEvery() {
  return petKit().every || petPaths[petKit().path].every;
}

// The word that limits its stacks (bleeding and poison are both the class's "affliction")
function petStackWord() {
  return "bleedStacks";
}

// The damage types this class is dealing right now (for the tower list)
function tamerDamageTypes() {
  if (petKit().path === "Primal" && petKit().type !== "affliction") {
    return [petKit().type, "affliction"];
  }
  return [petKit().type];
}

// Bond: the pet fights harder the more hurt it is. This is what its damage is
// multiplied by: every full 10% of health missing adds the bond.
function tamerBond() {
  return 1 + bondTenths() * totalBonus("bond") * multiplier("bond");
}

// Care: the pet fights harder while it is kept whole (more than half its health)
function tamerCare() {
  if (playerHp <= playerMaxHp / 2) {
    return 1;
  }
  return 1 + totalBonus("care");
}

// The tenths of health missing, for Bond: every full tenth, and a pet that guards you
// adds part of the share of every hit it takes for you (bondGuard), as tenths too.
// (Without that, Bond did nothing for the bear: it kept the tamer so whole that at the
// deepest floors Bond counted on 4% of its turns, against 33% for the wolf pack. The
// bot's "edge" prints this. 22 October 2026)
function bondTenths() {
  return Math.max(0, Math.floor((1 - playerHp / playerMaxHp) * 10 + 0.0001)) + tamerGuard() * bondGuard * 10;
}

// How many bites a Primal pet lands a turn
function tamerWolves() {
  return wolfCount + Math.floor(totalBonus("packSize"));
}

// The share of every hit the pet takes for you (never past the limit on chances)
function tamerGuard() {
  return Math.min(maxChance, totalBonus("guard") + totalBonus("bodyguard"));
}

// Runs at the start of every fight: what the last skill had left over lands now, and a
// pet with "loaded" has its spell ready on the first turn
function tamerStartFight() {
  if (petOverflow > 0) {
    monsterHp = Math.max(1, monsterHp - Math.round(petOverflow));
    petOverflow = 0;
  }
  if (totalBonus("loaded") > 0) {
    petCharge = Math.max(petCharge, petEvery() - 1);
  }
  // ("stackCarry": a share of the last fight's stacks moves on to this monster)
  if (totalBonus("stackCarry") > 0) {
    dotStacks = Math.min(totalBonus(petStackWord()), Math.floor(lastFightStacks * totalBonus("stackCarry")));
  }
}

// A magic pet does most of its damage with its spell, every few turns, so a fight it ends
// with its first spell still counts as won without slowing down (see quickFightTurns in
// game/fights.js). Without this the hawk's runs started 200 floors below its reach.
function tamerQuickFight() {
  if (petKit().path !== "Magic") {
    return cruiseTurns;
  }
  return Math.max(cruiseTurns, Math.ceil(petEvery() / (1 + petHaste())));
}

// How much faster its skill comes back, up to petHasteMost: a magic pet's spells by
// Arcana's "spellHaste", a physical pet's skill by Might's "skillHaste"
function petHaste() {
  if (petKit().path === "Magic") {
    return Math.min(petHasteMost, totalBonus("spellHaste"));
  }
  if (petKit().path === "Physical") {
    return Math.min(petHasteMost, totalBonus("skillHaste"));
  }
  return 0;
}

// A skill's hit: anything past the kill is kept for the next monster
function petSkillHit(damage, type, armorShare) {
  hitMonster(damage, type, armorShare);
  if (monsterHp < 0) {
    petOverflow = petOverflow - monsterHp;
  }
}

// A spell of "turns" turns of damage, raised by Arcana, that can strike critically.
// Critical chance past 100% adds to the critical damage instead.
function petCastSpell(turns, armorShare) {
  let damage = petPower * spellTurn * turns * (1 + totalBonus("spellPower") + overflow("spellHaste", petHasteMost));
  let critical = chance(totalBonus("critChance")) || (totalBonus("spellExecute") > 0 && monsterHp < monsterMaxHp / 2);
  if (critical) {
    damage = damage * (hawkCrit + totalBonus("critPower") + overflow("critChance", 1)) * multiplier("hawkCrit");
    say(petKit().skill + " strikes true!");

    // Blinding Dive (keystone)
    if (chance(totalBonus("blindingDive"))) {
      monsterStunned = true;
    }
  }
  petSkillHit(damage, petKit().type, armorShare);
  if (totalBonus("spellDazzle") > 0) {
    enemyDazzled = true;
  }
  if (totalBonus("spellHeal") > 0) {
    healPlayer(playerMaxHp * totalBonus("spellHeal"));
  }
  // (spellEcho: now and then a spell comes straight back)
  if (chance(totalBonus("spellEcho"))) {
    petCharge = petCharge + petEvery();
  }
}

// The tamer never attacks: the pet does everything, and the tamer's levels, skills and
// perks are what make it stronger. Its plain attack is its path's; its skill is its own.
function tamerAttack() {
  petPower = playerAttack * tamerBond() * tamerCare() * (1 + totalBonus("rampTurn") * fightTurns) * (1 + totalBonus("armorToDamage") * armorShareBlocked());
  // ("thirdHit": every third turn of a fight it strikes harder)
  if (totalBonus("thirdHit") > 0 && fightTurns % 3 === 0) {
    petPower = petPower * (1 + totalBonus("thirdHit"));
  }
  let power = petPower;
  let type = petKit().type;

  petCharge = petCharge + 1 + petHaste();
  // ("lowHpHaste": below half health its skill comes back faster)
  if (playerHp < playerMaxHp / 2) {
    petCharge = petCharge + totalBonus("lowHpHaste");
  }
  let skillReady = petCharge >= petEvery();
  if (skillReady) {
    petCharge = petCharge - petEvery();
  }

  // PRIMAL (the wolf pack's way): many bites, each a little harder than the one before,
  // and every bite opens a bleeding (or poisoned) wound
  if (weapon === "wolf") {
    let bite = power * (wolfBite + totalBonus("bitePower")) * multiplier("wolf");

    if (totalBonus("alpha") > 0) {
      // Alpha (keystone): one great bite with the whole pack's in it
      hitMonster(bite * tamerWolves() * alphaBonus, type);
      addDotStack(totalBonus("bleedStacks"));
    } else {
      for (let i = 0; i < tamerWolves(); i++) {
        hitMonster(bite * (1 + totalBonus("packTactics") * i), type);
        addDotStack(totalBonus("bleedStacks"));
      }
    }
  }

  // PHYSICAL (the bear's way): one heavy blow, which can stun. Stun chance past its
  // limit adds to the blow.
  if (weapon === "bear") {
    hitMonster(power * (bearMaul + totalBonus("maulPower") + overflow("stunChance", maxChance)) * multiplier("bear"), type);
    if (chance(cappedChance("stunChance"))) {
      monsterStunned = true;
      say("Your " + petKit().name + " knocks the enemy down!");
    }
  }

  // MAGIC (the hawk's way): weak plain hits between spells, where only half of the
  // enemy's armor is in the way
  if (weapon === "hawk") {
    hitMonster(power * hawkDive * hawkPlain, type, 0.5);
  }

  if (skillReady) {
    say("Your " + petKit().name + ": " + petKit().skill + "!");
    petKit().use();
  }

  // The bleeding or poison on the enemy (a Primal pet's bites, or a skill's stacks)
  if (dotStacks > 0) {
    monsterHp = monsterHp - dotDamage();
  }
}

// Runs when the monster attacks. Return true if the attack is avoided.
function tamerWhenAttacked() {
  if (enemyDazzled) {
    enemyDazzled = false;
    say("The enemy is dazzled, and its attack misses!");
    return true;
  }
  return false;
}

// What you take is divided by this: a pet that stands in front of you ("guard"), and
// one that shrugs off bosses ("bossGuard")
function tamerDamageDivider() {
  let divider = 1 / (1 - tamerGuard());
  if (encounterType === "boss") {
    divider = divider / (1 - Math.min(maxChance, totalBonus("bossGuard")));
  }
  return divider;
}

// The bleeding: each stack on the enemy, every turn
function tamerDotPerStack() {
  return Math.max(1, Math.round(playerAttack * wolfBleed * multiplier("wolf")));
}

function tamerStatLine() {
  let guarding = tamerGuard() > 0 ? ", and its guard counts as " + percent(tamerGuard() * bondGuard) + " missing" : "";
  let care = totalBonus("care") > 0 ? ". Care: +" + percent(totalBonus("care")) + " damage while it has more than half its health (" + (tamerCare() > 1 ? "on" : "off") + " right now)" : "";
  return "Bond: your pet deals +" + percent(totalBonus("bond") * multiplier("bond")) + " damage for every 10% of its health that is missing" + guarding + " (right now x" + big(Math.round(tamerBond() * 100) / 100) + ")" + care;
}

// What the bonded pet does, with its kit
function tamerGearInfo() {
  let kit = petKit();
  return kit.path + " pet, grown by " + petPaths[kit.path].stat + ". " + kit.skill + " every " + petEvery() + " turns: " + kit.skillText + ". " + kit.passive + ": " + kit.passiveText + ". " + tamerPlainInfo();
}

function tamerPlainInfo() {
  if (weapon === "wolf") {
    if (totalBonus("alpha") > 0) {
      return "One great bite for " + percent((wolfBite + totalBonus("bitePower")) * tamerWolves() * alphaBonus) + " of your attack.";
    }
    return tamerWolves() + " bites every turn for " + percent(wolfBite + totalBonus("bitePower")) + " of your attack each, each " + percent(totalBonus("packTactics")) + " harder than the one before, and the enemy bleeds for " + percent(wolfBleed) + " of your attack a stack, up to " + Math.floor(totalBonus("bleedStacks")) + " stacks.";
  }
  if (weapon === "bear") {
    return "A blow for " + percent(bearMaul + totalBonus("maulPower")) + " of your attack with a " + percent(cappedChance("stunChance")) + " chance to stun" + (tamerGuard() > 0 ? ", and it takes " + percent(tamerGuard()) + " of every hit for you." : ".")
      + overflowNote(overflow("stunChance", maxChance), "damage");
  }
  return "Plain hits for " + percent(hawkDive * hawkPlain) + " of your attack. Its spells have a " + percent(Math.min(1, totalBonus("critChance"))) + " chance to be critical, for x" + (hawkCrit + totalBonus("critPower") + overflow("critChance", 1)).toFixed(1) + " damage.";
}
