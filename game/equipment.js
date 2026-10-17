// =====================================================================
//  game/equipment.js - The blacksmith and equipment, the town, and boss boons.
// =====================================================================

// ----- Equipment -----
// Equipment is never found in the tower and never lost. A class has one weapon and
// one piece of armor, and the blacksmith in town makes them stronger for banked gold.
//
// There are two slots, "weapon" and "armor". One of them holds the class's SPECIAL
// gear, which comes in several kinds (axe / sword / club, or the Warden's three shields)
// and decides how the class fights. The other holds a plain piece with only a power.
//   - For most classes the special gear is the weapon, and the plain piece is armor.
//   - For the Warden the special gear is the shield (in the armor slot), and the
//     plain piece is the spear (in the weapon slot).
// The variable "weapon" holds the KIND of special gear being used, whichever slot it is in.
// The kind is picked at the blacksmith and changes at the start of the next run.
function specialSlot() {
  if (currentClass().specialSlot !== undefined) {
    return currentClass().specialSlot;
  }
  return "weapon";
}

// What the plain piece is called
function plainLabel() {
  if (currentClass().plainLabel !== undefined) {
    return currentClass().plainLabel;
  }
  return "Armor";
}

// The label shown in front of a slot, like "Weapon", "Armor", "Spear" or "Shield"
function slotLabel(slot) {
  if (slot === specialSlot()) {
    return currentClass().gearLabel;
  }
  return plainLabel();
}

function randomGearType(className) {
  let types = Object.keys(classes[className].gearTypes);
  return types[Math.floor(Math.random() * types.length)];
}

// How many steps the blacksmith has improved a slot ("weapon" or "armor").
// For a class that fights with pets, both are the bonded pet's own step (see "Pets").
function forgeLevel(slot) {
  if (fightsWithPets()) {
    return petOf(pet).step;
  }
  if (forgeLevels[slot] === undefined) {
    return 0;
  }
  return forgeLevels[slot];
}

// Which tier a step is in: 0 for the first on the gearTiers list, 1 for the second...
// It never goes past the last tier on the list.
function tierOfStep(step) {
  return Math.min(gearTiers.length - 1, Math.floor(step / forgeStepsPerTier));
}

// The attack a weapon gives, or the armor a piece of armor gives, at a step.
// Each +1 adds a little, and each new tier is a jump (see forgeBasePower in data.js).
// (Past the last named tier the multiplying carries on, so there is no top.)
function forgePower(slot, step) {
  // The tier keeps counting past the last named one, so the power never stops growing
  let tier = Math.floor(step / forgeStepsPerTier);
  let plus = step - tier * forgeStepsPerTier;
  let power = forgeBasePower * Math.pow(forgeTierPower, tier) * (1 + forgePlusPower * plus);

  // Armor has half the power of a weapon
  if (slot === "armor") {
    power = power / 2;
  }

  return Math.max(1, Math.round(power * multiplier("gear")));
}

// The price of the next step, in banked gold
function forgeCostOf(slot) {
  return Math.round(forgeCost * Math.pow(forgeCostGrowth, forgeLevel(slot)));
}

function upgradeGear(slot) {
  // (for a class that fights with pets, the one row's button trains the pet picked)
  if (fightsWithPets()) {
    trainPet(petInPicker());
    return;
  }
  if (bank >= forgeCostOf(slot)) {
    let tierBefore = Math.floor(forgeLevel(slot) / forgeStepsPerTier);
    bank = bank - forgeCostOf(slot);
    forgeLevels[slot] = forgeLevel(slot) + 1;
    recalcStats();
    if (!announceNewTier(slot, tierBefore)) {
      say("The blacksmith hands you your " + gearName(slot, forgeLevel(slot)) + ".");
    }
    updateScreen();
  }
}

// A banner when a piece of equipment reaches a new tier. Says whether it did.
function announceNewTier(slot, tierBefore) {
  if (Math.floor(forgeLevel(slot) / forgeStepsPerTier) === tierBefore) {
    return false;
  }
  announce("banner", gearName(slot, forgeLevel(slot)), "A new tier at the blacksmith: " + gearStat(slot, forgeLevel(slot)) + ".");
  return true;
}

// The "Buy all I can afford" button: keeps buying whichever step is cheaper
// until the bank cannot pay for either
function upgradeAllGear() {
  if (fightsWithPets()) {
    trainPet(petInPicker());
    return;
  }
  let bought = 0;
  let weaponTier = Math.floor(forgeLevel("weapon") / forgeStepsPerTier);
  let armorTier = Math.floor(forgeLevel("armor") / forgeStepsPerTier);

  while (canAffordForge()) {
    let slot = "weapon";
    if (forgeCostOf("armor") < forgeCostOf("weapon")) {
      slot = "armor";
    }
    bank = bank - forgeCostOf(slot);
    forgeLevels[slot] = forgeLevel(slot) + 1;
    bought = bought + 1;
  }

  if (bought > 0) {
    recalcStats();
    say("The blacksmith improves your equipment " + bought + " times: " + gearName("weapon", forgeLevel("weapon")) + " and " + gearName("armor", forgeLevel("armor")) + ".");
    announceNewTier("weapon", weaponTier);
    announceNewTier("armor", armorTier);
    updateScreen();
  }
}

// ----- Pets -----
// A class with "fightsWithPets: true" in its file (the Beast Tamer) never visits the
// blacksmith. Each of its pets grows by itself instead:
//   - every kill gives the BONDED pet experience, as much as the gold the monster drops
//     times petExperienceShare (data.js), and the class Essence (petEssenceShare);
//   - Essence trains ANY pet, so the ones waiting in the den need not fall behind.
// A pet's level is a step, counted like the blacksmith's: its tiers are the class's
// gearTiers (Young, Grown, Seasoned...), its power is forgePower, and everything that
// multiplies "gear" makes a pet stronger too. Bonding with another pet (the weapon
// picker) happens after the next fall, as picking another weapon does.
function fightsWithPets() {
  return currentClass().fightsWithPets === true;
}

// A pet's record, made the first time it is asked for
function petOf(kind) {
  if (pets[kind] === undefined) {
    pets[kind] = { step: 0, xp: 0 };
  }
  return pets[kind];
}

// The experience a pet needs for its next step: what the blacksmith would ask in gold
function petStepCost(kind) {
  return Math.round(forgeCost * Math.pow(forgeCostGrowth, petOf(kind).step));
}

// Gives a pet experience, and takes it up as many steps as that pays for
function feedPet(kind, amount) {
  let pet = petOf(kind);
  let stepBefore = pet.step;
  pet.xp = pet.xp + amount;
  while (pet.xp >= petStepCost(kind)) {
    pet.xp = pet.xp - petStepCost(kind);
    pet.step = pet.step + 1;
  }
  if (pet.step === stepBefore) {
    return;
  }
  recalcStats();
  if (Math.floor(pet.step / forgeStepsPerTier) > Math.floor(stepBefore / forgeStepsPerTier)) {
    announce("banner", petName(kind), "Your " + petKits[kind].name + " grows: " + gearStat("weapon", pet.step) + ".");
  }
}

// What a kill pays a class that fights with pets (called from victory in game/fights.js)
function rewardPets(gold) {
  feedPet(pet, gold * petExperienceShare);
  essence = essence + gold * petEssenceShare * (1 + totalBonus("essenceGain"));
}

// The Essence that takes a pet to its next step
function petTrainCost(kind) {
  return Math.ceil(petStepCost(kind) - petOf(kind).xp);
}

// The Train button: as many steps as the Essence pays for
function trainPet(kind) {
  let steps = 0;
  while (essence >= petTrainCost(kind)) {
    let cost = petTrainCost(kind);
    essence = essence - cost;
    feedPet(kind, cost);
    steps = steps + 1;
  }
  if (steps > 0) {
    say("You train your " + petKits[kind].name + ": " + petName(kind) + ".");
    updateScreen();
  }
}

// ----- Catching pets (see "Catching pets" in data.js) -----
// The pets a tamer has: the starters, and every kind it has caught
function ownedPets() {
  return Object.keys(petKits).filter(function (kind) {
    return petKits[kind].monster === undefined || pets[kind] !== undefined;
  });
}

// The pet a monster of this name would be, or "" if it has no kit yet
function petFromMonster(name) {
  for (let kind in petKits) {
    if (petKits[kind].monster === name) {
      return kind;
    }
  }
  return "";
}

// How a catch's rarity is rolled: a rare monster never comes out below Rare
function rollRarity(fromRare) {
  let lowest = fromRare ? 2 : 0;
  let roll = Math.random() * petRarities.slice(lowest).reduce(function (sum, r) { return sum + r.chance; }, 0);
  let last = lowest;
  for (let i = lowest; i < petRarities.length; i++) {
    if (petRarities[i].chance > 0) {
      last = i;
    }
    roll = roll - petRarities[i].chance;
    if (roll < 0 && petRarities[i].chance > 0) {
      return i;
    }
  }
  return last;
}

// What a pet's rarity multiplies its attack and health by
function petRarityPower() {
  if (!fightsWithPets()) {
    return 1;
  }
  return petRarities[petOf(pet).rarity || 0].power;
}

// The names of the pets caught since the page was opened, newest last (for the report of
// time away: game/start.js). Not saved.
let petsCaught = [];

// The chance an ordinary monster of this kind joins a tamer that beats it: more for a kind
// the bestiary knows well, and with the passives that catch more ("petCatch")
function petCatchChanceOf(kind) {
  let owned = pets[petFromMonster(kind)] !== undefined;
  return (owned ? petCatchAgain : petCatchChance) * (1 + totalBonus("petCatch")) * (1 + petBestiaryCatch * bestiaryRank(kind));
}

// The copies that merge a pet into its next rarity: more for each rarity it has
function petCopiesToMerge(kind) {
  return petMergeCopies * ((pets[kind].rarity || 0) + 1);
}

// The chance the monster just beaten joins: an ordinary one as petCatchChanceOf says (a
// rare one petRareCatch times likelier), a boss only once the bestiary knows it
function petCatchNow(kind) {
  if (bondTrial && encounterType === "boss") {
    return 1;
  }
  if (petKits[kind].boss === true) {
    return encounterType === "boss" && bestiaryRank(monsterKind) >= petBossKnown ? petBossCatch * (1 + totalBonus("petCatch")) : 0;
  }
  if (encounterType !== "monster") {
    return 0;
  }
  return petCatchChanceOf(monsterKind) * (monsterIsRare ? petRareCatch : 1);
}

// The Merge button: enough copies of a pet make it one rarity better
function mergePet(kind) {
  let record = pets[kind];
  if (record === undefined || (record.copies || 0) < petCopiesToMerge(kind) || (record.rarity || 0) >= petRarities.length - 1) {
    return;
  }
  record.copies = record.copies - petCopiesToMerge(kind);
  record.rarity = (record.rarity || 0) + 1;
  recalcStats();
  announce("banner", petRarities[record.rarity].name + " " + petKits[kind].name, "Merged: stronger, and its levels are kept.");
  updateScreen();
}

// Will this boss fight a Bond Trial? Only for a tamer hunting it, who has not tamed it
// yet, once the bestiary knows it well enough
function bondTrialReady(bossName) {
  let kind = petFromMonster(bossName);
  return fightsWithPets() && trackedPet === bossName && kind !== "" && pets[kind] === undefined && bestiaryRank(bossName) >= petTrialKnown;
}

// Hunts a kind of monster, or stops hunting it if it was already hunted
function trackPet(monsterName) {
  trackedPet = trackedPet === monsterName ? "" : monsterName;
  updateScreen();
}

// Runs after every win of a tamer: the monster may join it
function tryCatch() {
  let kind = petFromMonster(monsterKind);
  if (kind === "" || !chance(petCatchNow(kind))) {
    return;
  }
  let rarity = rollRarity(monsterIsRare || petKits[kind].boss === true);
  let name = petRarities[rarity].name + " " + petKits[kind].name;

  // A kind it has already: the better rarity, or a copy to merge (Essence for a Mythic's)
  if (pets[kind] !== undefined) {
    if (rarity > (pets[kind].rarity || 0)) {
      pets[kind].rarity = rarity;
      petsCaught.push(name);
      recalcStats();
      announce("banner", "Caught: " + name, "Your " + petKits[kind].name + " is " + petRarities[rarity].name + " now: stronger, and its levels are kept.");
    } else if ((pets[kind].rarity || 0) < petRarities.length - 1) {
      pets[kind].copies = (pets[kind].copies || 0) + 1;
      say("You catch a " + name + ": a copy of the one you have (" + pets[kind].copies + " of " + petCopiesToMerge(kind) + " to merge it into the next rarity).");
    } else {
      let paid = Math.round(petStepCost(kind) * petReleaseShare);
      essence = essence + paid;
      say("You catch a " + name + ", and let it go: yours is Mythic already. It leaves " + big(paid) + " Essence.");
    }
    return;
  }

  pets[kind] = { step: Math.floor(petOf(pet).step * petCatchStep), xp: 0, rarity: rarity };
  petsCaught.push(name);
  // (the hunt for it is over)
  if (trackedPet === monsterKind) {
    trackedPet = "";
  }
  announce("banner", "Caught: " + name, "A new pet. Pick it under Bond with, on the Town tab, to fight beside it after your next fall.");
}

// For example "Seasoned Wolf Pack +3"
function petName(kind) {
  let step = petOf(kind).step;
  let tier = Math.floor(step / forgeStepsPerTier);
  let plus = step - tier * forgeStepsPerTier;
  let tierName = currentClass().gearTiers[Math.min(currentClass().gearTiers.length - 1, tier)];
  return tierName + " " + petKits[kind].name + (plus > 0 ? " +" + plus : "");
}

// Ascending (and becoming a legend) costs each pet half its steps. What the climb was
// worth is not all lost, and the den's training is never thrown away.
function petsStartOver() {
  for (let kind in pets) {
    pets[kind].step = Math.floor(pets[kind].step / 2);
    pets[kind].xp = 0;
  }
}

// For example "Bronze Axe", "Iron Ember Shield +7" or "Steel Armor +2".
// "step" is how far the blacksmith has taken it.
function gearName(slot, step) {
  let name = plainLabel();
  if (slot === specialSlot()) {
    name = fightsWithPets() ? petKits[pet].name : currentClass().gearTypes[weapon];

    // A named weapon takes the place of the kind's name, and keeps the blacksmith's work
    if (wieldedTrophy() !== null) {
      name = wieldedTrophy().weapon;
    }
  }

  // A class can name the tiers of its own special gear (a bow is not made of bronze)
  let tierNames = gearTiers;
  if (slot === specialSlot() && currentClass().gearTiers !== undefined) {
    tierNames = currentClass().gearTiers;
  }

  let tier = tierOfStep(step);
  name = tierNames[Math.min(tier, tierNames.length - 1)] + " " + name;

  let plus = step - tier * forgeStepsPerTier;
  if (plus > 0) {
    name = name + " +" + plus;
  }
  return name;
}

// ----- The boss weapon -----
// With the Second Weapon legend unlock, a class can pick a second kind of weapon (the
// Elementalist: a second element) and it is drawn for every boss, then put away again.
// So a class can climb with one build and bring another to the fights that suit it.
// Its mastery skill and its boons still have to be earned like any others.

// The kinds a class chooses between: its elements if it has stances, else its weapons
function buildKinds() {
  if (currentClass().stances !== undefined) {
    let kinds = {};
    for (let id in currentClass().stances) {
      kinds[id] = currentClass().stances[id].name;
    }
    return kinds;
  }
  return currentClass().gearTypes;
}

// The kind in hand right now, and a way to change it, whichever of the two it is
function kindInHand() {
  return currentClass().stances !== undefined ? stance : weapon;
}

function takeInHand(kind) {
  if (currentClass().stances !== undefined) {
    stance = kind;
  } else {
    weapon = kind;
  }
  recalcStats();
}

// The kind the class climbs with, even while the boss weapon is drawn (this is what is saved)
function mainKind() {
  return swappedFrom !== "" ? swappedFrom : kindInHand();
}

function chooseBossWeapon(kind) {
  bossWeapon = kind;
  updateScreen();
}

// Runs when a boss appears
function drawBossWeapon() {
  if (totalBonus("secondWeapon") < 1 || buildKinds()[bossWeapon] === undefined || bossWeapon === kindInHand() || swappedFrom !== "") {
    return;
  }
  swappedFrom = kindInHand();
  takeInHand(bossWeapon);
  say("You draw your " + buildKinds()[bossWeapon] + " for the boss.");
}

// Runs when the boss is dead, when you fall, and before every new room
function sheatheBossWeapon() {
  if (swappedFrom !== "") {
    takeInHand(swappedFrom);
    swappedFrom = "";
  }
}

// ----- Named weapons -----
// Won at floor 100 of another class's tower (see towers.js). The class wields one at a
// time, and only that one's passive works.

// Every named weapon the class has won, as its trophy
function namedWeaponsWon() {
  let won = [];
  for (let towerName in towers) {
    for (let trophy of towers[towerName].trophies) {
      if (trophy.weapon !== undefined && trophies.includes(trophy.id)) {
        won.push(trophy);
      }
    }
  }
  return won;
}

// The trophy of the named weapon being wielded, or null
function wieldedTrophy() {
  for (let trophy of namedWeaponsWon()) {
    if (trophy.id === namedWeapon) {
      return trophy;
    }
  }
  return null;
}

// "" puts the named weapon away
function wieldNamedWeapon(id) {
  namedWeapon = id;
  recalcStats();
  updateScreen();
}

// Picks the kind of weapon to fight with. It is taken up at the start of the next run.
// (a tamer picks a pet here instead: "type" is then the pet, and the weapon its path)
function chooseWeapon(type) {
  if (fightsWithPets()) {
    nextPet = type;
    type = petPaths[petKits[type].path].build;
  }
  nextWeapon = type;
  updateScreen();
}

// Runs at the start of every run: the weapon picked at the blacksmith is taken up
function startRunGear() {
  if (currentClass().gearTypes[nextWeapon] === undefined) {
    nextWeapon = weapon;
  }
  // (a tamer bonds with the pet it picked)
  if (fightsWithPets() && petKits[nextPet] !== undefined && nextPet !== pet) {
    pet = nextPet;
    weapon = nextWeapon;
    say("You bond with your " + petName(pet) + ".");
  }
  if (nextWeapon !== weapon) {
    weapon = nextWeapon;
    say("You take up your " + gearName(specialSlot(), forgeLevel(specialSlot())) + ".");
  }
  dotStacks = 0;
  recalcStats();
}

// ----- The town -----
// Merchants trade banked gold for things that last beyond one run
function townLevel(id) {
  if (townLevels[id] === undefined) {
    return 0;
  }
  return townLevels[id];
}

// Each level costs "growth" times more than the last
function townCost(item) {
  return Math.round(item.cost * Math.pow(item.growth, townLevel(item.id)));
}

function buyTownUpgrade(item) {
  if (!townUpgradeIsMaxed(item) && bank >= townCost(item)) {
    bank = bank - townCost(item);
    townLevels[item.id] = townLevel(item.id) + 1;
    recalcStats();
    updateScreen();
  }
}

// Picking one from the Tactician's window also closes the window
function chooseFavouriteUpgrade(id) {
  favouriteUpgrade = id;
  closeFavouriteWindow();
  updateScreen();
}

function openFavouriteWindow() {
  document.getElementById("favourite-window").hidden = false;
}

function closeFavouriteWindow() {
  document.getElementById("favourite-window").hidden = true;
}

function potionLimit() {
  return maxPotions + totalBonus("potionSlots");
}

// What one potion costs right now (see potionPriceFloors in data.js)
function potionCost() {
  return potionPrice * (1 + Math.floor(ascensionBest / potionPriceFloors));
}

// A RUN CAN DRINK NO MORE POTIONS THAN THE BELT HOLDS. Until 13 October 2026 potions
// could be bought from the bank while a fight went on, so the size of the belt was no
// limit: a class with gold drank its way through any boss. Now every potion drunk in a
// run takes up its place on the belt until the fall.
// How many more potions the belt can take right now. Everything that puts a potion on
// the belt asks this.
function potionRoom() {
  return Math.max(0, potionLimit() - potionsDrunk - potions);
}

function buyPotion() {
  if (potionRoom() > 0 && bank >= potionCost()) {
    bank = bank - potionCost();
    potions = potions + 1;
    updateScreen();
  }
}

function setKeepPotions(on) {
  keepPotions = on;
  updateScreen();
}

// Runs when you fall, after the gold has been banked: fills the belt if asked to.
// Gives back how many were bought.
function restockPotions() {
  let bought = 0;
  while (keepPotions && potionRoom() > 0 && bank >= potionCost()) {
    bank = bank - potionCost();
    potions = potions + 1;
    bought = bought + 1;
  }
  return bought;
}

// ----- Boss upgrades (the page calls them BOONS) -----
// The player sees the word "boon" for these, so that "upgrade" on the page only ever
// means something bought: at the blacksmith, in town or with fame.
// Every boss gives one upgrade, straight away, with nothing to click and nothing to
// wait for. It is always one that suits the weapon being used (see fitsBuild), and
// it lasts until you die. What a run has collected is listed under the fight.
function upgradeLevel(id) {
  if (upgrades[id] === undefined) {
    return 0;
  }
  return upgrades[id];
}

// How many levels of upgrades bosses have given this run, all added together
function upgradesHeld() {
  let total = 0;
  for (let upgrade of currentClass().upgrades) {
    total = total + upgradeLevel(upgrade.id);
  }
  return total;
}

// Every level held also multiplies attack and health (see bossUpgradePower in data.js)
function upgradeBoost() {
  return 1 + bossUpgradePower * upgradesHeld();
}

// The floor a run starts on (see "Sweeping through the easy floors" in data.js): the
// deepest floor the last run reached without slowing down. A run that slowed down at
// its very first fight was started too high, so the next one starts half as high.
function startFloor() {
  if (cruiseFloor > runStartFloor) {
    return cruiseFloor;
  }
  return Math.max(1, Math.floor(runStartFloor / 2));
}


// The last upgrade a boss gave, for the pop-up message. Not saved.
let lastUpgrade = null;

// Runs when a boss is defeated
function gainBossUpgrade() {
  let choices = [];
  for (let upgrade of currentClass().upgrades) {
    if (fitsBuild(upgrade)) {
      choices.push(upgrade);
    }
  }

  // (Every class has boons that suit any weapon, so this never happens. Boons have no top level.)
  if (choices.length === 0) {
    return;
  }

  let upgrade = choices[Math.floor(Math.random() * choices.length)];

  // The Tactician gets you your favourite instead, as long as it is one of the choices
  if (totalBonus("favouriteUpgrade") >= 1) {
    for (let choice of choices) {
      if (choice.id === favouriteUpgrade) {
        upgrade = choice;
      }
    }
  }

  upgrades[upgrade.id] = upgradeLevel(upgrade.id) + 1;
  lastUpgrade = upgrade;
  recalcStats();
  say("The boss leaves you a boon: " + upgrade.name + ", level " + upgrades[upgrade.id] + " (" + upgrade.text + ").");
}
