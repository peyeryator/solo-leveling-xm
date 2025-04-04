// Solo Leveling XMD - WhatsApp Bot
const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const express = require('express');
const fs = require('fs');
const { Boom } = require('@hapi/boom');
const app = express();
const PORT = process.env.PORT || 3000;

const { state, saveState } = useSingleFileAuthState('./session/session.json');

const startBot = async () => {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    sock.ev.on('creds.update', saveState);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (body?.startsWith('!menu')) {
            await sock.sendMessage(from, { text: `*Solo Leveling XMD Bot Menu:*

1. !hunt - Fight monsters
2. !level - Check your hunter level
3. !daily - Claim daily XP
4. !owner - Show bot owner

Powered by Peter` });
        } else if (body?.startsWith('!owner')) {
            await sock.sendMessage(from, { text: 'Bot Owner: Peter
Solo Leveling inspired bot.' });
        } else if (body?.startsWith('!hunt')) {
            await sock.sendMessage(from, { text: 'You entered a dungeon... You fought hard and gained XP!
+20 XP' });
        } else if (body?.startsWith('!level')) {
            await sock.sendMessage(from, { text: 'You are currently a D-Rank Hunter.
XP: 80/100
Fight more to level up!' });
        } else if (body?.startsWith('!daily')) {
            await sock.sendMessage(from, { text: 'You received +15 XP as your daily reward. Come back tomorrow!' });
        }
    });
};

startBot();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
