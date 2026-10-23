# Every bonus word: who gives it, and where it is read

Written by `python tools/map.py`. Do not edit by hand: change the content and run it
again. [MAP.md](MAP.md) explains how these fit together.

## Read this first

**Given but read nowhere (these do nothing):** none.

**Read but given by nothing (a rule nobody can reach):** none.

"No top level" names the sources that can be bought again and again (a skill, a boon,
an endless fame or town upgrade). A word with such a source grows for as long as the
player plays. That is fine for a word that is ADDED to a percentage, and it is how the
game is meant to scale. It is where to look first when something runs away: the word
must either be capped where it is read (see "added, capped" and "overflow"), or feed
something that is not multiplied again by another endless word.

## The words

`+` is added (bonus), `x` is multiplied (multiply). The number is how many things give it.

| Word | Given by | No top level | Read at |
|---|---|---|---|
| `abilitySlots` | + legend (1) | no | added: game/abilities.js:132 |
| `aimChance` | + base (1), + boon (1), + perk (3), + relic (1) | boon | added: classes/ranger.js:284, classes/ranger.js:340; overflow: classes/ranger.js:290, classes/ranger.js:340 |
| `aimPower` | + boon (1), + perk (2), + relic (1), + skill (1) | boon, skill | added: classes/ranger.js:290, classes/ranger.js:340 |
| `alpha` | + perk (1) | no | added: classes/beasttamer.js:430, classes/beasttamer.js:508 |
| `alwaysRage` | + perk (1) | no | added: classes/barbarian.js:249 |
| `ambush` | + base (1), + boon (1), + perk (2), + relic (1), + skill (1), x breakthrough (1), x perk (3) | boon, skill | added: classes/assassin.js:273; multiplied: classes/assassin.js:273 |
| `ambushed` | + tower rule (1), + week (1) | no | added: game/fights.js:151 |
| `arcaneCrit` | x breakthrough (1), x perk (2), x relic (1) | no | multiplied: classes/warlock.js:258 |
| `armor` | + base (2), + boon (2), + perk (7), + skill (1), + trophy (6), x breakthrough (1), x fame (1), x legend (2), x perk (22) | boon, fame, legend, skill | added: game/bonuses.js:554; multiplied: game/bonuses.js:554, classes/warden.js:222, classes/warden.js:232 and 1 more |
| `armorLimit` | + perk (1), + relic (2), + skill (1), + trophy (1) | skill | added: game/bonuses.js:549 |
| `armorPercent` | + base (5), + skill (1) | skill | added: game/bonuses.js:554 |
| `armorToDamage` | + base (1) | no | added: classes/beasttamer.js:407 |
| `arrowPower` | + skill (1) | skill | added: classes/ranger.js:306, classes/ranger.js:343 |
| `attack` | + base (8), x breakthrough (3), x perk (102), x trophy (8) | no | added: game/skills.js:314; multiplied: game/skills.js:318, classes/warden.js:232; recalcStats (game/skills.js): flat attack |
| `attackPercent` | + base (11), + boon (8), + perk (8), + relic (1), + skill (17) | boon, skill | added: game/skills.js:318 |
| `awayHours` | + town (1) | no | added: game/page-show.js:1334, game/start.js:16 |
| `bear` | x breakthrough (1), x perk (3), x relic (1) | no | multiplied: classes/beasttamer.js:445 |
| `bitePower` | + boon (1), + perk (1), + skill (1) | boon, skill | added: classes/beasttamer.js:428, classes/beasttamer.js:509, classes/beasttamer.js:511 |
| `bleed` | x breakthrough (1), x perk (2), x relic (1) | no | multiplied: classes/barbarian.js:327 |
| `bleedCarry` | + perk (1) | no | added: classes/barbarian.js:236, classes/barbarian.js:237, classes/barbarian.js:290 |
| `bleedStacks` | + base (2), + boon (1), + perk (2), + relic (1) | boon | added: classes/barbarian.js:176, classes/barbarian.js:237, classes/barbarian.js:285 and 4 more |
| `blindingDive` | + perk (1) | no | added: classes/beasttamer.js:387 |
| `blockChance` | + base (2), + boon (2), + perk (6), + relic (2), + skill (2) | boon, skill | added, capped: classes/warden.js:280, classes/warden.js:327, classes/warden.js:337 and 2 more; overflow: classes/warden.js:306, classes/warden.js:338, classes/zealot.js:326 and 1 more |
| `bodkin` | + boon (1), + relic (1), + skill (1) | boon, skill | added: classes/ranger.js:227, classes/ranger.js:344 |
| `bodyguard` | + perk (1) | no | added: classes/beasttamer.js:328 |
| `bolt` | x breakthrough (1), x perk (2), x relic (1) | no | multiplied: classes/elementalist.js:280 |
| `boltPierce` | + base (1), + boon (1), + perk (2), + relic (1), + skill (1) | boon, skill | added: classes/ranger.js:219, classes/ranger.js:347, classes/ranger.js:347 |
| `boltPower` | + boon (1), + perk (3), + relic (1), + skill (2) | boon, skill | added: classes/elementalist.js:280, classes/elementalist.js:328, classes/ranger.js:313 and 1 more |
| `bond` | + base (4), + boon (1), + perk (3), + relic (1), + skill (1), x breakthrough (1), x perk (2) | boon, skill | added: classes/beasttamer.js:301, classes/beasttamer.js:497; multiplied: classes/beasttamer.js:301, classes/beasttamer.js:497 |
| `bossGuard` | + base (1) | no | added: classes/beasttamer.js:484 |
| `bossSlayer` | + base (4), + perk (7), + relic (6), + trophy (1) | no | added: game/abilities.js:370 |
| `boulder` | x breakthrough (1), x perk (2), x relic (1) | no | multiplied: classes/elementalist.js:292, classes/elementalist.js:300 |
| `brace` | + base (4), + relic (4), + trophy (1) | no | added: game/fights.js:542, game/fights.js:543 |
| `burn` | x breakthrough (1), x perk (2), x relic (1) | no | multiplied: classes/elementalist.js:316 |
| `burnCarry` | + perk (1) | no | added: classes/elementalist.js:234, classes/elementalist.js:235, classes/elementalist.js:245 |
| `burnStacks` | + base (1), + boon (1), + perk (2), + relic (1) | boon | added: classes/elementalist.js:177, classes/elementalist.js:235, classes/elementalist.js:250 and 2 more |
| `care` | + skill (1) | skill | added: classes/beasttamer.js:309, classes/beasttamer.js:496, classes/beasttamer.js:496 |
| `club` | x breakthrough (1), x perk (2), x relic (1) | no | multiplied: classes/barbarian.js:268 |
| `clubPower` | + perk (1), + skill (1) | skill | added: classes/barbarian.js:268, classes/barbarian.js:344 |
| `counter` | + base (2), + boon (1), + perk (4), + relic (1), + skill (2), x breakthrough (1), x perk (2), x relic (1) | boon, skill | added: classes/assassin.js:244, classes/assassin.js:329, classes/zealot.js:335 and 2 more; multiplied: classes/assassin.js:244, classes/assassin.js:329 |
| `coupDeGrace` | + perk (1) | no | added: classes/assassin.js:234, classes/assassin.js:234 |
| `critChance` | + base (5), + boon (5), + perk (12), + relic (5), + skill (5) | boon, skill | added: classes/assassin.js:229, classes/assassin.js:327, classes/barbarian.js:261 and 7 more; overflow: classes/assassin.js:231, classes/assassin.js:327, classes/barbarian.js:262 and 7 more |
| `critPower` | + base (1), + perk (6), + skill (4) | skill | added: classes/assassin.js:231, classes/assassin.js:327, classes/barbarian.js:262 and 7 more |
| `crossbow` | x breakthrough (1), x perk (2), x relic (1) | no | multiplied: classes/ranger.js:313 |
| `crusade` | + base (1), + boon (1), + perk (2), + relic (1), + skill (1), x breakthrough (1), x perk (2) | boon, skill | added: classes/zealot.js:252, classes/zealot.js:352; multiplied: classes/zealot.js:252 |
| `crusadeCarry` | + perk (1) | no | added: classes/zealot.js:221 |
| `crush` | + perk (1), + skill (1) | skill | added: classes/elementalist.js:292, classes/elementalist.js:300, classes/elementalist.js:330 |
| `damage` | x fame (1), x legend (2), x perk (3) | fame, legend | multiplied: game/state.js:336, game/state.js:345, game/state.js:354 and 1 more; every hit (hitMonster, spellHitMonster, magicHitMonster in game/state.js) |
| `damageTaken` | x breakthrough (1), x perk (10), x week (2) | no | multiplied: game/bosses.js:158, game/fights.js:537, game/page-show.js:1115 |
| `devotion` | + base (1), + boon (1), + perk (6), + relic (1) | boon | added: classes/zealot.js:233 |
| `dodge` | + base (1), + boon (1), + perk (9), + relic (1), + skill (1) | boon, skill | added: classes/assassin.js:278, classes/assassin.js:285; added, capped: classes/assassin.js:280 |
| `dotPower` | + base (8), + perk (3), + skill (4) | skill | added: game/state.js:385, classes/elementalist.js:322 |
| `drain` | + tower rule (1) | no | added: game/fights.js:579, game/fights.js:580 |
| `echo` | x breakthrough (1), x perk (2), x relic (1) | no | multiplied: classes/warlock.js:309 |
| `echoChance` | + base (1), + boon (1), + perk (4), + relic (1), + skill (1) | boon, skill | added: classes/warlock.js:301, classes/warlock.js:302, classes/warlock.js:335 |
| `echoPower` | + perk (1), + skill (1) | skill | added: classes/warlock.js:309, classes/warlock.js:335 |
| `enrageAll` | + tower rule (1), + week (1) | no | added: game/fights.js:194 |
| `essenceGain` | + base (1) | no | added: game/equipment.js:190 |
| `eventHorizon` | + perk (1) | no | added: classes/warlock.js:283 |
| `experience` | + base (1), + perk (8), + town (1), + trophy (3), x breakthrough (1), x fame (1), x legend (2), x perk (1), x week (2) | fame, legend, town | added: game/fights.js:103; multiplied: game/fights.js:103 |
| `exploit` | + base (1), + perk (1), + relic (3), + trophy (2) | no | added: game/state.js:299 |
| `extraBolts` | + boon (1), + perk (2), + relic (1), + skill (1) | boon, skill | added: classes/elementalist.js:273, classes/elementalist.js:274, classes/elementalist.js:328 |
| `extraBoons` | + legend (1) | no | added: game/fights.js:385, game/fights.js:477 |
| `fame` | x breakthrough (1), x week (1) | no | multiplied: game/bonuses.js:243, game/fights.js:278 |
| `favouriteUpgrade` | + town (1) | no | added: game/equipment.js:660, game/page-show.js:397 |
| `finisher` | + base (2), + perk (1), + relic (7), + trophy (2) | no | added: game/abilities.js:376 |
| `firstStrike` | + base (1), + perk (4) | no | added: classes/ranger.js:243, classes/ranger.js:332; overflow: classes/ranger.js:265, classes/ranger.js:333 |
| `flyOn` | + perk (1) | no | added: classes/ranger.js:316 |
| `freePotions` | + legend (1) | no | added: game/bonuses.js:476, game/fights.js:390 |
| `gear` | x fame (1), x legend (1), x perk (8) | fame, legend | multiplied: game/equipment.js:77 |
| `gold` | + base (6), + town (1), + trophy (3), x fame (1), x legend (2), x perk (8), x trophy (1), x week (2) | fame, legend, town | added: game/fights.js:445, game/fights.js:721; multiplied: game/fights.js:445, game/fights.js:721 |
| `guard` | + base (3), + perk (1) | no | added: classes/beasttamer.js:328 |
| `hawkCrit` | x breakthrough (1), x perk (3), x relic (1) | no | multiplied: classes/beasttamer.js:383 |
| `headStart` | + relic (2), + trophy (1) | no | added: game/fights.js:607 |
| `healOnKill` | + base (2) | no | added: game/fights.js:456, game/fights.js:456 |
| `health` | x breakthrough (2), x fame (1), x legend (2), x perk (57), x relic (25), x trophy (10) | fame, legend | multiplied: game/skills.js:317 |
| `healthPercent` | + base (8), + boon (4), + perk (1), + skill (7) | boon, skill | added: game/skills.js:317 |
| `heavyShot` | + skill (1) | skill | added: classes/ranger.js:281, classes/ranger.js:339 |
| `hunted` | + tower rule (1) | no | added: game/fights.js:590, game/fights.js:591 |
| `huntersMark` | + skill (1) | skill | added: classes/ranger.js:271, classes/ranger.js:334 |
| `iceCrit` | x breakthrough (1), x perk (3), x relic (1) | no | multiplied: classes/elementalist.js:259 |
| `iceFreeze` | + perk (1) | no | added: classes/elementalist.js:263 |
| `instantVengeance` | + perk (1) | no | added: classes/warden.js:295 |
| `judgement` | + base (1), + perk (2), + skill (1) | skill | added: classes/zealot.js:313, classes/zealot.js:357 |
| `killStreak` | + base (2), + perk (3), + relic (5), + trophy (1) | no | added: game/abilities.js:365 |
| `landslide` | + perk (1) | no | added: classes/elementalist.js:295, classes/elementalist.js:299, classes/elementalist.js:300 |
| `leech` | + base (2), + perk (1), + relic (4), + trophy (2) | no | added: game/fights.js:663, game/fights.js:665 |
| `lifesteal` | + base (1), + boon (1), + perk (3), + relic (1), + skill (1) | boon, skill | added: classes/barbarian.js:282, classes/barbarian.js:291, classes/barbarian.js:332 |
| `loaded` | + base (2) | no | added: classes/beasttamer.js:338 |
| `longbowCrit` | x breakthrough (1), x perk (2), x relic (1) | no | multiplied: classes/ranger.js:290 |
| `lostOpening` | + tower rule (1) | no | added: game/fights.js:594 |
| `lowHpHaste` | + base (1) | no | added: classes/beasttamer.js:418 |
| `mace` | x breakthrough (1), x perk (2), x relic (1) | no | multiplied: classes/zealot.js:313, classes/zealot.js:319 |
| `maim` | + perk (1) | no | added: classes/warden.js:273, classes/warden.js:274 |
| `martyrsFlame` | + perk (1) | no | added: classes/zealot.js:293, classes/zealot.js:294 |
| `maulPower` | + boon (1), + perk (1), + skill (1) | boon, skill | added: classes/beasttamer.js:445, classes/beasttamer.js:514 |
| `maxHp` | + base (8) | no | added: game/skills.js:313; recalcStats (game/skills.js): flat health |
| `momentum` | + perk (2) | no | added: game/abilities.js:366 |
| `neurotoxin` | + perk (1) | no | added: classes/assassin.js:292, classes/assassin.js:293 |
| `noKillHeal` | + perk (3), + tower rule (1) | no | added: game/fights.js:454 |
| `noPotions` | + tower rule (1), + week (1) | no | added: game/fights.js:548 |
| `opener` | + base (5), + relic (5), + trophy (1), + week (1) | no | added: game/abilities.js:373 |
| `overchannel` | + perk (1) | no | added: classes/warlock.js:254 |
| `overcharge` | + perk (1) | no | added: classes/elementalist.js:280 |
| `packSize` | + perk (2), + relic (1) | no | added: classes/beasttamer.js:323 |
| `packTactics` | + base (1) | no | added: classes/beasttamer.js:436, classes/beasttamer.js:511 |
| `parryChance` | + base (1), + boon (1), + perk (2), + relic (1), + skill (1) | boon, skill | added, capped: classes/barbarian.js:307, classes/barbarian.js:341; overflow: classes/barbarian.js:320, classes/barbarian.js:342 |
| `penetration` | + base (3), + town (1) | town | added: game/state.js:282, game/state.js:282, classes/ranger.js:347 and 1 more |
| `petCatch` | + base (2) | no | added: game/equipment.js:264, game/equipment.js:279 |
| `pinCushion` | + perk (1) | no | added: classes/ranger.js:306 |
| `poison` | x breakthrough (1), x perk (2), x relic (1) | no | multiplied: classes/assassin.js:315 |
| `poisonStacks` | + base (1), + boon (1), + perk (2), + relic (1) | boon | added: classes/assassin.js:156, classes/assassin.js:156, classes/assassin.js:260 and 2 more |
| `potionPower` | + town (1) | town | added: game/fights.js:552 |
| `potionSlots` | + town (1) | town | added: game/equipment.js:559 |
| `prayer` | + base (3), + perk (5), + relic (2), + trophy (1), + week (1) | no | added: game/fights.js:601, game/fights.js:603 |
| `quickHands` | + perk (9), + relic (3), + skill (1), + tower rule (1), + trophy (1), + week (1) | skill | added: game/abilities.js:156 |
| `quickShot` | + base (1), + boon (1), + perk (2), + relic (1), + skill (1) | boon, skill | added: classes/ranger.js:300, classes/ranger.js:301, classes/ranger.js:344 |
| `rage` | + boon (1), + perk (2), + relic (1), + skill (1), x breakthrough (1), x perk (2) | boon, skill | added: classes/barbarian.js:258, classes/barbarian.js:332, classes/barbarian.js:332; multiplied: classes/barbarian.js:258, classes/barbarian.js:332, classes/barbarian.js:332 |
| `rampTurn` | + base (2) | no | added: classes/beasttamer.js:407 |
| `rareMore` | + week (1) | no | added: game/fights.js:168 |
| `reflect` | + base (1), + boon (1), + perk (2), + relic (1), + skill (1), x breakthrough (1), x perk (2), x relic (1) | boon, skill | added: classes/warden.js:222, classes/warden.js:323, classes/warden.js:334; multiplied: classes/warden.js:223 |
| `relicSlots` | + legend (1), + trophy (8) | no | added: game/fights.js:354, game/page-show.js:1127, game/page-show.js:1136 |
| `resonance` | + perk (1) | no | added: classes/warlock.js:296, classes/warlock.js:309 |
| `retribution` | + perk (1) | no | added: classes/zealot.js:340, classes/zealot.js:341 |
| `riposte` | + perk (1) | no | added: classes/barbarian.js:309 |
| `sacred` | x breakthrough (1), x perk (2), x relic (1) | no | multiplied: classes/zealot.js:164, classes/zealot.js:301 |
| `sacredFlame` | + boon (1), + perk (2), + relic (1), + skill (1) | boon, skill | added: classes/zealot.js:164, classes/zealot.js:301, classes/zealot.js:363 |
| `secondClimber` | + legend (1) | no | added: game/companion.js:30 |
| `secondWeapon` | + legend (1) | no | added: game/equipment.js:440, game/page-show.js:663 |
| `secondWind` | + base (3), + perk (9), + relic (2), + trophy (1) | no | added: game/fights.js:414, game/fights.js:420, game/page-show.js:1189 |
| `shadowDance` | + perk (1) | no | added: classes/assassin.js:305 |
| `shatter` | + perk (1) | no | added: classes/barbarian.js:269 |
| `shieldCounter` | x breakthrough (1), x perk (2), x relic (1) | no | multiplied: classes/zealot.js:335, classes/zealot.js:341 |
| `shieldPower` | + perk (6), + skill (1) | skill | added: classes/warden.js:223, classes/warden.js:233, classes/warden.js:324 |
| `shortbow` | x breakthrough (1), x perk (3), x relic (1) | no | multiplied: classes/ranger.js:306 |
| `sidestep` | + perk (1), + relic (3), + trophy (1) | no | added: game/fights.js:517 |
| `skillHaste` | + skill (1) | skill | added: classes/beasttamer.js:364 |
| `smite` | + base (1), + boon (1), + perk (2), + relic (1), + skill (1) | boon, skill | added: classes/zealot.js:319, classes/zealot.js:357 |
| `sniper` | + perk (1) | no | added: classes/ranger.js:285 |
| `soulPact` | + perk (1) | no | added: classes/warlock.js:211 |
| `spear` | x breakthrough (1), x perk (3), x relic (1) | no | multiplied: classes/warden.js:259 |
| `spearPower` | + base (1), + perk (1), + skill (1) | skill | added: classes/warden.js:259, classes/warden.js:327, classes/warden.js:337 |
| `spellDazzle` | + base (2) | no | added: classes/beasttamer.js:392 |
| `spellEcho` | + base (3) | no | added: classes/beasttamer.js:399 |
| `spellExecute` | + base (1) | no | added: classes/beasttamer.js:381 |
| `spellHaste` | + skill (1) | skill | added: classes/beasttamer.js:361; overflow: classes/beasttamer.js:380 |
| `spellHeal` | + base (3) | no | added: classes/beasttamer.js:395, classes/beasttamer.js:396 |
| `spellPower` | + base (9), + skill (1) | skill | added: classes/beasttamer.js:380 |
| `spikedThrust` | + perk (1) | no | added: classes/warden.js:264, classes/warden.js:265 |
| `spite` | + perk (1) | no | added: classes/warden.js:247, classes/warden.js:318 |
| `stackCarry` | + base (1) | no | added: classes/beasttamer.js:342, classes/beasttamer.js:343 |
| `startLevels` | + legend (1) | no | added: game/bonuses.js:432, game/bonuses.js:432 |
| `stilettoCrit` | x breakthrough (1), x perk (2), x relic (1) | no | multiplied: classes/assassin.js:231 |
| `stunChance` | + base (3), + boon (2), + perk (6), + relic (3), + skill (3) | boon, skill | added, capped: classes/barbarian.js:297, classes/barbarian.js:344, classes/beasttamer.js:446 and 4 more; overflow: classes/barbarian.js:268, classes/barbarian.js:345, classes/beasttamer.js:445 and 4 more |
| `stunningBlock` | + perk (1) | no | added: classes/warden.js:282 |
| `swiftJudgement` | + perk (1) | no | added: classes/zealot.js:240, classes/zealot.js:312 |
| `swordCrit` | x breakthrough (1), x perk (2), x relic (1) | no | multiplied: classes/barbarian.js:262 |
| `thirdHit` | + base (1) | no | added: classes/beasttamer.js:409, classes/beasttamer.js:410 |
| `throw` | x breakthrough (1), x perk (3), x relic (1) | no | multiplied: classes/warden.js:233 |
| `throwPower` | + boon (1), + perk (2), + relic (1), + skill (1) | boon, skill | added: classes/warden.js:233, classes/warden.js:340 |
| `vanishChance` | + base (1), + perk (2), + skill (1) | skill | added, capped: classes/assassin.js:266, classes/assassin.js:319; overflow: classes/assassin.js:273 |
| `vengeance` | + base (1), + boon (1), + perk (2), + relic (1), x breakthrough (1), x perk (3) | boon | added: classes/warden.js:247, classes/warden.js:249, classes/warden.js:317 and 1 more; multiplied: classes/warden.js:247, classes/warden.js:249 |
| `void` | x breakthrough (1), x perk (3), x relic (1) | no | multiplied: classes/warlock.js:264 |
| `voidHeal` | + base (1), + perk (1), + skill (1) | skill | added: classes/warlock.js:290, classes/warlock.js:333 |
| `voidRend` | + base (1), + boon (1), + perk (2), + relic (1), + skill (1) | boon, skill | added: classes/warlock.js:244, classes/warlock.js:333 |
| `wolf` | x breakthrough (1), x perk (2), x relic (1) | no | multiplied: classes/beasttamer.js:428, classes/beasttamer.js:491 |
