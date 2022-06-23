"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const allFlashcards = await prisma.flashcard.findMany();
    console.log(allFlashcards);
    const newFlashcard = await prisma.flashcard.create({
        data: {
            question: "What is a flashcard?",
            answer: "A card containing prompts and hints",
            details: "It is used to recall concepts",
            image: "no image",
        },
    });
}
main()
    .catch((e) => {
    throw e;
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=script.js.map