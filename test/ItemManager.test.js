const assert = require("assert")
const ItemManager = artifacts.require("./ItemManager.sol");

contract("ItemManager", accounts => {
    it("item should be added on the blockchain",async ()=>{
        const ItemManagerInstance = await ItemManager.deployed();
        const name = "test-1";
        const cost = 500;

        const result = await ItemManagerInstance.createItem(name,cost, {from: accounts[0]});
        assert.equal(result.logs[0].args.index, 0, "Item is not first")

        const item = await ItemManagerInstance.items(0);
        assert.strictEqual(item.identifier , name, "The identifier has different name");
    });
});

