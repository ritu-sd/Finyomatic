import { eq } from "drizzle-orm";
import { db } from "./index.js";
import { users } from "./schema/users.js";
import { hashPassword, comparePassword } from "../utils/password.js";

/**
 * Create a new user with hashed password
 * @param {object} userData - User data including name, email, and password
 * @returns {Promise<object>} - Created user object (without password)
 */
export async function createUser({ name, email, password }) {
  try {
    const hashedPassword = await hashPassword(password);

    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return user;
  } catch (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      throw new Error("User with this email already exists");
    }
    throw error;
  }
}

/**
 * Find user by email
 * @param {string} email - User's email
 * @returns {Promise<object|null>} - User object or null if not found
 */
export async function findUserByEmail(email) {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      password: users.password,
      image: users.image,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user || null;
}

/**
 * Verify user credentials
 * @param {string} email - User's email
 * @param {string} password - Plain text password
 * @returns {Promise<object|null>} - User object if credentials are valid, null otherwise
 */
export async function verifyCredentials(email, password) {
  const user = await findUserByEmail(email);

  if (!user || !user.password) {
    return null;
  }

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    return null;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Update user's last login time
 * @param {string} userId - User's ID
 * @returns {Promise<void>}
 */
export async function updateLastLogin(userId) {
  await db
    .update(users)
    .set({ updatedAt: new Date() })
    .where(eq(users.id, userId));
}
