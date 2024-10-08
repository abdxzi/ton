import { Cell, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";

import "@ton-community/test-utils";

describe("main.c contract tests", () => {
    it("first test", async () => {
        const codeCell = Cell.fromBoc(Buffer.from(hex, 'hex'))[0];

        const blockchain = await Blockchain.create();

        const myContract = blockchain.openContract(
            await MainContract.createFromConfig({}, codeCell)
        );
        const senderWallet = await blockchain.treasury("sender");

        const sentMessageResult = await myContract.sendInternalMessage(
            senderWallet.getSender(),
            toNano("0.05")
        );

        expect(sentMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: true,
        });

        const data = await myContract.getData();

        expect(data.recent_sender.toString()).toBe(senderWallet.address.toString());


    })
})


// https://stepik.org/lesson/1011490/step/2?unit=1019351