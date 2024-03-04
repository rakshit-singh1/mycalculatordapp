import * as anchor from "@coral-xyz/anchor";
import assert from "assert";
import { Program } from "@coral-xyz/anchor";
import { Mycalculatordapp } from "../target/types/mycalculatordapp";
 
const { SystemProgram, Keypair } = anchor.web3;
 
describe("calculator", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.mycalculatordapp as Program<Mycalculatordapp>; // abstraction/instance that is created to call the function of the program
  const publicKey = anchor.AnchorProvider.local().wallet.publicKey;
  const calculator = Keypair.generate();
 
  it("Creates a calculator", async () => {
    await program.methods.create("Welcome to Solana Calculator")
      .accounts({
        // passing th context that we have given in solana function
        calculator: calculator.publicKey,
        user: publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([calculator]) //have to pass this signer because we are create a new calculator account  //required only once
      .rpc();
 
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.greeting === "Welcome to Solana Calculator");
  });

  it('Adds two numbers', async()=>{
    await program.methods.add(new anchor.BN(2),new anchor.BN(3)).
    accounts({
      calculator: calculator.publicKey
    }).rpc();
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    console.log(account.result)
    assert.ok(account.result.eq(new anchor.BN(5)));
  });

  it('Subtracts two numbers', async()=>{
    await program.methods.sub(new anchor.BN(3),new anchor.BN(2)).
    accounts({
      calculator: calculator.publicKey
    }).rpc();
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    console.log(account.result)
    assert.ok(account.result.eq(new anchor.BN(1)));
  });
  
  it('Multiplies two numbers', async()=>{
    await program.methods.mul(new anchor.BN(2),new anchor.BN(3)).
    accounts({
      calculator: calculator.publicKey
    }).rpc();
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    console.log(account.result)
    assert.ok(account.result.eq(new anchor.BN(6)));
  });

  it('Divides two numbers and return remainder as well', async()=>{
    await program.methods.div(new anchor.BN(3),new anchor.BN(2)).
    accounts({
      calculator: calculator.publicKey
    }).rpc();
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    console.log(account.result)
    assert.ok(account.result.eq(new anchor.BN(1)));
    assert.ok(account.remainder.eq(new anchor.BN(1)));
  });
})

