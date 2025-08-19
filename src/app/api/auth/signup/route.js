import { NextResponse } from "next/server";
import { createUser } from "../../../../lib/db/users.js";
import { validateSignUp } from "../../../../lib/utils/validation.js";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received signup request:", {
      ...body,
      password: "[REDACTED]",
      confirmPassword: "[REDACTED]",
    });

    // Validate input data
    const validation = validateSignUp(body);
    console.log("Validation result:", validation);

    if (!validation.success) {
      console.log("Validation errors:", validation.errors);
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Create user
    const user = await createUser({ name, email, password });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    console.error("Error stack:", error.stack);

    if (error.message === "User with this email already exists") {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
