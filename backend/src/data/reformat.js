const fs = require("fs");
const rawData = require("./science_and_nature.json");

const transformedData = rawData.map((item) => {
    return {
        question: item.question,
        answers: item.answers,
        correctAnswer: item.answers[item.answer],
        category: item.category_id
    };
});

fs.writeFileSync("./transformed-data.json", JSON.stringify(transformedData, null, 2), "utf-8");

console.log("Done!")