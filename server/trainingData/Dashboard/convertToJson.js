import fs from "fs";

const html = fs.readFileSync(
    "dashboard-05.html",
    "utf8"
);

const trainingData = {
    input: {
        pageType: "dashboard",
        prompt:
            "Create a premium modern project management dashboard for a software development team. Include project progress, task statistics, team members, upcoming deadlines, project activity, and interactive task filtering."
    },

    output: {
        message:
            "A premium interactive project management dashboard for a software development team.",
        code: html
    }
};

fs.writeFileSync(
    "dashboard-05.json",
    JSON.stringify(trainingData, null, 2)
);

console.log(
    "dashboard-05.json created successfully!"
);