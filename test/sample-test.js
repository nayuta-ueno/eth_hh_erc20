const { expect } = require("chai");

describe("OzToken test", function() {
  const SUPPLY = 20000;
  let instance;
  beforeEach(async function() {
    const OzToken = await ethers.getContractFactory("OzToken");
    instance = await OzToken.deploy(SUPPLY);
  });

  it("supply amount1", async function() {
    const supply = await instance.totalSupply();
    expect(supply).to.equal(SUPPLY);
  });

  it("deploy amount", async function() {
    const [owner] = await ethers.getSigners();
    const balance = await instance.balanceOf(owner.address);
    expect(balance).to.equal(SUPPLY);
  });

  it("direct transfer", async () => {
    const [owner, payee] = await ethers.getSigners();

    const payAmt = 10000;
    await instance.transfer(payee.address, payAmt);

    const balanceOwner = await instance.balanceOf(owner.address);
    expect(payAmt).to.equal(SUPPLY - balanceOwner);

    const balancePayee = await instance.balanceOf(payee.address);
    expect(payAmt).to.equal(balancePayee);
  });

  it("approve transfer from owner", async () => {
    const [owner, payer, payee] = await ethers.getSigners();
    var balanceOwnerBegin = await instance.balanceOf(owner.address);
    var balancePayerBegin = await instance.balanceOf(payer.address);
    var balancePayeeBegin = await instance.balanceOf(payee.address);

    const payAmt = 10000;

    await instance.approve(payer.address, payAmt);
    const appr = await instance.allowance(owner.address, payer.address);
    expect(appr).to.equal(payAmt);

    await instance.connect(payer).transferFrom(owner.address, payee.address, payAmt);

    const balanceOwner = await instance.balanceOf(owner.address);
    expect(balanceOwner - balanceOwnerBegin).to.equal(-payAmt);

    const balancePayer = await instance.balanceOf(payer.address);
    expect(balancePayer - balancePayerBegin).to.equal(0);

    const balancePayee = await instance.balanceOf(payee.address);
    expect(balancePayee - balancePayeeBegin).to.equal(payAmt);
  });
});
