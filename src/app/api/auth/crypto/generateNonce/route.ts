import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";



export async function POST(
  request: NextRequest
) {

const reqBody = await request.json();
  const { publicAddress } = reqBody;
  console.log("PUBLİC ADRESS", publicAddress)

   const nonce = crypto.randomBytes(32).toString("hex");

   const expires = new Date(new Date().getTime() + 1000 * 60 * 60);

   await connectDB();

  const user = await User.findOneAndUpdate(
    { "wallets.evm": publicAddress },
    {
      $set: {
        "wallets.evm": publicAddress,
        "cryptoLoginNonce.nonce": nonce,
        "cryptoLoginNonce.expires": expires,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return NextResponse.json({
    nonce,
    expires: expires.toISOString(),
  });

  
}
