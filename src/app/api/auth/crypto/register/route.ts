import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        console.log("Connecting to database...");
        await connectDB();
        console.log("Connected to database.");

        const reqBody = await request.json();
        const { publicAddress, signedNonce } = reqBody;
        console.log("Received request:", { publicAddress, signedNonce });

        // Kullanıcıyı public address ile bul
        const userFound = await User.findOne({ "wallets.evm": publicAddress });
        console.log("User found:", userFound);

        if (!userFound || !userFound.cryptoLoginNonce) {
            console.log("User not found or nonce not generated.");
            return NextResponse.json({ message: "User not found or nonce not generated" }, { status: 400 });
        }

        const { nonce, expires } = userFound.cryptoLoginNonce;
        console.log("Nonce found:", { nonce, expires });

        // Nonce süresi dolmuş mu kontrol et
        if (expires < new Date()) {
            console.log("Nonce expired.");
            return NextResponse.json({ message: "Nonce expired" }, { status: 400 });
        }

        // İmzalanmış nonce'u doğrula
        console.log("Verifying signed nonce...");
        const signerAddress = ethers.verifyMessage(nonce, signedNonce);
        console.log("Signer address:", signerAddress);

        if (signerAddress !== publicAddress) {
            console.log("Invalid signature. Signer address does not match public address.");
            return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
        }

        // Kullanıcıyı kaydet veya güncelle
        userFound.cryptoLoginNonce = undefined; // Nonce'u temizle
        userFound.isVerified = true;
        await userFound.save();
        console.log("User updated and verified.");

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        console.log("Error occurred:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
