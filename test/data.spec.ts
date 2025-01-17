import { assert } from "chai";

import { dungeons, explorations } from "../src/config/data/adventures";
import { consumables } from "../src/config/data/consumables";
import { equippables } from "../src/config/data/equippables";
import { monsters } from "../src/config/data/monsters";
import { restOptions, restChoices } from "../src/config/data/restOptions";
import { sellables } from "../src/config/data/sellables";

suite("Data", () => {
  const items = [...equippables, ...sellables, ...consumables];
  const adventures = [...explorations, ...dungeons];

  suite("Rest validation", () => {
    test("There should be the same number of choices as options.", () => {
      assert.equal(Object.keys(restOptions).length, restChoices.length);
    });

    for (const option of Object.keys(restOptions)) {
      test(`${option} should have a matching choice.`, () => {
        const found = restChoices.find((el) => el[1] === option);
        assert.exists(found, `${option} does not have a matching choice.`);
      });
    }

    for (const choice of restChoices) {
      test(`${choice[1]} should have a matching option.`, () => {
        const found = Object.keys(restOptions).includes(choice[1]);
        assert.isTrue(found, `${choice[1]} does not have a matching option.`);
      });
    }
  });

  suite("Adventure Validation", () => {
    for (const adventure of adventures) {
      test(`${adventure.name} should have valid monsters.`, () => {
        for (const monster of adventure.results.monsters) {
          const found = monsters.find((m) => m.name === monster);
          assert.exists(found, `${monster} not found.`);
        }
      });

      test(`${adventure.name} should have valid treasures.`, () => {
        for (const treasure of adventure.results.treasure) {
          const found = items.find((i) => i.name === treasure);
          assert.exists(found, `${treasure} not found.`);
        }
      });

      if (adventure.type === "exploration") {
        test(`${adventure.name} should have a valid dungeon.`, () => {
          const found = dungeons.find(
            (d) => d.name === adventure.results.dungeon
          );
          assert.exists(found, `${adventure.results.dungeon} not found.`);
        });
      }
    }
  });

  suite("Monster Validation", () => {
    for (const monster of monsters) {
      test(`${monster.name} should have valid items.`, () => {
        for (const item of monster.drops.items) {
          const found = items.find((i) => i.name === item);
          assert.exists(found, `${item} not found.`);
        }
      });
    }
  });

  suite("Unique Validation", () => {
    test("Equipment should be unique.", () => {
      const equipSet = new Set();
      for (const item of equippables) {
        assert.isFalse(equipSet.has(item.name), `${item.name} is not unique.`);
        equipSet.add(item.name);
      }
    });

    test("Sellables should be unique.", () => {
      const sellSet = new Set();
      for (const item of sellables) {
        assert.isFalse(sellSet.has(item.name), `${item.name} is not unique.`);
        sellSet.add(item.name);
      }
    });

    test("Consumables should be unique.", () => {
      const consumSet = new Set();
      for (const item of consumables) {
        assert.isFalse(consumSet.has(item.name), `${item.name} is not unique.`);
        consumSet.add(item.name);
      }
    });

    test("Monsters should be unique.", () => {
      const monsterSet = new Set();
      for (const monster of monsters) {
        assert.isFalse(
          monsterSet.has(monster.name),
          `${monster.name} is not unique.`
        );
        monsterSet.add(monster.name);
      }
    });

    test("Explorations should be unique.", () => {
      const expSet = new Set();
      for (const exp of explorations) {
        assert.isFalse(expSet.has(exp.name), `${exp.name} is not unique.`);
        expSet.add(exp.name);
      }
    });

    test("Dungeons should be unique.", () => {
      const dungeonSet = new Set();
      for (const dungeon of dungeons) {
        assert.isFalse(
          dungeonSet.has(dungeon.name),
          `${dungeon.name} is not unique.`
        );
        dungeonSet.add(dungeon.name);
      }
    });

    test("All items should be unique.", () => {
      const itemSet = new Set();
      for (const item of items) {
        assert.isFalse(itemSet.has(item.name), `${item.name} is not unique.`);
        itemSet.add(item.name);
      }
    });

    test("Adventures should be unique.", () => {
      const adventureSet = new Set();
      for (const adventure of adventures) {
        assert.isFalse(
          adventureSet.has(adventure.name),
          `${adventure.name} is not unique.`
        );
        adventureSet.add(adventure.name);
      }
    });
  });
});
