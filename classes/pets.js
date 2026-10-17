// =====================================================================
//  classes/pets.js - the Beast Tamer's pets: one kit for each
// =====================================================================
// The Beast Tamer never attacks: its bonded pet does (classes/beasttamer.js). The wolf,
// the bear and the hawk are the starters. Every other pet is CAUGHT: a monster beaten in
// a tower sometimes joins you (see "Catching pets" in data.js).
//
// Every pet walks one of three PATHS, and the path decides most of how it fights:
//   Physical - grown by Might.    A full blow every turn, that can stun.   Skill every 6 turns.
//   Primal   - grown by Instinct. Quick bites that stack bleeding or poison. Skill every 5.
//   Magic    - grown by Arcana.   Weak hits, and a spell that can strike critically. Every 3.
// A pet uses its path's starter's perks, boons, relics and abilities: a Rhino is a
// Physical pet, so everything that says "Bear:" works for it too. ("weapon" is the path's
// starter: bear, wolf or hawk. "pet" is the pet you are bonded with.)
//
// What is the pet's own: its name, its damage type, its SKILL (used by itself every few
// turns) and its PASSIVE (always on). Both are built from shared pieces, so a new pet is a
// block of data here, not new code.
//
// TO ADD A PET: add a block to the list below.
//   name        - its name on the page
//   monster     - the monster in towers.js it is caught from (leave it out for a starter)
//   boss        - true for a boss: it is tamed only once the bestiary knows it (petBossKnown)
//   path        - "Physical", "Primal" or "Magic"
//   every       - the turns between two uses of its skill, if not its path's (leave it out)
//   type        - the damage type of its hits (see damageTypes in data.js)
//   skill       - the skill's name, and skillText what it does in a few words
//   use         - what the skill does, made of the pieces below the list:
//                   petHit(turns, armorShare)  that many turns of damage (armorShare: how
//                                              much of the enemy's armor is in the way, 1 if left out)
//                   petSpell(turns, armorShare) a spell: can strike critically (Magic pets)
//                   petStacks(count)           bleed or poison stacks
//                   petStun()                  the enemy loses its next turn
//                   petStunChance(share)       ...with this chance
//                   petBlind()                 the enemy's next attack misses
//                   petBoost(amount, turns)    all its damage +amount for some turns
//                   petGuard(share, turns)     it takes "share" less damage for some turns
//                   petHeal(share)             heals that share of its health
//                   petDrain(turns, share)     turns of damage, healing that share of it
//                   petKillHeal(share)         heals that share if the monster has fallen
//                   petSacrifice(share)        pays that share of its health (never the last point)
//   passive     - the passive's name, and passiveText what it does
//   bonus       - the passive's numbers, as bonus words. Any word the game reads works
//                 (healthPercent, attackPercent, gold, opener, dotPower, armorPercent...),
//                 and the pets have a few of their own:
//                   guard        share of every hit it takes for you          (0.25 means 25%)
//                   spellDazzle  1 = after every spell, the enemy's next attack misses
//                   bossGuard    share less damage taken from bosses         (0.25 means 25%)
//                   rampTurn     extra damage for every turn of a fight      (0.1 means +10%)
//                   spellExecute 1 = spells on an enemy below half health are always critical
//                   spellEcho    chance a spell comes straight back           (0.2 means 20%)
//                   loaded       1 = its first spell of every fight is ready at once
//                   spellHeal    every spell heals it this share of its health (0.08 means 8%)
//                   stackCarry   share of the stacks on a fallen monster that move to the next
//                   armorToDamage the share of hits its armor blocks, added to its damage (1 = all)
//                   thirdHit     every third turn of a fight it strikes this much harder
//                   lowHpHaste   below half health, its skill comes back this much faster (1 = twice)
//                   petCatch     pets are caught this much more often      (0.25 means +25%)
//                   essenceGain  extra Essence                              (0.5 means +50%)
// A skill is worth at least one turn of damage for every turn it takes to come back (the
// rule of docs/design/tamer-mode: a slow spell must not punish).

const petKits = {
  // ----- The starters: one for each path -----
  bear: {
    name: "Bear", path: "Physical", type: "crushing",
    skill: "Crushing Maul", skillText: "2.5 turns of damage, and the enemy loses a turn",
    use: function () { petHit(2.5); petStun(); },
    passive: "Guardian", passiveText: "the bear takes a quarter of every hit for you",
    bonus: { guard: 0.25 }
  },
  wolf: {
    name: "Wolf Pack", path: "Primal", type: "slashing",
    skill: "Rend", skillText: "2 turns of damage and 4 bleed stacks",
    use: function () { petHit(2); petStacks(4); },
    passive: "Pack Tactics", passiveText: "every bite bleeds, and each bite in a turn lands harder than the one before",
    bonus: {}
  },
  hawk: {
    name: "Hawk", path: "Magic", type: "lightning",
    skill: "Storm Dive", skillText: "a lightning spell for 3 turns of damage, past half the enemy's armor",
    use: function () { petSpell(3); },
    passive: "Storm Eye", passiveText: "after every spell the enemy's next attack misses",
    bonus: { spellDazzle: 1 }
  },

  // ----- The Wild Reaches (the Tamer's own tower) -----
  rhino: {
    name: "Rhino", monster: "Rhino", path: "Physical", type: "crushing",
    skill: "Trample", skillText: "3 turns of damage that ignore armor",
    use: function () { petHit(3, 0); },
    passive: "Plate Hide", passiveText: "double armor",
    bonus: { armorPercent: 1 }
  },
  greatApe: {
    name: "Great Ape", monster: "Great Ape", path: "Physical", type: "crushing",
    skill: "Chest Beat", skillText: "2 turns of damage, and all its damage +50% for 3 turns",
    use: function () { petHit(2); petBoost(0.5, 3); },
    passive: "Rampage", passiveText: "+5% damage for every turn of the fight",
    bonus: { rampTurn: 0.05 }
  },
  tusker: {
    name: "Tusker", monster: "Tusker", path: "Primal", type: "piercing",
    skill: "Gore", skillText: "2 turns of damage and 3 bleed stacks",
    use: function () { petHit(2); petStacks(3); },
    passive: "A Lot of Animal", passiveText: "+15% attack, and +50% damage on the first turn of a fight",
    bonus: { attackPercent: 0.15, opener: 0.5 }
  },
  viper: {
    name: "Viper", monster: "Viper", path: "Primal", type: "affliction",
    skill: "Venom Strike", skillText: "1 turn of damage and 6 poison stacks at once",
    use: function () { petHit(1); petStacks(6); },
    passive: "Potent", passiveText: "every poison stack deals 40% more",
    bonus: { dotPower: 0.4 }
  },
  hyena: {
    name: "Hyena", monster: "Hyena", path: "Magic", type: "arcane",
    skill: "Cackling Curse", skillText: "a spell for 2 turns of damage; the enemy misses its next attack, and all its damage is +30% for 3 turns",
    use: function () { petBoost(0.3, 3); petSpell(2); petBlind(); },
    passive: "Scavenger", passiveText: "spells on an enemy below half health are always critical, and +30% spell damage",
    bonus: { spellExecute: 1, spellPower: 0.3 }
  },
  sabrecat: {
    name: "Sabrecat", monster: "Sabrecat", path: "Primal", type: "slashing",
    skill: "Pounce", skillText: "3 turns of damage and 3 bleed stacks",
    use: function () { petHit(3); petStacks(3); },
    passive: "All Claws", passiveText: "+40% damage against an enemy below half health",
    bonus: { finisher: 0.4 }
  },

  // ----- The Orc Stronghold -----
  goblin: {
    name: "Goblin", monster: "Goblin", path: "Magic", type: "fire",
    skill: "Gold Hex", skillText: "a fire spell for 3 turns of damage",
    use: function () { petSpell(3); },
    passive: "Lucky Hex", passiveText: "+15% gold (and so experience for your pet), and every spell has a 12% chance to come straight back",
    bonus: { gold: 0.15, spellEcho: 0.12 }
  },
  orcGrunt: {
    name: "Orc Grunt", monster: "Orc Grunt", path: "Physical", type: "crushing",
    skill: "Headbutt", skillText: "2 turns of damage, and a 50% chance the enemy loses a turn",
    use: function () { petHit(2); petStunChance(0.5); },
    passive: "Thick Skull", passiveText: "takes 25% less damage from bosses, and deals them 25% more",
    bonus: { bossGuard: 0.25, bossSlayer: 0.25 }
  },

  warg: {
    name: "Warg", monster: "Warg", path: "Primal", type: "slashing",
    skill: "Frenzy", skillText: "3 turns of damage and 3 bleed stacks",
    use: function () { petHit(3); petStacks(3); },
    passive: "Glass Jaw", passiveText: "+40% attack, 20% less health",
    bonus: { attackPercent: 0.4, healthPercent: -0.2 }
  },
  orcWarrior: {
    name: "Orc Warrior", monster: "Orc Warrior", path: "Physical", type: "crushing",
    skill: "Shield Bash", skillText: "2 turns of damage, and the enemy's hits are halved for 2 turns",
    use: function () { petHit(2); petGuard(0.5, 2); },
    passive: "Stubborn", passiveText: "once a run, survives a killing blow on half health, and +10% attack",
    bonus: { secondWind: 1, attackPercent: 0.1 }
  },
  orcBerserker: {
    name: "Orc Berserker", monster: "Orc Berserker", path: "Primal", type: "slashing",
    skill: "Bloodlust", skillText: "3 turns of damage and 3 bleed stacks, for 10% of its own health",
    use: function () { petSacrifice(0.1); petHit(3); petStacks(3); },
    passive: "Berserk", passiveText: "+15% damage for every 10% of its health that is missing",
    bonus: { bond: 0.15 }
  },
  ogre: {
    name: "Ogre", monster: "Ogre", path: "Physical", type: "crushing",
    skill: "Club Sweep", skillText: "3 turns of damage",
    use: function () { petHit(3); },
    passive: "Mountain of Health", passiveText: "+80% health, and heals 5% after every kill",
    bonus: { healthPercent: 0.8, healOnKill: 0.05 }
  },

  // ----- Raider's Pass -----
  crossbowman: {
    name: "Crossbowman", monster: "Crossbowman", path: "Magic", type: "lightning",
    skill: "Rune Bolt", skillText: "a rune-carved bolt: a spell for 3 turns of damage, past half the enemy's armor",
    use: function () { petSpell(3); },
    passive: "Loaded", passiveText: "its first spell of every fight is ready at once",
    bonus: { loaded: 1 }
  },
  cutpurse: {
    name: "Cutpurse", monster: "Cutpurse", path: "Primal", type: "piercing",
    skill: "Quick Hands", skillText: "2 turns of damage and 2 bleed stacks",
    use: function () { petHit(2); petStacks(2); },
    passive: "Full Purse", passiveText: "+15% gold (and so experience for your pet), and pets are caught 25% more often",
    bonus: { gold: 0.15, petCatch: 0.25 }
  },
  raider: {
    name: "Raider", monster: "Raider", path: "Physical", type: "slashing",
    skill: "Reckless Charge", skillText: "3 turns of damage",
    use: function () { petHit(3); },
    passive: "All Attack", passiveText: "+50% attack, but half its armor",
    bonus: { attackPercent: 0.5, armorPercent: -0.5 }
  },
  duelist: {
    name: "Duelist", monster: "Duelist", path: "Primal", type: "piercing",
    skill: "Riposte", skillText: "the enemy's next attack is turned aside, and answered with 2 turns of damage",
    use: function () { petBlind(); petHit(2); },
    passive: "Fast Hands", passiveText: "+40% damage on a weakness",
    bonus: { exploit: 0.4 }
  },
  raiderCaptain: {
    name: "Raider Captain", monster: "Raider Captain", path: "Physical", type: "slashing",
    skill: "Plunder", skillText: "3 turns of damage",
    use: function () { petHit(3); },
    passive: "Hardest Hitter", passiveText: "+30% damage on the first turn of a fight, and +10% gold",
    bonus: { opener: 0.3, gold: 0.1 }
  },
  pitFighter: {
    name: "Pit Fighter", monster: "Pit Fighter", path: "Physical", type: "crushing",
    skill: "Crowd Pleaser", skillText: "2.5 turns of damage, and heals 10% if it kills",
    use: function () { petHit(2.5); petKillHeal(0.1); },
    passive: "Grudge", passiveText: "throws back 25% of every hit it takes",
    bonus: { brace: 0.25 }
  },

  // ----- Wildwood -----
  wildBoar: {
    name: "Wild Boar", monster: "Wild Boar", path: "Physical", type: "crushing",
    skill: "Charge", skillText: "3.5 turns of damage",
    use: function () { petHit(3.5); },
    passive: "Head Down", passiveText: "+40% damage on the first turn of a fight",
    bonus: { opener: 0.4 }
  },
  giantSpider: {
    name: "Giant Spider", monster: "Giant Spider", path: "Primal", type: "affliction",
    skill: "Web", skillText: "the enemy loses its next turn, and takes 4 poison stacks",
    use: function () { petStun(); petStacks(4); },
    passive: "Venomous", passiveText: "its hits pass a third of the enemy's armor, and poison +15%",
    bonus: { penetration: 0.3, dotPower: 0.15 }
  },
  direWolf: {
    name: "Dire Wolf", monster: "Dire Wolf", path: "Primal", type: "slashing",
    skill: "Rend", skillText: "2 turns of damage and 4 bleed stacks",
    use: function () { petHit(2); petStacks(4); },
    passive: "Pack Hunter", passiveText: "+0.5% damage for every kill this run (up to +100%)",
    bonus: { killStreak: 0.005 }
  },
  treant: {
    name: "Treant", monster: "Treant", path: "Magic", type: "nature",
    skill: "Entangle", skillText: "roots the enemy for a turn, and a spell for 2 turns of damage",
    use: function () { petStun(); petSpell(2); },
    passive: "Photosynthesis", passiveText: "every spell heals it 8% of its health",
    bonus: { spellHeal: 0.08 }
  },
  forestTroll: {
    name: "Forest Troll", monster: "Forest Troll", path: "Magic", type: "nature",
    skill: "Thornlash", skillText: "a spell for 3 turns of damage",
    use: function () { petSpell(3); },
    passive: "Regrowth", passiveText: "heals 4% of its health every turn",
    bonus: { prayer: 0.04 }
  },
  direBear: {
    name: "Dire Bear", monster: "Dire Bear", path: "Physical", type: "crushing",
    skill: "Maul", skillText: "2.5 turns of damage, and the enemy loses a turn",
    use: function () { petHit(2.5); petStun(); },
    passive: "Huge", passiveText: "+60% health and +15% attack",
    bonus: { healthPercent: 0.6, attackPercent: 0.15 }
  },

  // ----- The Undercity -----
  sewerRat: {
    name: "Sewer Rat", monster: "Sewer Rat", path: "Primal", type: "affliction",
    skill: "Gnaw", skillText: "1 turn of damage and 4 stacks of disease",
    use: function () { petHit(1); petStacks(4); },
    passive: "Everyone Starts Somewhere", passiveText: "+50% experience for the tamer",
    bonus: { experience: 0.5 }
  },
  thug: {
    name: "Thug", monster: "Thug", path: "Physical", type: "crushing",
    skill: "Sucker Punch", skillText: "2 turns of damage, before the enemy can swing: its next attack misses",
    use: function () { petBlind(); petHit(2); },
    passive: "Swings First", passiveText: "+60% damage on the first turn of a fight",
    bonus: { opener: 0.6 }
  },
  smuggler: {
    name: "Smuggler", monster: "Smuggler", path: "Magic", type: "fire",
    skill: "Firebomb", skillText: "a fire spell for 2 turns of damage, and 3 burning stacks",
    use: function () { petSpell(2); petStacks(3); },
    passive: "Black Market", passiveText: "+50% Essence",
    bonus: { essenceGain: 0.5 }
  },
  watchman: {
    name: "Watchman", monster: "Watchman", path: "Physical", type: "piercing",
    skill: "Halberd Thrust", skillText: "2.5 turns of damage that ignore armor",
    use: function () { petHit(2.5, 0); },
    passive: "Real Armor", passiveText: "double armor, and throws back 10% of every hit",
    bonus: { armorPercent: 1, brace: 0.1 }
  },
  plagueBearer: {
    name: "Plague Bearer", monster: "Plague Bearer", path: "Primal", type: "affliction",
    skill: "Plague", skillText: "1 turn of damage and 5 poison stacks",
    use: function () { petHit(1); petStacks(5); },
    passive: "Contagion", passiveText: "when a monster dies, its poison moves to the next one in full",
    bonus: { stackCarry: 1 }
  },
  enforcer: {
    name: "Enforcer", monster: "Enforcer", path: "Physical", type: "crushing",
    skill: "Break Legs", skillText: "2 turns of damage, and the enemy hits 30% weaker for 3 turns",
    use: function () { petHit(2); petGuard(0.3, 3); },
    passive: "The Guild's Muscle", passiveText: "+20% attack and +20% health",
    bonus: { attackPercent: 0.2, healthPercent: 0.2 }
  },

  // ----- Iron Crypt -----
  skeleton: {
    name: "Skeleton", monster: "Skeleton", path: "Magic", type: "arcane",
    skill: "Bone Spear", skillText: "a spell for 3 turns of damage, past three quarters of the enemy's armor",
    use: function () { petSpell(3, 0.25); },
    passive: "Old Bones", passiveText: "once a run, rises from a killing blow on half health",
    bonus: { secondWind: 1 }
  },
  armoredGhoul: {
    name: "Armored Ghoul", monster: "Armored Ghoul", path: "Primal", type: "affliction",
    skill: "Rotting Claw", skillText: "1 turn of damage and 4 poison stacks",
    use: function () { petHit(1); petStacks(4); },
    passive: "Buried in Plate", passiveText: "double armor, and poison +30%",
    bonus: { armorPercent: 1, dotPower: 0.3 }
  },
  boneKnight: {
    name: "Bone Knight", monster: "Bone Knight", path: "Physical", type: "slashing",
    skill: "Grave Strike", skillText: "3 turns of damage, and it takes half damage for 2 turns",
    use: function () { petHit(3); petGuard(0.5, 2); },
    passive: "Armored Fury", passiveText: "the share of hits its armor blocks is added to its damage",
    bonus: { armorToDamage: 1 }
  },
  ironGolem: {
    name: "Iron Golem", monster: "Iron Golem", path: "Magic", type: "lightning", every: 4,
    skill: "Arc Discharge", skillText: "a lightning spell for 4.5 turns of damage; it takes 4 turns to come back",
    use: function () { petSpell(4.5); },
    passive: "Capacitor", passiveText: "+25% spell damage",
    bonus: { spellPower: 0.25 }
  },
  cryptGuardian: {
    name: "Crypt Guardian", monster: "Crypt Guardian", path: "Magic", type: "earth",
    skill: "Sealing Stone", skillText: "a spell for 3 turns of damage",
    use: function () { petSpell(3); },
    passive: "Warden of the Dead", passiveText: "+40% damage against bosses",
    bonus: { bossSlayer: 0.4 }
  },
  deathKnight: {
    name: "Death Knight", monster: "Death Knight", path: "Physical", type: "slashing",
    skill: "Death Strike", skillText: "2.5 turns of damage, healing half of it",
    use: function () { petDrain(2.5, 0.5); },
    passive: "Hits Back Hard", passiveText: "throws back 25% of every hit, and +15% attack",
    bonus: { brace: 0.25, attackPercent: 0.15 }
  },

  // ----- Storm Peak -----
  harpy: {
    name: "Harpy", monster: "Harpy", path: "Primal", type: "slashing",
    skill: "Snatch", skillText: "2.5 turns of damage and 2 bleed stacks",
    use: function () { petHit(2.5); petStacks(2); },
    passive: "Magpie", passiveText: "+20% gold (and so experience for your pet), and pets are caught 15% more often",
    bonus: { gold: 0.2, petCatch: 0.15 }
  },
  rockImp: {
    name: "Rock Imp", monster: "Rock Imp", path: "Magic", type: "earth",
    skill: "Boulder", skillText: "a spell for 2.5 turns of damage, and the enemy loses a turn",
    use: function () { petSpell(2.5); petStun(); },
    passive: "Stone Skin", passiveText: "after every spell a skin of stone turns aside the next hit",
    bonus: { spellDazzle: 1 }
  },
  frostWisp: {
    name: "Frost Wisp", monster: "Frost Wisp", path: "Magic", type: "ice",
    skill: "Frost Bolt", skillText: "a spell for 3 turns of damage, and the enemy hits 20% weaker for 3 turns",
    use: function () { petSpell(3); petGuard(0.2, 3); },
    passive: "Brittle", passiveText: "+40% spell damage, 30% less health",
    bonus: { spellPower: 0.4, healthPercent: -0.3 }
  },
  venomDrake: {
    name: "Venom Drake", monster: "Venom Drake", path: "Primal", type: "affliction",
    skill: "Toxic Breath", skillText: "1 turn of damage and 5 poison stacks",
    use: function () { petHit(1); petStacks(5); },
    passive: "Acid", passiveText: "its hits pass a fifth of the enemy's armor, and poison +10%",
    bonus: { penetration: 0.2, dotPower: 0.1 }
  },
  magmaHound: {
    name: "Magma Hound", monster: "Magma Hound", path: "Magic", type: "fire",
    skill: "Eruption", skillText: "a fire spell for 3 turns of damage",
    use: function () { petSpell(3); },
    passive: "Rising Heat", passiveText: "+0.15% damage for every kill this run (up to +100%)",
    bonus: { killStreak: 0.0015 }
  },
  stormGiant: {
    name: "Storm Giant", monster: "Storm Giant", path: "Physical", type: "crushing",
    skill: "Thunder Fist", skillText: "2.5 turns of damage, and the enemy loses a turn",
    use: function () { petHit(2.5); petStun(); },
    passive: "Huge and Angry", passiveText: "+40% health and +20% attack",
    bonus: { healthPercent: 0.4, attackPercent: 0.2 }
  },

  // ----- Haunted Abbey -----
  zombie: {
    name: "Zombie", monster: "Zombie", path: "Primal", type: "affliction",
    skill: "Infectious Bite", skillText: "1 turn of damage and 4 stacks of disease",
    use: function () { petHit(1); petStacks(4); },
    passive: "Lots of Health", passiveText: "double health",
    bonus: { healthPercent: 1 }
  },
  ghoul: {
    name: "Ghoul", monster: "Ghoul", path: "Primal", type: "affliction",
    skill: "Feast", skillText: "2 turns of damage, healing half of it",
    use: function () { petDrain(2, 0.5); },
    passive: "Ghoul Fever", passiveText: "heals for 5% of all the damage it deals",
    bonus: { leech: 0.05 }
  },
  restlessMonk: {
    name: "Restless Monk", monster: "Restless Monk", path: "Physical", type: "crushing",
    skill: "Palm Strike", skillText: "2.5 turns of damage",
    use: function () { petHit(2.5); },
    passive: "Vows", passiveText: "every third turn of a fight it strikes 60% harder",
    bonus: { thirdHit: 0.6 }
  },
  wraith: {
    name: "Wraith", monster: "Wraith", path: "Magic", type: "arcane",
    skill: "Soul Rend", skillText: "a spell for 4 turns of damage, for 10% of its own health",
    use: function () { petSacrifice(0.1); petSpell(4); },
    passive: "Barely Holds Together", passiveText: "below half health, its spells come back twice as fast",
    bonus: { lowHpHaste: 1 }
  },
  vampireThrall: {
    name: "Vampire Thrall", monster: "Vampire Thrall", path: "Primal", type: "slashing",
    skill: "Bite", skillText: "1.5 turns of damage and 3 bleed stacks, healing half of it",
    use: function () { petDrain(1.5, 0.5); petStacks(3); },
    passive: "Thirst", passiveText: "+8% damage for every 10% of its health that is missing",
    bonus: { bond: 0.08 }
  },
  banshee: {
    name: "Banshee", monster: "Banshee", path: "Magic", type: "arcane",
    skill: "Wail", skillText: "a spell for 3 turns of damage that ignores armor",
    use: function () { petSpell(3, 0); },
    passive: "Echoing Wail", passiveText: "every spell has a 15% chance to come straight back",
    bonus: { spellEcho: 0.15 }
  },
  // ----- Boss tames: a boss the bestiary knows (10 kills) can join a tamer that beats it -----
  // (see "Catching pets" in data.js: petBossCatch)
  orcWarlord: {
    name: "Orc Warlord", monster: "Orc Warlord", boss: true, path: "Physical", type: "slashing",
    skill: "War Cry", skillText: "1.5 turns of damage, and all its damage +60% for 4 turns",
    use: function () { petHit(1.5); petBoost(0.6, 4); },
    passive: "Warlord", passiveText: "+35% damage against bosses",
    bonus: { bossSlayer: 0.35 }
  },
  ogreChieftain: {
    name: "Ogre Chieftain", monster: "Ogre Chieftain", boss: true, path: "Magic", type: "earth",
    skill: "Earthquake", skillText: "an earth spell for 3 turns of damage, past most of the enemy's armor",
    use: function () { petSpell(3, 0.3); },
    passive: "Chieftain's Totem", passiveText: "+30% spell damage",
    bonus: { spellPower: 0.3 }
  },
  wargMother: {
    name: "Warg Mother", monster: "Warg Mother", boss: true, path: "Primal", type: "slashing",
    skill: "Call the Pack", skillText: "2 turns of damage and 6 bleed stacks",
    use: function () { petHit(2); petStacks(6); },
    passive: "Brood Rage", passiveText: "+6% damage for every turn of the fight",
    bonus: { rampTurn: 0.06 }
  },
  banditKing: {
    name: "Bandit King", monster: "Bandit King", boss: true, path: "Physical", type: "piercing",
    skill: "Call the Gang", skillText: "3 turns of damage",
    use: function () { petHit(3); },
    passive: "King's Cut", passiveText: "+30% gold (and so experience for your pet)",
    bonus: { gold: 0.3 }
  },
  twinBlades: {
    name: "The Twin Blades", monster: "The Twin Blades", boss: true, path: "Primal", type: "slashing",
    skill: "Twin Strike", skillText: "2 turns of damage and 6 bleed stacks",
    use: function () { petHit(2); petStacks(6); },
    passive: "Two Swords", passiveText: "+30% attack",
    bonus: { attackPercent: 0.3 }
  },
  warlordOfThePass: {
    name: "Warlord of the Pass", monster: "Warlord of the Pass", boss: true, path: "Magic", type: "earth",
    skill: "Landslide", skillText: "an earth spell for 3 turns of damage, and the enemy loses a turn",
    use: function () { petSpell(3); petStun(); },
    passive: "Hold the Pass", passiveText: "takes 20% of every hit for you, and +10% spell damage",
    bonus: { guard: 0.2, spellPower: 0.1 }
  },
  spiderQueen: {
    name: "Spider Queen", monster: "Spider Queen", boss: true, path: "Primal", type: "affliction",
    skill: "Brood", skillText: "1 turn of damage and 8 poison stacks",
    use: function () { petHit(1); petStacks(8); },
    passive: "Queen's Venom", passiveText: "poison +30%, and its hits pass a third of the enemy's armor",
    bonus: { dotPower: 0.3, penetration: 0.3 }
  },
  elderTreant: {
    name: "Elder Treant", monster: "Elder Treant", boss: true, path: "Magic", type: "earth",
    skill: "Ancient Ward", skillText: "it takes half damage for 2 turns, and a spell for 3 turns of damage",
    use: function () { petGuard(0.5, 2); petSpell(3); },
    passive: "Deep Roots", passiveText: "every spell heals it 5%, and +30% health",
    bonus: { spellHeal: 0.05, healthPercent: 0.3 }
  },
  trollKing: {
    name: "Troll King", monster: "Troll King", boss: true, path: "Physical", type: "crushing",
    skill: "Royal Smash", skillText: "3 turns of damage",
    use: function () { petHit(3); },
    passive: "Troll Blood", passiveText: "heals 3% a turn, throws back 15% of every hit, and +20% attack",
    bonus: { prayer: 0.03, brace: 0.15, attackPercent: 0.2 }
  },
  ratKing: {
    name: "Rat King", monster: "Rat King", boss: true, path: "Primal", type: "affliction",
    skill: "Swarm", skillText: "1 turn of damage and 6 poison stacks",
    use: function () { petHit(1); petStacks(6); },
    passive: "Plague Lord", passiveText: "poison +40%",
    bonus: { dotPower: 0.4 }
  },
  guildmaster: {
    name: "Guildmaster", monster: "Guildmaster", boss: true, path: "Magic", type: "arcane",
    skill: "Dirty Trick", skillText: "a hex for 3 turns of damage, and the enemy misses its next attack",
    use: function () { petSpell(3); petBlind(); },
    passive: "Fights Unfair", passiveText: "+60% damage on the first turn of a fight",
    bonus: { opener: 0.6 }
  },
  butcher: {
    name: "The Butcher", monster: "The Butcher", boss: true, path: "Physical", type: "slashing",
    skill: "Cleave", skillText: "3 turns of damage",
    use: function () { petHit(3); },
    passive: "Butcher's Hook", passiveText: "heals 5% after every kill, and +50% damage against an enemy below half health",
    bonus: { healOnKill: 0.05, finisher: 0.5 }
  },
  boneLich: {
    name: "Bone Lich", monster: "Bone Lich", boss: true, path: "Magic", type: "ice",
    skill: "Raise Dead", skillText: "a skeleton rises for a spell of 3 turns of damage",
    use: function () { petSpell(3); },
    passive: "Necromancy", passiveText: "+25% spell damage",
    bonus: { spellPower: 0.25 }
  },
  ironColossus: {
    name: "Iron Colossus", monster: "Iron Colossus", boss: true, path: "Physical", type: "crushing",
    skill: "Earthshaker", skillText: "2.5 turns of damage, and the enemy loses a turn",
    use: function () { petHit(2.5); petStun(); },
    passive: "Unstoppable", passiveText: "takes 30% of every hit for you",
    bonus: { guard: 0.3 }
  },
  entombedKing: {
    name: "The Entombed King", monster: "The Entombed King", boss: true, path: "Magic", type: "arcane",
    skill: "Royal Decree", skillText: "a spell for 2.5 turns of damage, and the enemy loses a turn",
    use: function () { petSpell(2.5); petStun(); },
    passive: "Undying", passiveText: "once a run, rises from a killing blow on half health, and +15% spell damage",
    bonus: { secondWind: 1, spellPower: 0.15 }
  },
  thunderbird: {
    name: "Thunderbird", monster: "Thunderbird", boss: true, path: "Magic", type: "lightning",
    skill: "Chain Lightning", skillText: "three bolts, a spell for 3 turns of damage in all",
    use: function () { petSpell(3); },
    passive: "Strikes Like Lightning", passiveText: "its first spell of every fight is ready at once",
    bonus: { loaded: 1 }
  },
  mountainHeart: {
    name: "Mountain Heart", monster: "Mountain Heart", boss: true, path: "Physical", type: "crushing",
    skill: "Avalanche", skillText: "3.5 turns of damage",
    use: function () { petHit(3.5); },
    passive: "Living Mountain", passiveText: "triple armor, and heals 2% a turn",
    bonus: { armorPercent: 2, prayer: 0.02 }
  },
  redDragon: {
    name: "Red Dragon", monster: "Red Dragon", boss: true, path: "Magic", type: "fire",
    skill: "Dragonfire", skillText: "a fire spell for 3 turns of damage, and 5 burning stacks",
    use: function () { petSpell(3); petStacks(5); },
    passive: "Dragon's Hoard", passiveText: "+20% damage against bosses, and +10% gold",
    bonus: { bossSlayer: 0.2, gold: 0.1 }
  },
  abbot: {
    name: "The Abbot", monster: "The Abbot", boss: true, path: "Magic", type: "holy",
    skill: "Sanctuary", skillText: "a holy spell for 2.5 turns of damage, then heals 20% of its health",
    use: function () { petSpell(2.5); petHeal(0.2); },
    passive: "Blessed", passiveText: "every spell heals it 8%, and +15% spell damage",
    bonus: { spellHeal: 0.08, spellPower: 0.15 }
  },
  vampireLord: {
    name: "Vampire Lord", monster: "Vampire Lord", boss: true, path: "Primal", type: "slashing",
    skill: "Blood Feast", skillText: "3 turns of damage, healing all of it",
    use: function () { petDrain(3, 1); },
    passive: "Lord of the Night", passiveText: "heals for 10% of all the damage it deals",
    bonus: { leech: 0.1 }
  },
  lichBishop: {
    name: "Lich Bishop", monster: "Lich Bishop", boss: true, path: "Magic", type: "arcane",
    skill: "Dark Mass", skillText: "servants rise for a spell of 3 turns of damage",
    use: function () { petSpell(3); },
    passive: "Unholy Choir", passiveText: "every spell has a 30% chance to come straight back",
    bonus: { spellEcho: 0.3 }
  },
  prideLord: {
    name: "Pride Lord", monster: "Pride Lord", boss: true, path: "Primal", type: "slashing",
    skill: "Call the Pride", skillText: "2 turns of damage and 6 bleed stacks",
    use: function () { petHit(2); petStacks(6); },
    passive: "Never Hunts Alone", passiveText: "bleeding +30%, and +15% attack",
    bonus: { dotPower: 0.3, attackPercent: 0.15 }
  },
  elderSerpent: {
    name: "Elder Serpent", monster: "Elder Serpent", boss: true, path: "Magic", type: "nature",
    skill: "Coil", skillText: "a binding spell for 1.5 turns of damage: the enemy loses a turn and takes 4 poison stacks",
    use: function () { petSpell(1.5); petStun(); petStacks(4); },
    passive: "Ancient Venom", passiveText: "poison +30%, and +10% spell damage",
    bonus: { dotPower: 0.3, spellPower: 0.1 }
  },
  mammothMatriarch: {
    name: "Mammoth Matriarch", monster: "Mammoth Matriarch", boss: true, path: "Physical", type: "crushing", every: 8,
    skill: "Stampede", skillText: "5 turns of damage; it takes 8 turns to come back",
    use: function () { petHit(5); },
    passive: "Slow to Anger", passiveText: "+12% damage for every 10% of its health that is missing",
    bonus: { bond: 0.12 }
  }
};

// What each path is: the starter whose perks, boons and relics it uses ("build"), the
// tamer stat that grows it, and the turns between two uses of its skill
const petPaths = {
  Physical: { build: "bear", stat: "Might", every: 6 },
  Primal: { build: "wolf", stat: "Instinct", every: 5 },
  Magic: { build: "hawk", stat: "Arcana", every: 3 }
};

// ----- The pieces a skill is made of -----
// "A turn of damage" is the pet's attack times its path's own multiplier ("bear", "wolf");
// for a spell it is spellTurn of it (classes/beasttamer.js), raised by Arcana.
// (petPower is set by tamerAttack every turn: the attack with Bond in it)
let petPower = 0;

function petHit(turns, armorShare) {
  let path = petPaths[petKit().path];
  petSkillHit(petPower * turns * multiplier(path.build), petKit().type, armorShare);
}

function petSpell(turns, armorShare) {
  petCastSpell(turns, armorShare === undefined ? 0.5 : armorShare);
}

function petStacks(count) {
  for (let i = 0; i < count; i++) {
    addDotStack(totalBonus(petStackWord()));
  }
}

function petStun() {
  monsterStunned = true;
}

function petStunChance(share) {
  if (chance(share)) {
    monsterStunned = true;
  }
}

function petBlind() {
  enemyDazzled = true;
}

function petBoost(amount, turns) {
  abilityBoost(amount, turns);
}

function petGuard(share, turns) {
  abilityGuard(share, turns);
}

function petHeal(share) {
  healPlayer(playerMaxHp * share);
}

// "turns" of damage, healing "share" of what it dealt
function petDrain(turns, share) {
  let before = monsterHp;
  petHit(turns);
  healPlayer(Math.max(0, before - Math.max(0, monsterHp)) * share);
}

// Heals "share" of its health if the monster has fallen
function petKillHeal(share) {
  if (monsterHp <= 0) {
    healPlayer(playerMaxHp * share);
  }
}

// Pays "share" of its own health (never its last point) for a stronger skill
function petSacrifice(share) {
  playerHp = Math.max(1, playerHp - Math.round(playerMaxHp * share));
}
