import { z } from "zod";

/**
 * Schema for sign-in validation
 */
export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters"),
});

/**
 * Schema for sign-up validation
 */
export const signUpSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    email: z
      .string({ required_error: "Email is required" })
      .min(1, "Email is required")
      .email("Invalid email format"),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters"),
    confirmPassword: z
      .string({ required_error: "Please confirm your password" })
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Validate sign-in data
 * @param {object} data - The data to validate
 * @returns {object} - Validation result
 */
export function validateSignIn(data) {
  try {
    const validated = signInSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    console.error("Sign-in validation error:", error);

    if (
      error instanceof z.ZodError &&
      error.errors &&
      Array.isArray(error.errors)
    ) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: err.path ? err.path.join(".") : "unknown",
          message: err.message || "Validation error",
        })),
      };
    }

    return {
      success: false,
      errors: [{ field: "general", message: "Validation failed" }],
    };
  }
}

/**
 * Validate sign-up data
 * @param {object} data - The data to validate
 * @returns {object} - Validation result
 */
export function validateSignUp(data) {
  try {
    const validated = signUpSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    console.error("Sign-up validation error:", error);

    if (
      error instanceof z.ZodError &&
      error.errors &&
      Array.isArray(error.errors)
    ) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: err.path ? err.path.join(".") : "unknown",
          message: err.message || "Validation error",
        })),
      };
    }

    return {
      success: false,
      errors: [{ field: "general", message: "Validation failed" }],
    };
  }
}
