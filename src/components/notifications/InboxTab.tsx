// components/InboxTab.tsx
"use client";

import React from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR from "swr";
import ErrorAnimation from "@/components/errorAnimation";
import LoadingAnimation from "@/components/loadingAnimation";

interface InboxTabProps {
    invites: any;
    error: any;
    mutate: () => void;
}

function formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 0) return `${weeks}w ago`;
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
}

export default function InboxTab({ invites, error, mutate }: InboxTabProps) {
    function showErrorToast(message: string): void {
        toast({
            variant: "destructive",
            title: "Invite Reject",
            description: message,
        });
    }

    function showToast(message: string): void {
        toast({
            variant: "default",
            title: "Invite Accept",
            description: message,
        });
    }

    const handleAcceptInvite = async (inviteId: string) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tournament/invite/replyInvite`, {
                id: inviteId,
                reply: "accept",
            });
            showToast("Invite accepted");
            mutate();
        } catch (error: any) {
            if (error.response) {
                console.error("Response error:", error.response.data);
            } else if (error.request) {
                console.error("Request error:", error.request);
            } else {
                console.error("Error message:", error.message);
            }
            showErrorToast(error.response?.data?.message || "An error occurred.");
        }
    };

    const handleRejectInvite = async (inviteId: string) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tournament/invite/replyInvite`, {
                id: inviteId,
                reply: "reject",
            });
            showErrorToast("Invite rejected successfully");
            mutate();
        } catch (error: any) {
            showErrorToast("Error rejecting invite");
            console.error("Error processing invite:", error);
        }
    };

    // Hata ve yüklenme durumlarının UI gösterimi
    if (error?.response?.status === 404) {
        return (
            <div className="flex justify-center items-center">
                <p className="text-xl text-gray-400 pt-12">Inbox Empty</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-60 justify-center items-center">
                <ErrorAnimation />
            </div>
        );
    }

    if (!invites) {
        return (
            <div className="flex h-60 justify-center items-center">
                <LoadingAnimation />
            </div>
        );
    }

    if (invites.length === 0) {
        return <p className="text-center text-gray-500">No inbox available.</p>;
    }

    return (
        <div className="space-y-4 overflow-y-auto max-h-96 scrollbar-hide">
            {invites.map((invite: any, index: number) => (
  <div key={index}>
    {invite.inviteType === "leader" && (
      <div className="p-6 rounded-lg bg-gray-800 border border-gray-900 bg-opacity-40 backdrop-blur-sm mb-4 shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center space-x-4">
          <img
            src={invite.userId.image}
            alt={invite.userId.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">{invite.userId.username}</h2>
            <p className="text-sm text-gray-300">
              Wants to join your team:{" "}
              <span className="font-bold text-yellow-400">{invite.teamId.teamName}</span>
            </p>
          </div>
          <img
            src={invite.teamId.teamImage}
            alt={invite.teamId.teamName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-gray-400">{formatTime(new Date(invite.invitedAt))}</p>
          <div className="flex space-x-2">
            {invite.status === "pending" ? (
              <>
                <Button
                  variant="outline"
                  className="text-green-500 border-green-500"
                  onClick={() => handleAcceptInvite(invite._id)}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500"
                  onClick={() => handleRejectInvite(invite._id)}
                >
                  Reject
                </Button>
              </>
            ) : (
              <Badge
                variant="default"
                className={`${
                  invite.status === "accepted" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
              </Badge>
            )}
          </div>
        </div>
      </div>
    )}

    {invite.inviteType === "member" && (
      <div className="p-6 rounded-lg bg-gray-800 border border-gray-900 bg-opacity-40 backdrop-blur-sm mb-4 shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl">
        <h2 className="text-xl font-bold text-white mb-2">🌟 New Team Invitation!</h2>
        <div className="flex items-center space-x-4">
          <img
            src={invite.leadId.image}
            alt={invite.leadId.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-300">
              You have been invited to join the team{" "}
              <span className="font-bold text-yellow-400">{invite.teamId.teamName}</span>{" "}
              as a <span className="font-bold text-green-400">Member</span>.
            </p>
          </div>
          <img
            src={invite.teamId.teamImage}
            alt={invite.teamId.teamName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-gray-400">{formatTime(new Date(invite.invitedAt))}</p>
          <div className="flex space-x-2">
            {invite.status === "pending" ? (
              <>
                <Button
                  variant="outline"
                  className="text-green-500 border-green-500"
                  onClick={() => handleAcceptInvite(invite._id)}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500"
                  onClick={() => handleRejectInvite(invite._id)}
                >
                  Reject
                </Button>
              </>
            ) : (
              <Badge
                variant="default"
                className={`${
                  invite.status === "accepted" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
              </Badge>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
))}

        </div>
    );
}
