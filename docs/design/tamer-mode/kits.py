# One kit for every monster and boss in towers.js.
# (name, path, damage type, skill, skill text, skill key, passive, passive text, passive key, right pick, role)
# path: P = Physical (Might), M = Magic (Arcana), R = Primal (Instinct)
# The keys name the mechanic, so build.py can refuse two pets that play the same.
# role: clear, boss, deep, farm, burst, sustain, armor
KITS = [
    # Orc Stronghold (tier 1)
    ("Goblin", "M", "Fire", "Gold Hex", "A hex for 3 turns of spell damage; a monster it kills drops double gold.", "hexGold", "Lucky Hex", "+50% gold, and every spell has a 20% chance to come straight back.", "spellLuckyGold", "The first farmer, and the first magic pet.", "farm"),
    ("Orc Grunt", "P", "Crushing", "Headbutt", "2 turns of damage, and a 30% chance the enemy loses a turn.", "stunChance", "Thick Skull", "Takes 25% less damage from bosses.", "bossReduce", "A sturdy first catch that gets through early bosses.", "deep"),
    ("Warg", "R", "Slashing", "Frenzy", "Three bites, each harder than the last and each adding a bleed stack.", "multiBleed", "Glass Jaw", "+40% damage, 20% less health.", "glass", "Raw damage, when you can keep it alive.", "burst"),
    ("Orc Warrior", "P", "Crushing", "Shield Bash", "1.5 turns of damage, and the enemy's next hit is halved.", "blockNext", "Stubborn", "Once a fight, survives a killing blow with 1 health.", "cheatDeath", "Climbing safely while you are away.", "deep"),
    ("Orc Berserker", "R", "Slashing", "Bloodlust", "3 turns of damage and 3 bleed stacks, for 10% of its own health.", "sacrifice", "Berserk", "+2% damage for every 1% of its health that is missing.", "lowHpDamage", "Short, risky bursts against bosses.", "burst"),
    ("Ogre", "P", "Crushing", "Club Sweep", "2.5 turns of damage; what is left after a kill hits the next monster.", "overkill", "Mountain of Health", "+80% health, and heals 5% after every kill.", "healOnKill", "Long offline climbs through many rooms.", "sustain"),
    ("Orc Warlord", "P", "Slashing", "War Cry", "All its damage +60% for 4 turns.", "selfBuff", "Warlord", "+25% damage against bosses.", "bossDamage", "Boss tame: the first boss killer.", "boss"),
    ("Ogre Chieftain", "M", "Earth", "Earthquake", "A spell for 3 turns of damage that also shakes 20% off the enemy's armor for the fight.", "spellShred", "Chieftain's Totem", "Every spell plants a totem that hits for half a turn of damage every turn until its next spell.", "spellTotem", "Boss tame: a magic boss killer.", "boss"),
    ("Warg Mother", "R", "Slashing", "Call the Pack", "Two wargs fight beside her for 3 turns, every bite adding a bleed stack.", "summonBleed", "Brood Rage", "+10% damage for every turn of the fight.", "rampTurn", "Boss tame: long boss fights.", "boss"),
    # Raider's Pass (tier 2)
    ("Cutpurse", "R", "Piercing", "Quick Hands", "Two quick stabs, each stealing gold.", "multiGold", "Full Purse", "+25% gold, and catches come 10% more often.", "catch", "Farming, and hunting a kind of pet.", "farm"),
    ("Raider", "P", "Slashing", "Reckless Charge", "3 turns of damage, but it takes 10% more damage for 2 turns.", "reckless", "All Attack", "+50% damage, but its armor counts for nothing.", "noArmor", "Fast clearing of easy floors.", "burst"),
    ("Crossbowman", "M", "Lightning", "Rune Bolt", "A rune-carved bolt: 3 turns of spell damage through half the enemy's armor.", "pierceSpell", "Loaded", "Its first spell of every fight is ready at once and deals double.", "spellOpener", "Ending ordinary fights in one turn.", "clear"),
    ("Duelist", "R", "Piercing", "Riposte", "The next hit taken is avoided and answered with 2 turns of damage.", "counter", "Fast Hands", "+30% critical chance.", "crit", "Steady damage that never stalls.", "clear"),
    ("Raider Captain", "P", "Slashing", "Plunder", "2 turns of damage, and this kill pays double gold.", "killGold", "Hardest Hitter", "Critical hits deal +50% damage.", "critDamage", "Gold and damage in one pet.", "farm"),
    ("Pit Fighter", "P", "Crushing", "Crowd Pleaser", "2 turns of damage, and heals 10% if it kills.", "killHeal", "Grudge", "Every hit it takes adds +5% to its next attack.", "grudge", "Fights where it takes a beating, and the PvP arena.", "boss"),
    ("Bandit King", "P", "Piercing", "Call the Gang", "Three bandits strike for a turn of damage each.", "summonMulti", "King's Cut", "Every kill raises its gold by 1% for the run, up to +100%.", "goldRamp", "Boss tame: the best gold for long runs.", "farm"),
    ("The Twin Blades", "R", "Slashing", "Twin Strike", "Two cuts, each adding 3 bleed stacks.", "bleedBurst", "Two Swords", "Every hit lands twice, at 60% each.", "doubleHit", "Boss tame: the bleed build's best.", "boss"),
    ("Warlord of the Pass", "M", "Earth", "Landslide", "Brings the pass down: 3 turns of spell damage, and the enemy loses a turn.", "spellStun", "Hold the Pass", "While a spell is getting ready, it takes 30% less damage.", "spellWaitGuard", "Boss tame: the deepest early magic floors.", "deep"),
    # Wildwood (tier 3)
    ("Wild Boar", "P", "Crushing", "Charge", "Opens every fight with 4 turns of damage.", "openerSkill", "Head Down", "Its first hit of a fight goes through all armor.", "openerPierce", "Clearing ordinary rooms fast.", "clear"),
    ("Giant Spider", "R", "Affliction", "Web", "The enemy loses its next turn, and takes 3 poison stacks.", "stunPoison", "Venomous", "30% of its damage ignores armor; poison stacks +15%.", "pierceShare", "Armored monsters, early on.", "armor"),
    ("Dire Wolf", "R", "Slashing", "Rend", "2 turns of damage and 4 bleed stacks.", "bleedNuke", "Pack Hunter", "+1% damage for every kill this run, up to +50%.", "rampKill", "Long runs that never fall.", "clear"),
    ("Treant", "M", "Nature", "Entangle", "Roots the enemy for 2 turns, while thorns deal 1.5 turns of spell damage each turn.", "rootDot", "Photosynthesis", "Every spell heals it 8% of its health.", "spellHeal", "A safe magic pet for offline climbing.", "sustain"),
    ("Forest Troll", "M", "Nature", "Thornlash", "3 turns of spell damage.", "nuke", "Regrowth", "Heals 4% a turn; while above 80% health its spells come back 25% faster.", "regenCdr", "Magic damage that never runs out of health.", "sustain"),
    ("Dire Bear", "P", "Crushing", "Maul", "2.5 turns of damage, and the enemy loses a turn.", "stunNuke", "Huge", "+60% health, and a tenth of its health added to its hits, never more than its attack.", "healthToDamage", "Deep floors where the monster's hits are the danger.", "deep"),
    ("Spider Queen", "R", "Affliction", "Brood", "Spiderlings add 2 poison stacks every turn for 4 turns.", "summonDot", "Queen's Venom", "Her poison lasts twice as long, and 40% of her damage ignores armor.", "dotDuration", "Boss tame: poison against bosses.", "boss"),
    ("Elder Treant", "M", "Earth", "Ancient Ward", "A shield of 25% of its health, then 3 turns of spell damage.", "shieldNuke", "Deep Roots", "Every spell grows its shield by 5% of its health.", "spellShield", "Boss tame: the deepest magic floors of its tier.", "deep"),
    ("Troll King", "P", "Crushing", "Royal Smash", "3 turns of damage, doubled while he is at full health.", "fullHpBonus", "Troll Blood", "Heals 3% a turn, and throws back 15% of every hit.", "regenThorns", "Boss tame: never stops healing.", "sustain"),
    # The Undercity (tier 4)
    ("Sewer Rat", "R", "Affliction", "Gnaw", "3 stacks of disease (poison).", "dotApply", "Everyone Starts Somewhere", "Earns experience 50% faster.", "xpGain", "Raising quickly, and leveling a new pet beside it.", "farm"),
    ("Thug", "P", "Crushing", "Sucker Punch", "Strikes before the enemy, for 2 turns of damage.", "firstStrike", "Swings First", "+60% damage on the first turn of every fight.", "openerDamage", "Short fights on easy floors.", "clear"),
    ("Smuggler", "M", "Fire", "Firebomb", "Alchemist's fire: 2 turns of spell damage now, and burning worth another turn over the next 3.", "spellBurn", "Black Market", "A spell that kills pays double Essence.", "spellKillEssence", "Farming Essence with a magic pet.", "farm"),
    ("Watchman", "P", "Piercing", "Halberd Thrust", "2 turns of damage that ignore armor.", "pierceSkill", "Real Armor", "Double armor.", "armorMult", "A safe physical pet against armored towers.", "armor"),
    ("Plague Bearer", "R", "Affliction", "Plague", "4 poison stacks, and the enemy heals 50% less.", "dotNoHeal", "Contagion", "When a monster dies, its poison moves to the next one in full.", "dotCarry", "Climbs of many rooms: the poison never runs out.", "clear"),
    ("Enforcer", "P", "Crushing", "Break Legs", "2 turns of damage, and the enemy hits 30% weaker for 3 turns.", "weaken", "The Guild's Muscle", "+30% damage and +30% health.", "flatAll", "An all-rounder for any tower.", "deep"),
    ("Rat King", "R", "Affliction", "Swarm", "Rats add a poison stack every turn for the rest of the fight.", "dotForever", "Plague Lord", "+5% damage for every poison stack on the enemy.", "stackScaling", "Boss tame: the longer the fight, the stronger.", "boss"),
    ("Guildmaster", "M", "Arcane", "Dirty Trick", "A hex for 3 turns of spell damage, and the enemy misses its next attack.", "spellBlind", "Fights Unfair", "Every spell on the first two turns of a fight is a critical hit.", "spellCritOpen", "Boss tame: burst before the boss moves.", "burst"),
    ("The Butcher", "P", "Slashing", "Cleave", "3 turns of damage, doubled against an enemy below 30% health.", "execute", "Butcher's Hook", "Every kill heals 10% and adds +10% damage to the next fight.", "killChain", "Boss tame: finishing fights before the clock.", "clear"),
    # Iron Crypt (tier 5)
    ("Skeleton", "M", "Arcane", "Bone Spear", "3 turns of spell damage, and the enemy loses 20% of its armor for the fight.", "spellShred", "Old Bones", "Rises once a fight with 20% health, and its spell is ready at once.", "reviveSpell", "A hard-to-kill magic pet for deep floors.", "deep"),
    ("Armored Ghoul", "R", "Affliction", "Rotting Claw", "3 poison stacks, and the enemy loses 10% of its armor.", "dotShred", "Buried in Plate", "+150% armor, and its poison stacks deal 10% more.", "armorMult", "A poisoner that survives deep floors.", "deep"),
    ("Bone Knight", "P", "Slashing", "Grave Strike", "3 turns of damage, and its armor doubles for 2 turns.", "selfArmorBuff", "Armored Fury", "The share of hits its armor blocks is added to its damage.", "armorToDamage", "Deep floors, where armor turns into damage.", "deep"),
    ("Iron Golem", "M", "Lightning", "Arc Discharge", "4 turns of lightning spell damage; it takes 4 turns to come back.", "bigSpell", "Capacitor", "Every turn it waits, its next spell grows 10%, and what it has stored is kept between fights.", "spellCharge", "The biggest single spells, for bosses.", "boss"),
    ("Crypt Guardian", "M", "Earth", "Sealing Stone", "3 turns of spell damage, and the enemy cannot heal or shield for 4 turns.", "seal", "Warden of the Dead", "Its spells deal +50% to an enemy that heals or shields.", "spellVsHealers", "Trolls, vampires and every boss that heals.", "boss"),
    ("Death Knight", "P", "Slashing", "Death Strike", "2.5 turns of damage, healing half of it.", "drain", "Hits Back Hard", "Throws back 25% of every hit.", "thorns", "Physical sustain on deep floors.", "sustain"),
    ("Bone Lich", "M", "Ice", "Raise Dead", "A skeleton fights beside it for 4 turns, each hit worth three quarters of a turn.", "summon", "Necromancy", "Every monster it kills with a spell adds +5% spell damage for the run, up to +50%.", "spellKillRamp", "Boss tame: the safest deep magic pet.", "deep"),
    ("Iron Colossus", "P", "Crushing", "Earthshaker", "2 turns of damage, and the enemy cannot armor up or shield for 4 turns.", "breakGuard", "Unstoppable", "Never loses a turn, and takes 40% less damage.", "dmgReduce", "Boss tame: the wall of the game.", "deep"),
    ("The Entombed King", "M", "Arcane", "Royal Decree", "2 turns of spell damage, and the enemy loses 2 turns.", "stun2", "Undying", "Starts every fight behind a shield of 20% of its health; while shielded, its spells come back twice as fast.", "spellShieldCdr", "Boss tame: bosses that hit too hard.", "sustain"),
    # Storm Peak (tier 6)
    ("Harpy", "R", "Slashing", "Snatch", "A dive with a 50% critical chance that steals gold.", "critGold", "Magpie", "+40% gold, and catches come 15% more often.", "catch", "The farmer of the deeper towers.", "farm"),
    ("Rock Imp", "M", "Earth", "Boulder", "2.5 turns of spell damage, and the enemy loses a turn.", "spellStun", "Stone Skin", "Every spell gives it a skin of stone that blocks the next hit.", "spellBlock", "A steady magic pet.", "deep"),
    ("Frost Wisp", "M", "Ice", "Frost Bolt", "3 turns of spell damage, and the enemy hits 20% weaker for 3 turns.", "spellWeaken", "Brittle", "+60% spell damage, 30% less health.", "glassSpell", "The magic glass cannon.", "burst"),
    ("Venom Drake", "R", "Affliction", "Toxic Breath", "Poison that keeps burning for 3 turns.", "dotLinger", "Acid", "Every poison stack also strips 5% of the enemy's armor.", "stackShred", "Armored towers: the Iron Crypt and Storm Peak.", "armor"),
    ("Magma Hound", "M", "Fire", "Eruption", "3 turns of spell damage.", "nuke", "Rising Heat", "Every spell this run leaves its spells 4% hotter, up to +80%; the heat only fades when it falls.", "spellRampRun", "Bosses, whose fights last long enough for the heat to build.", "boss"),
    ("Storm Giant", "P", "Crushing", "Thunder Fist", "3 turns of damage, and the enemy loses a turn.", "stunNuke", "Huge and Angry", "+50% health and +25% damage.", "flatAll", "An all-rounder physical pet.", "deep"),
    ("Thunderbird", "M", "Lightning", "Chain Lightning", "Three bolts of 1.2 turns of spell damage; a kill passes the rest to the next monster.", "chainSpell", "Strikes Like Lightning", "Always acts first, and its first spell of a fight is ready at once.", "spellOpener", "Boss tame: ends ordinary fights at once.", "clear"),
    ("Mountain Heart", "P", "Crushing", "Avalanche", "2 turns of damage now, and 3 more on the next turn; if the monster has fallen, the rest lands on the next one.", "delayedNuke", "Living Mountain", "Triple armor, and heals 2% a turn.", "armorRegen", "Boss tame: offline climbing that never falls.", "sustain"),
    ("Red Dragon", "M", "Fire", "Dragonfire", "3 turns of spell damage, and 5 burning stacks.", "spellBurn", "Dragon's Hoard", "Its spells deal +30% to bosses, and +50% gold.", "spellBossGold", "Boss tame: the strongest magic boss killer.", "boss"),
    # Haunted Abbey (tier 7)
    ("Zombie", "R", "Affliction", "Infectious Bite", "3 disease stacks; a monster that dies infected rises to fight for it for 2 turns.", "infectSummon", "Lots of Health", "Double health.", "healthMult", "A slow poisoner that lasts on deep floors.", "deep"),
    ("Ghoul", "R", "Affliction", "Feast", "2 turns of damage, healing half of it.", "drain", "Ghoul Fever", "Every poison stack on the enemy heals it 1% a turn.", "stackHeal", "Sustain for poison builds.", "sustain"),
    ("Restless Monk", "P", "Crushing", "Palm Strike", "2.5 turns of damage, doubled against the undead.", "vsUndead", "Vows", "Every third hit is a flurry of three.", "thirdHit", "The undead towers: the Iron Crypt and the Haunted Abbey.", "clear"),
    ("Wraith", "M", "Arcane", "Soul Rend", "4 turns of spell damage, for 15% of its own health.", "sacrificeSpell", "Barely Holds Together", "Below half health, its spells come back twice as fast.", "spellCdrLowHp", "Burst against armored bosses.", "burst"),
    ("Vampire Thrall", "R", "Slashing", "Bite", "1.5 turns of damage and 3 bleed stacks; it heals from every bleed tick.", "bleedHeal", "Thirst", "+3% damage for every 10% of its health it has healed this fight.", "healToDamage", "Long fights that need healing.", "sustain"),
    ("Banshee", "M", "Arcane", "Wail", "3 turns of spell damage that ignore armor and ward.", "pierceSpell", "Echoing Wail", "Every spell echoes for half again on the next turn.", "spellEcho", "Armored towers: skeletons and knights.", "armor"),
    ("The Abbot", "M", "Holy", "Sanctuary", "1.5 turns of holy spell damage, then heals 30% of its health and shields it for 2 turns.", "heal", "Blessed", "Every holy spell heals it 10%, and deals +50% to the undead.", "spellHealUndead", "Boss tame: holds the deepest undead floors.", "sustain"),
    ("Vampire Lord", "R", "Slashing", "Blood Feast", "3 turns of damage, healing all of it.", "drainFull", "Lord of the Night", "Heals for 10% of all the damage it deals.", "lifesteal", "Boss tame: damage and healing in one.", "sustain"),
    ("Lich Bishop", "M", "Arcane", "Dark Mass", "Two undead servants fight beside him for 3 turns, each hit worth half a turn.", "summon", "Unholy Choir", "Every servant standing makes his spells come back 25% faster.", "summonCdr", "Boss tame: the summoner.", "boss"),
    # The Wild Reaches (tier 8)
    ("Hyena", "M", "Arcane", "Cackling Curse", "1.5 turns of spell damage; the enemy misses its next attack and takes 30% more damage for 3 turns.", "curseMark", "Scavenger", "Spells against an enemy below half health are always critical.", "spellExecuteCrit", "Finishing fights before the clock runs out.", "clear"),
    ("Tusker", "R", "Piercing", "Gore", "2 turns of damage and 3 bleed stacks.", "bleedNuke", "A Lot of Animal", "+40% health, and +50% damage on the first hit of a fight.", "openerHealth", "A primal pet that lasts.", "clear"),
    ("Viper", "R", "Affliction", "Venom Strike", "Four stacks of poison at once.", "dotApply", "Potent", "Every stack of poison deals 25% more.", "stackPower", "Tough single monsters and bosses.", "boss"),
    ("Sabrecat", "R", "Slashing", "Pounce", "Strikes before the enemy, for 3 turns of damage with a high critical chance.", "firstStrikeCrit", "All Claws", "Every critical hit adds 2 bleed stacks.", "critBleed", "The critical-hit build.", "burst"),
    ("Rhino", "P", "Crushing", "Trample", "3 turns of damage that ignore armor.", "pierceSkill", "Plate Hide", "Double armor, and +30% damage against armored enemies.", "vsArmored", "The physical answer to armored towers.", "armor"),
    ("Great Ape", "P", "Crushing", "Chest Beat", "All its damage +50% for 3 turns.", "selfBuff", "Rampage", "+10% damage for every turn of the fight.", "rampTurn", "Long boss fights for physical builds.", "boss"),
    ("Pride Lord", "R", "Slashing", "Call the Pride", "Two lions strike, each adding 3 bleed stacks.", "summonBleed", "Never Hunts Alone", "+20% damage for each bleed stack on the enemy, up to five.", "stackScaling", "Boss tame: the bleed lord.", "boss"),
    ("Elder Serpent", "M", "Nature", "Coil", "A binding spell: 1 turn of spell damage, the enemy loses 2 turns, and takes 3 poison stacks.", "stun2", "Ancient Venom", "Every spell also adds 3 poison stacks, and its poison deals 30% more.", "spellPoison", "Boss tame: magic that poisons.", "boss"),
    ("Mammoth Matriarch", "P", "Crushing", "Stampede", "5 turns of damage, on a long cooldown.", "bigNuke", "Slow to Anger", "+80% damage while below half health.", "lowHpDamage", "Boss tame: the comeback.", "deep"),
]

# Every spell's worth, in turns of damage, against the turns it takes to come back
# (cooldown, worth, how the worth is counted). A lost enemy turn counts half a turn,
# a heal of 30% a turn and a half, a summon its hits. build.py refuses a spell worth
# less than its cooldown: a spell that waits longer must pay more.
SPELLS = {
    "Goblin": (3, 3, "3 turns"),
    "Ogre Chieftain": (3, 3.5, "3 turns, and the totem's half turns between spells"),
    "Crossbowman": (3, 3, "3 turns"),
    "Warlord of the Pass": (3, 3.5, "3 turns, and a lost turn"),
    "Treant": (3, 4, "1.5 turns twice, and a lost turn twice"),
    "Forest Troll": (3, 3, "3 turns"),
    "Elder Treant": (3, 3.5, "3 turns, and a shield"),
    "Smuggler": (3, 3, "2 turns, and a turn of burning"),
    "Guildmaster": (3, 3.5, "3 turns, and a missed attack"),
    "Skeleton": (3, 3, "3 turns, and armor lost"),
    "Iron Golem": (4, 4, "4 turns, growing while it waits"),
    "Crypt Guardian": (3, 3, "3 turns, and no healing"),
    "Bone Lich": (3, 3, "four hits of three quarters"),
    "The Entombed King": (3, 3, "2 turns, and two lost turns"),
    "Rock Imp": (3, 3, "2.5 turns, and a lost turn"),
    "Frost Wisp": (3, 3, "3 turns, and weaker hits"),
    "Magma Hound": (3, 3, "3 turns"),
    "Thunderbird": (3, 3.6, "three bolts of 1.2"),
    "Red Dragon": (3, 4, "3 turns, and 5 burning stacks"),
    "Wraith": (3, 4, "4 turns, for its own health"),
    "Banshee": (3, 3, "3 turns, then an echo"),
    "The Abbot": (3, 3, "1.5 turns, and a heal of 30%"),
    "Lich Bishop": (3, 3, "six hits of half a turn"),
    "Hyena": (3, 3, "1.5 turns, a missed attack, and 30% more damage taken for 3 turns"),
    "Elder Serpent": (3, 3, "1 turn, two lost turns, and 3 poison stacks"),
}

# The towers in badge order: a pet's tier. A boss is half a tier above its tower.
TIERS = ["Orc Stronghold", "Raider's Pass", "Wildwood", "The Undercity", "Iron Crypt", "Storm Peak", "Haunted Abbey", "The Wild Reaches"]
TIER_STEP = 1.5
