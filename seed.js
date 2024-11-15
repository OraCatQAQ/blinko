"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const client_1 = require("@prisma/client");
const ncp_1 = require("ncp");
const fs_1 = require("fs");
const crypto_1 = require("crypto");
async function hashPassword(password) {
    return new Promise((resolve, reject) => {
        const salt = (0, crypto_1.randomBytes)(16).toString('hex');
        (0, crypto_1.pbkdf2)(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
            if (err)
                reject(err);
            resolve('pbkdf2:' + salt + ':' + derivedKey.toString('hex'));
        });
    });
}
async function verifyPassword(inputPassword, hashedPassword) {
    return new Promise((resolve, reject) => {
        const [prefix, salt, hash] = hashedPassword.split(':');
        if (prefix !== 'pbkdf2') {
            return resolve(false);
        }
        (0, crypto_1.pbkdf2)(inputPassword, salt, 1000, 64, 'sha512', (err, derivedKey) => {
            if (err)
                reject(err);
            resolve(derivedKey.toString('hex') === hash);
        });
    });
}
const tag = [
    {
        "id": 1,
        "name": "Welcome",
        "icon": "\uD83C\uDF89",
        "parent": 0
    },
    {
        "id": 2,
        "name": "Attachment",
        "icon": "\uD83D\uDD16",
        "parent": 1
    },
    {
        "id": 3,
        "name": "Code",
        "icon": "\uD83E\uDE84",
        "parent": 1
    },
    {
        "id": 4,
        "name": "To-Do",
        "icon": "✨",
        "parent": 1
    },
    {
        "id": 5,
        "name": "Multi-Level-Tags",
        "icon": "\uD83C\uDFF7\uFE0F",
        "parent": 1
    }
];
const attachments = [
    {
        "id": 1,
        "isShare": false,
        "sharePassword": "",
        "name": "pic01.png",
        "path": "/api/file/pic01.png",
        "size": 1360952,
        "noteId": 2
    },
    {
        "id": 2,
        "isShare": false,
        "sharePassword": "",
        "name": "pic02.png",
        "path": "/api/file/pic02.png",
        "size": 971782,
        "noteId": 2
    },
    {
        "id": 3,
        "isShare": false,
        "sharePassword": "",
        "name": "pic03.png",
        "path": "/api/file/pic03.png",
        "size": 141428,
        "noteId": 2
    },
    {
        "id": 4,
        "isShare": false,
        "sharePassword": "",
        "name": "pic04.png",
        "path": "/api/file/pic04.png",
        "size": 589371,
        "noteId": 2
    },
    {
        "id": 5,
        "isShare": false,
        "sharePassword": "",
        "name": "pic06.png",
        "path": "/api/file/pic06.png",
        "size": 875361,
        "noteId": 2
    },
    {
        "id": 6,
        "isShare": false,
        "sharePassword": "",
        "name": "story.txt",
        "path": "/api/file/story.txt",
        "size": 0,
        "noteId": 2
    }
];
const notes = [
    {
        "id": 1,
        "type": 0,
        "content": "#Welcome\n\nWelcome to Blinko!\n\nWhether you're capturing ideas, taking meeting notes, or planning your schedule, Blinko provides an easy and efficient way to manage it all. Here, you can create, edit, and share notes anytime, anywhere, ensuring you never lose a valuable thought.",
        "isArchived": false,
        "isRecycle": false,
        "isShare": false,
        "isTop": false,
        "sharePassword": ""
    },
    {
        "id": 2,
        "type": 0,
        "content": "#Welcome/Attachment",
        "isArchived": false,
        "isRecycle": false,
        "isShare": false,
        "isTop": false,
        "sharePassword": ""
    },
    {
        "id": 3,
        "type": 0,
        "content": "#Welcome/Code\n\n\n\n```js\nfunction Welcome(){\n  console.log(\"Hello! Blinko\");\n}\n```",
        "isArchived": false,
        "isRecycle": false,
        "isShare": false,
        "isTop": false,
        "sharePassword": ""
    },
    {
        "id": 4,
        "type": 0,
        "content": "#Welcome/To-Do\n\n* Create a blinko\n* Create a note\n* Upload file",
        "isArchived": false,
        "isRecycle": false,
        "isShare": false,
        "isTop": false,
        "sharePassword": ""
    },
    {
        "id": 5,
        "type": 0,
        "content": "#Welcome/Multi-Level-Tags\n\nUse the \"/\" shortcut to effortlessly create and organize multi-level tags.",
        "isArchived": false,
        "isRecycle": false,
        "isShare": false,
        "isTop": false,
        "sharePassword": ""
    },
    {
        "id": 6,
        "type": 0,
        "content": "https://github.com/blinko-space/blinko/",
        "isArchived": false,
        "isRecycle": false,
        "isShare": false,
        "isTop": false,
        "sharePassword": ""
    }
];
const tagsToNote = [
    {
        "id": 1,
        "noteId": 1,
        "tagId": 1
    },
    {
        "id": 2,
        "noteId": 2,
        "tagId": 1
    },
    {
        "id": 3,
        "noteId": 2,
        "tagId": 2
    },
    {
        "id": 4,
        "noteId": 3,
        "tagId": 1
    },
    {
        "id": 5,
        "noteId": 3,
        "tagId": 3
    },
    {
        "id": 6,
        "noteId": 4,
        "tagId": 1
    },
    {
        "id": 7,
        "noteId": 4,
        "tagId": 4
    },
    {
        "id": 8,
        "noteId": 5,
        "tagId": 1
    },
    {
        "id": 9,
        "noteId": 5,
        "tagId": 5
    }
];
const prisma = new client_1.PrismaClient();
async function main() {
    const hasNotes = await prisma.notes.findMany();
    if (hasNotes.length == 0) {
        await prisma.notes.createMany({ data: notes });
        await prisma.tag.createMany({ data: tag });
        await prisma.tagsToNote.createMany({ data: tagsToNote });
        await prisma.attachments.createMany({ data: attachments });
        await prisma.$executeRaw `SELECT setval('notes_id_seq', (SELECT MAX(id) FROM "notes") + 1);`;
        await prisma.$executeRaw `SELECT setval('tag_id_seq', (SELECT MAX(id) FROM "tag") + 1);`;
        await prisma.$executeRaw `SELECT setval('"tagsToNote_id_seq"', (SELECT MAX(id) FROM "tagsToNote") + 1);`;
        await prisma.$executeRaw `SELECT setval('attachments_id_seq', (SELECT MAX(id) FROM "attachments") + 1);`;
    }
    //Compatible with users prior to v0.2.9
    const account = await prisma.accounts.findFirst({ orderBy: { id: 'asc' } });
    if (account) {
        if (!account.role) {
            await prisma.accounts.update({ where: { id: account.id }, data: { role: 'superadmin' } });
        }
        await prisma.notes.updateMany({ where: { accountId: null }, data: { accountId: account.id } });
    }
    //database password hash
    const accounts = await prisma.accounts.findMany();
    for (const account of accounts) {
        const isHash = account.password.startsWith('pbkdf2:');
        if (!isHash) {
            await prisma.accounts.update({ where: { id: account.id }, data: { password: await hashPassword(account.password) } });
        }
    }
    try {
        await fs_1.promises.mkdir(".blinko");
    }
    catch (error) { }
    try {
        await Promise.all([fs_1.promises.mkdir(".blinko/files"), fs_1.promises.mkdir(".blinko/faiss"), fs_1.promises.mkdir(".blinko/pgdump")]);
    }
    catch (error) { }
    (0, ncp_1.ncp)('prisma/seedfiles', ".blinko/files", (err) => {
        if (err) {
            console.log(err);
        }
    });
}
main()
    .then(e => {
    console.log("✨ Seed done! ✨");
})
    .catch((e) => {
    console.error(e);
})
    .finally(async () => {
    await prisma.$disconnect();
});