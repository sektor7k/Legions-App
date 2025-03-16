"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import ErrorAnimation from "@/components/errorAnimation";
import LoadingAnimation from "@/components/loadingAnimation";

interface AnnounceTabProps {
  announcements: any[] | null;
  mutate?: () => void;
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

export default function AnnounceTab({ announcements, mutate }: AnnounceTabProps) {
  const { data: session } = useSession();

  // Duyuruları okundu olarak işaretleyecek fonksiyon
  const handleMarkAsRead = async (announcementId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/markAsReadAnnouncement`,
        {
          announcementId,
          userId: session?.user?.id,
        }
      );
      mutate && mutate();
    } catch (error) {
      console.error("Error marking announcement as read:", error);
    }
  };

  // Announce tabı açıldığında (veya veriler yüklendiğinde) okunmamış duyuruları işaretle
  useEffect(() => {
    if (announcements && session?.user?.id) {
      announcements.forEach((announcement: any) => {
        const recipientRecord = announcement.recipients.find(
          (r: any) => r.recipient.toString() === session.user.id
        );
        if (recipientRecord && !recipientRecord.isRead) {
          handleMarkAsRead(announcement._id);
        }
      });
    }
  }, [announcements, session]);

  if (!announcements) {
    return (
      <div className="flex h-60 justify-center items-center">
        <LoadingAnimation />
      </div>
    );
  }

  // Okunmamış duyuru sayısını hesaplıyoruz
  const unreadCount = announcements.filter((announcement: any) =>
    announcement.recipients.some(
      (r: any) => r.recipient.toString() === session?.user.id && !r.isRead
    )
  ).length;

  return (
    <div className="space-y-4 overflow-y-auto max-h-96 scrollbar-hide">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Announcements</h3>
        {unreadCount > 0 && (
          <Badge className="rounded-full bg-red-500 w-5 h-5 p-1.5">
            {unreadCount}
          </Badge>
        )}
      </div>
      {announcements.length === 0 ? (
        <p className="text-center text-gray-500">
          No announcements available.
        </p>
      ) : (
        announcements.map((announcement: any, index: number) => {
          return (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-800 border border-gray-900 bg-opacity-40 backdrop-blur-sm shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {announcement.tournamentId?.organizerAvatar ? (
                    <img
                      src={announcement.tournamentId.organizerAvatar}
                      alt={announcement.tournamentId.organizer}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-white">
                      <span className="text-white font-bold">
                        {announcement.tournamentId?.organizer?.[0] || "O"}
                      </span>
                    </div>
                  )}
                  <span className="text-white font-semibold">
                    {announcement.tournamentId?.organizer}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {formatTime(new Date(announcement.createdAt))}
                </span>
              </div>
              <div className="mt-2 text-white text-sm">
                {announcement.message}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
