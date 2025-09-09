import { db } from "@/src/lib/db";
import { banks } from "@/src/lib/db/schema/banks";
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
  let whereConditions = eq(banks.userId, session.user.id);

  if (search && search.trim()) {
    whereConditions = and(
      eq(banks.userId, session.user.id),
      ilike(banks.bankName, `%${search.trim()}%`)
    );
  }

  const totalbank = await db.$count(banks, whereConditions);

  const data = await db
    .select()
    .from(banks)
    .where(whereConditions)
    .orderBy(asc(banks.createdAt))
    .offset((page - 1) * limit)
    .limit(limit);

  return Response.json(
    {
      data,
      total: totalbank,
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
  const { bankName, accountName, accountNumber, ifscCode } = body;

  if (!bankName || !accountName || !accountNumber || !ifscCode) {
    return Response.json(
      {
        error: "BankName, AccountName, AccountNumber and IfscCode are required",
      },
      { status: 400 }
    );
  }

  const existingAccount = await db
    .select()
    .from(banks)
    .where(
      and(
        eq(banks.userId, session.user.id),
        eq(banks.accountNumber, accountNumber)
      )
    )
    .limit(1);

  if (existingAccount.length > 0) {
    return Response.json(
      {
        error:
          "Account number already exists. Please use a different account number.",
      },
      { status: 409 }
    );
  }

  const newAccount = {
    bankName,
    accountName,
    accountNumber,
    ifscCode,
    userId: session.user.id,
  };

  const result = await db.insert(banks).values(newAccount).returning();
  return Response.json(result[0], { status: 201 });
}

export async function PUT(req, res) {
  const session = await auth();
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id, bankName, accountName, accountNumber, ifscCode } = body;
  if (!id || !bankName || !accountName || !accountNumber || !ifscCode) {
    return Response.json(
      {
        error:
          "ID, BankName, AccountName, AccountNumber and IfscCode are required",
      },
      { status: 400 }
    );
  }
  const updatedBank = {
    bankName,
    accountName,
    accountNumber,
    ifscCode,
    updatedAt: new Date(),
  };
  const result = await db
    .update(banks)
    .set(updatedBank)
    .where(and(eq(banks.id, id), eq(banks.userId, session.user.id)))
    .returning();
  return Response.json(result[0], { status: 200 });
}

export async function DELETE(req, res) {
  const session = await auth();
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id } = body;

  const result = await db
    .delete(banks)
    .where(and(eq(banks.id, id), eq(banks.userId, session.user.id)))
    .returning();

  return Response.json(result[0], { status: 200 });
}
