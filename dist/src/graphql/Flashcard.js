"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sort = exports.CardOrderByInput = exports.AddFlashcard = exports.FlashcardQuery = exports.Flashcard = void 0;
const nexus_1 = require("nexus");
const apollo_server_1 = require("apollo-server");
exports.Flashcard = (0, nexus_1.objectType)({
    name: "Flashcard",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("question");
        t.nonNull.string("answer");
        t.nonNull.string("details");
        t.boolean("isDone");
        t.string("image");
        t.field("cardOwner", {
            type: "User",
            resolve(parent, args, context) {
                return context.prisma.flashcard
                    .findUnique({
                    where: { id: parent.id },
                })
                    .cardOwner();
            },
        });
    },
});
exports.FlashcardQuery = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("allFlashcards", {
            type: "Flashcard",
            args: {
                filter: (0, nexus_1.stringArg)(),
                offset: (0, nexus_1.intArg)(),
                limit: (0, nexus_1.intArg)(),
                orderBy: (0, nexus_1.arg)({ type: (0, nexus_1.list)((0, nexus_1.nonNull)(exports.CardOrderByInput)) }),
            },
            resolve(parent, args, context, info) {
                const where = args.filter
                    ? {
                        OR: [
                            { question: { contains: args.filter } },
                            { answer: { contains: args.filter } },
                            { details: { contains: args.filter } },
                        ],
                    }
                    : {};
                return context.prisma.flashcard.findMany({
                    where,
                    orderBy: args === null || args === void 0 ? void 0 : args.orderBy,
                    skip: args === null || args === void 0 ? void 0 : args.offset,
                    take: args === null || args === void 0 ? void 0 : args.limit,
                });
            },
        });
    },
});
exports.AddFlashcard = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("post", {
            type: "Flashcard",
            args: {
                question: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                answer: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                details: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                image: (0, nexus_1.stringArg)(),
            },
            resolve(parent, args, context) {
                const { question, answer, details } = args;
                const { userId } = context;
                if (!userId) {
                    throw new apollo_server_1.ApolloError("Please signin to create a flashcard", "UNAUTHORIZED");
                }
                const newFlashcard = context.prisma.flashcard.create({
                    data: {
                        question: question,
                        answer: answer,
                        details: details,
                        image: args === null || args === void 0 ? void 0 : args.image,
                        cardOwner: { connect: { id: userId } },
                    },
                });
                return newFlashcard;
            },
        });
        t.nonNull.field("updateFlashcard", {
            type: "Flashcard",
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                question: (0, nexus_1.nullable)((0, nexus_1.stringArg)()),
                answer: (0, nexus_1.nullable)((0, nexus_1.stringArg)()),
                details: (0, nexus_1.nullable)((0, nexus_1.stringArg)()),
                isDone: (0, nexus_1.nullable)((0, nexus_1.booleanArg)()),
                image: (0, nexus_1.nullable)((0, nexus_1.stringArg)()),
            },
            resolve(parent, args, context) {
                const { id, question, answer, details, isDone, image } = args;
                const { userId } = context;
                if (!userId) {
                    throw new apollo_server_1.ApolloError("Please signin to update a flashcard", "UNAUTHORIZED");
                }
                const updatedFlashcard = context.prisma.flashcard.update({
                    where: { id },
                    data: {
                        ...(question && { question }),
                        ...(answer && { answer }),
                        ...(details && { details }),
                        ...(isDone != null && { isDone }),
                        ...(image && { image }),
                    },
                });
                return updatedFlashcard;
            },
        });
        t.nonNull.field("deleteFlashcard", {
            type: "Flashcard",
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            resolve(parent, args, context) {
                const { id } = args;
                const { userId } = context;
                if (!userId) {
                    throw new apollo_server_1.ApolloError("Please signin to delete a flashcard", "UNAUTHORIZED");
                }
                return context.prisma.flashcard.delete({
                    where: { id },
                });
            },
        });
    },
});
exports.CardOrderByInput = (0, nexus_1.inputObjectType)({
    name: "CardOrderByInput",
    definition(t) {
        t.field("id", { type: exports.Sort });
        t.field("question", { type: exports.Sort });
        t.field("answer", { type: exports.Sort });
        t.field("details", { type: exports.Sort });
        t.field("createdAt", { type: exports.Sort });
    },
});
exports.Sort = (0, nexus_1.enumType)({
    name: "Sort",
    members: ["asc", "desc"],
});
//# sourceMappingURL=Flashcard.js.map