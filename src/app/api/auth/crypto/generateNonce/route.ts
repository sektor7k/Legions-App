import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { publicAddress, email } = reqBody; // Email kullanıcı tarafından opsiyonel olarak sağlanabilir

    console.log("PUBLIC ADDRESS:", publicAddress);

    const nonce = crypto.randomBytes(32).toString("hex");
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60);

    await connectDB();

    const updateFields: Record<string, any> = {
      "wallets.evm": publicAddress,
      "cryptoLoginNonce.nonce": nonce,
      "cryptoLoginNonce.expires": expires,
    };

    // Eğer Metamask değilse email'i ekle
    if (email) {
      updateFields["email"] = email;
    }

    const user = await User.findOneAndUpdate(
      { "wallets.evm": publicAddress }, // Metamask adresi ile kullanıcıyı bul
      {
        $set: updateFields, // Güncellemeler
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      nonce,
      expires: expires.toISOString(),
    });
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

