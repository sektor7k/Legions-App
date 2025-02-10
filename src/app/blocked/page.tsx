"use client";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function BlockedPage() {
  return (
    <div className="min-h-screen bg-bg-castrum flex flex-col justify-center items-center px-4 text-gray-100">
      <div className="max-w-md w-full bg-black/40 backdrop-blur-sm shadow-lg rounded-lg p-8 text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-red-700 mb-6" />
        <h1 className="text-2xl font-bold mb-4">Your Account is Blocked</h1>
        <p className="text-gray-300 mb-6">
          We're sorry, but your account has been blocked by our system. If you wish to appeal this decision, please send
          an email to the address below.
        </p>
        <div className="bg-gray-900 p-4 rounded-md mb-6">
          <p className="text-sm text-gray-300 font-medium">Contact for appeal:</p>
          <Link href="mailto:support@castrumlegions.com" className="text-gray-300 hover:underline">
            support@castrumlegions.com
          </Link>
        </div>
        <Button onClick={() => signOut({ callbackUrl: '/login' })}>
          Return to Login Page
        </Button>
      </div>
    </div>
  );
}
