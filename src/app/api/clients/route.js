import { db } from "@/src/lib/db";
import { clients } from "@/src/lib/db/schema/clients";
import { auth } from "@/auth";
import { and, eq, asc, ilike } from "drizzle-orm";

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
  let whereConditions = eq(clients.user_id, session.user.id);

  if (search && search.trim()) {
    whereConditions = and(
      eq(clients.user_id, session.user.id),
      ilike(clients.name, `%${search.trim()}%`)
    );
  }

  const totalClients = await db.$count(clients, whereConditions);

  const data = await db
    .select()
    .from(clients)
    .where(whereConditions)
    .orderBy(asc(clients.created_at))
    .offset((page - 1) * limit)
    .limit(limit);

  return Response.json(
    {
      data,
      total: totalClients,
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
    phone,
    email,
    country,
    state,
    city,
    address,
    postal_code,
    tax_number,
  } = body;
  if (!name || !phone || !email) {
    return Response.json(
      { error: "Name, phone, and email are required" },
      { status: 400 }
    );
  }
  const newClient = {
    name,
    phone,
    email,
    country,
    state,
    city,
    address,
    postal_code,
    tax_number,
    user_id: session.user.id,
  };
  const client = await db.insert(clients).values(newClient).returning();
  return Response.json(client[0], { status: 201 });
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
    email,
    phone,
    tax_number,
    country,
    city,
    state,
    address,
    postal_code,
  } = body;
  if (!id || !name || !phone || !email) {
    return Response.json(
      { error: "ID, name, phone, and email are required" },
      { status: 400 }
    );
  }
  const updatedClient = {
    name,
    email,
    phone,
    tax_number,
    country,
    city,
    state,
    address,
    postal_code,
  };
  const client = await db
    .update(clients)
    .set(updatedClient)
    .where(eq(clients.id, id))
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
    .delete(clients)
    .where(and(eq(clients.id, id), eq(clients.user_id, session.user.id)))
    .returning();

  return Response.json(client[0], { status: 200 });
}
