const zod = require("zod");

const postSchema = zod.object({
  title: zod
    .string({
      error: (issue: any) =>
        issue.input === undefined
          ? "Title is required"
          : "Title must be a string",
    })
    .min(1, {
      message: "Title cannot be empty",
    })
    .max(150, {
      message: "Title must be less than 150 characters long",
    }),
  body: zod
    .string({
      error: (issue: any) =>
        issue.input === undefined
          ? "Body is required"
          : "Body must be a string",
    })
    .min(1, {
      message: "Body cannot be empty",
    })
    .max(500, {
      message: "Body must be less than 500 characters long",
    }),
});

module.exports = postSchema;
