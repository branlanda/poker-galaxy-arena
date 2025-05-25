
import { useEffect } from 'react';
import { useNotifications } from './useNotifications';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';

// Hook to handle notification creation logic
export function useNotificationSystem() {
  const { createNotification } = useNotifications();
  const { user } = useAuth();

  const sendTournamentStartingNotification = async (
    tournamentId: string,
    tournamentName: string,
    startTime: string
  ) => {
    if (!user) return;

    try {
      await createNotification(
        'Tournament Starting Soon!',
        `${tournamentName} will start in 5 minutes. Get ready!`,
        'TOURNAMENT_STARTING',
        `/tournaments/${tournamentId}`,
        undefined,
        { tournament_id: tournamentId, start_time: startTime }
      );
    } catch (error) {
      console.error('Error sending tournament notification:', error);
    }
  };

  const sendGameInviteNotification = async (
    inviterName: string,
    tableName: string,
    tableId: string
  ) => {
    if (!user) return;

    try {
      await createNotification(
        'Game Invitation',
        `${inviterName} invited you to join ${tableName}`,
        'GAME_INVITE',
        `/table/${tableId}`,
        undefined,
        { table_id: tableId, inviter: inviterName }
      );
    } catch (error) {
      console.error('Error sending game invite notification:', error);
    }
  };

  const sendAchievementNotification = async (
    achievementName: string,
    description: string,
    points: number
  ) => {
    if (!user) return;

    try {
      await createNotification(
        'Achievement Unlocked!',
        `You earned "${achievementName}" - ${description} (+${points} XP)`,
        'ACHIEVEMENT',
        '/profile',
        undefined,
        { achievement: achievementName, points }
      );
    } catch (error) {
      console.error('Error sending achievement notification:', error);
    }
  };

  const sendFriendRequestNotification = async (
    senderName: string,
    senderId: string
  ) => {
    if (!user) return;

    try {
      await createNotification(
        'Friend Request',
        `${senderName} sent you a friend request`,
        'FRIEND_REQUEST',
        `/profile?tab=friends`,
        undefined,
        { sender_id: senderId, sender_name: senderName }
      );
    } catch (error) {
      console.error('Error sending friend request notification:', error);
    }
  };

  const sendRewardNotification = async (
    rewardType: string,
    amount: number,
    description: string
  ) => {
    if (!user) return;

    try {
      await createNotification(
        'Reward Received!',
        `You received ${amount} ${rewardType} - ${description}`,
        'REWARD',
        '/funds',
        undefined,
        { reward_type: rewardType, amount, description }
      );
    } catch (error) {
      console.error('Error sending reward notification:', error);
    }
  };

  const sendDailyMissionCompleteNotification = async (
    missionName: string,
    reward: number
  ) => {
    if (!user) return;

    try {
      await createNotification(
        'Daily Mission Complete!',
        `You completed "${missionName}" and earned ${reward} chips!`,
        'REWARD',
        '/profile',
        undefined,
        { mission: missionName, reward_chips: reward }
      );
    } catch (error) {
      console.error('Error sending mission notification:', error);
    }
  };

  // Listen for tournament events to send notifications
  useEffect(() => {
    if (!user) return;

    const handleTournamentEvents = () => {
      // This would be connected to your tournament system
      // For now, it's just the structure for future implementation
    };

    handleTournamentEvents();
  }, [user]);

  return {
    sendTournamentStartingNotification,
    sendGameInviteNotification,
    sendAchievementNotification,
    sendFriendRequestNotification,
    sendRewardNotification,
    sendDailyMissionCompleteNotification
  };
}
