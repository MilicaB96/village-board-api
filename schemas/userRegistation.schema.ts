const z = require("zod");

const userRegistrationSchema = z
  .object({
    username: z
      .string({
        error: (issue: any) =>
          issue.input === undefined
            ? "Username is required"
            : "Username must be a string",
      })
      .min(5, {
        error: "Username is too short, must be at least 3 characters long",
      })
      .max(100, {
        error: "Username is too long, must be less than 100 characters long",
      }),
    email: z.email({
      error: (issue: any) =>
        issue.input === undefined ? "Email is required" : "Must be an email",
    }),
    password: z
      .string({
        error: (issue: any) =>
          issue.input === undefined
            ? "Password is required"
            : "Password must be a string",
      })
      .min(8, { error: "Must be at least 8 characters long" })
      .max(255, { error: "Must be less than 255 characters long" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
        error:
          "Password must contain at least one uppercase letter, one lower case letter, and a number",
      }),
    confirmPassword: z.string({
      error: (issue: any) =>
        issue.input === undefined
          ? "Password confirmation is required"
          : "Must be a string",
    }),
  })
  .refine(
    (data: { password: string; confirmPassword: string }) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
    }
  );

module.exports = userRegistrationSchema;
