const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// START
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Bot Connected. Your ID: " + msg.chat.id);
});

// RECEIVE DEPOSIT
bot.on('message', (msg) => {
    if(msg.photo){
        let text = msg.caption;

        let userId = text.match(/Telegram ID: (\d+)/)[1];
        let amount = text.match(/Amount: Rs (\d+)/)[1];

        bot.sendMessage(msg.chat.id, "Select Action:", {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Approve", callback_data: "approve_"+userId+"_"+amount },
                        { text: "Reject", callback_data: "reject_"+userId }
                    ]
                ]
            }
        });
    }
});

// BUTTON
bot.on("callback_query", (query) => {

    let data = query.data.split("_");

    if(data[0] === "approve"){
        let uid = data[1];
        let amt = data[2];

        bot.sendMessage(uid, "Your deposit Rs " + amt + " approved");
        bot.answerCallbackQuery(query.id, { text: "Approved" });
    }

    if(data[0] === "reject"){
        let uid = data[1];

        bot.sendMessage(uid, "Your deposit rejected");
        bot.answerCallbackQuery(query.id, { text: "Rejected" });
    }
});