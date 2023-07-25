import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const characters = await prisma.character.findMany({});
    return new NextResponse(JSON.stringify(characters), { status: 200 });
  } catch (error) {
    console.log(error);
  }
}
