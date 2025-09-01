import { db } from "@/src/lib/db";
import { organizations } from "@/src/lib/db/schema/organizations";
import { auth } from "@/auth";
import { and, eq, asc, ilike, ne } from "drizzle-orm";

export async function GET(req, res) {
  const session = await auth();
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const page = +searchParams.get("page") || 1;
  const limit = +searchParams.get("limit") || 10;
  const search = searchParams.get("search");

  // Build where conditions
  let whereConditions = eq(organizations.user_id, session.user.id);

  if (search && search.trim()) {
    whereConditions = and(
      eq(organizations.user_id, session.user.id),
      ilike(organizations.name, `%${search.trim()}%`)
    );
  }

  const totalUsers = await db.$count(organizations, whereConditions);

  const data = await db
    .select()
    .from(organizations)
    .where(whereConditions)
    .orderBy(asc(organizations.created_at))
    .offset((page - 1) * limit)
    .limit(limit);

  return Response.json(
    {
      data,
      total: totalUsers,
      page: parseInt(page),
      limit: parseInt(limit),
    },
    { status: 200 }
  );
}

export async function POST(req, res) {
  const session = await auth();
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    email,
    phone,
    gstin,
    pan,
    country,
    state,
    city,
    postal_code,
    address_line1,
    address_line2,
    currency,
    logo_url,
  } = body;

  if (!name || !phone || !email) {
    return Response.json(
      { error: "Name, phone, and email are required" },
      { status: 400 }
    );
  }

  // Check if name already exists for this user
  const existingNameUser = await db
    .select()
    .from(organizations)
    .where(
      and(
        eq(organizations.user_id, session.user.id),
        eq(organizations.name, name.trim())
      )
    )
    .limit(1);

  if (existingNameUser.length > 0) {
    return Response.json(
      { error: "A user with this name already exists" },
      { status: 409 }
    );
  }

  const newUser = {
    name: name.trim(), // Keep original case for names
    phone: phone.trim(),
    email: email.trim().toLowerCase(),
    gstin,
    pan,
    country,
    state,
    city,
    postal_code,
    address_line1,
    address_line2,
    currency,
    logo_url,
    user_id: session.user.id,
  };

  try {
    const client = await db.insert(organizations).values(newUser).returning();
    return Response.json(client[0], { status: 201 });
  } catch (error) {
    console.error("Error creating organization:", error);
    return Response.json(
      { error: "Failed to create organization" },
      { status: 500 }
    );
  }
}

export async function PUT(req, res) {
  const session = await auth();
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const {
    id,
    name,
    phone,
    email,
    gstin,
    pan,
    country,
    state,
    city,
    postal_code,
    address_line1,
    address_line2,
    currency,
    logo_url,
  } = body;
  if (!id || !name || !phone || !email) {
    return Response.json(
      { error: "ID, name, phone, and email are required" },
      { status: 400 }
    );
  }

  // Check if name already exists for this user (excluding current record)
  const existingNameUser = await db
    .select()
    .from(organizations)
    .where(
      and(
        eq(organizations.user_id, session.user.id),
        eq(organizations.name, name.trim()),
        ne(organizations.id, id)
      )
    )
    .limit(1);

  if (existingNameUser.length > 0) {
    return Response.json(
      { error: "A user with this name already exists" },
      { status: 409 }
    );
  }

  const updatedUser = {
    name: name.trim(), // Keep original case for names
    phone: phone.trim(),
    email: email.trim().toLowerCase(),
    gstin,
    pan,
    country,
    state,
    city,
    postal_code,
    address_line1,
    address_line2,
    currency,
    logo_url,
  };
  const client = await db
    .update(organizations)
    .set(updatedUser)
    .where(eq(organizations.id, id))
    .returning();
  return Response.json(client[0], { status: 200 });
}

export async function DELETE(req, res) {
  const session = await auth();
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id } = body;

  const client = await db
    .delete(organizations)
    .where(
      and(eq(organizations.id, id), eq(organizations.user_id, session.user.id))
    )
    .returning();

  return Response.json(client[0], { status: 200 });
}
