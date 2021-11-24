import { Command } from '../interfaces'
import { sendMSG, getBlock } from "../functions";
import { initStuff } from '../index';

export const command: Command = {
    name: "collect",
    usage: "!collect <Blockname>",
    args: 1,

    run: async function (rank, username, args, bot) {
        let loopCollect: boolean = true;

        // @ts-ignore
        bot.once("stopCollect", () => {
            if (!initStuff.whitelist.includes(username)) return;
            loopCollect = false
            sendMSG(username, "Stopping...")
        });

        // Get the block to collect
        const block = await getBlock(args[0], username);

        collectBlock();
        sendMSG(username, `Collecting minecraft:${block.name}`);

        function collectBlock() {
            const foundBlocks = bot.findBlock({
                matching: block.id,
                maxDistance: 64
            });

            // Collect the blocks if exist any
            if (foundBlocks) {
                // @ts-ignore
                bot.collectBlock.collect(foundBlocks, error => {
                    if (error)
                        console.log(error);
                    else if (loopCollect) {
                        collectBlock();
                    } else sendMSG(username, "Stopped!");
                });
            }
        }
    }
}