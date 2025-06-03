
import { lazy } from 'react';

// Poker Game Components
export const LazyGameTable = lazy(() => import('@/components/poker/game/GameTable').then(module => ({ default: module.GameTable })));
export const LazyGameModal = lazy(() => import('@/components/poker/game/GameModal').then(module => ({ default: module.GameModal })));
export const LazyPokerGame = lazy(() => import('@/components/poker/PokerGame'));

// Admin Components
export const LazyAdminDashboard = lazy(() => import('@/pages/Admin/Dashboard'));
export const LazyUserTable = lazy(() => import('@/components/admin/UserTable'));
export const LazyLedgerTable = lazy(() => import('@/components/admin/LedgerTable'));

// Funds Components
export const LazyPaymentIntegration = lazy(() => import('@/components/payments/PaymentIntegration'));
export const LazyKycVerification = lazy(() => import('@/components/kyc/KycVerification'));

// Tournament Components
export const LazyTournamentLobby = lazy(() => import('@/pages/Tournaments/TournamentLobby'));
export const LazyTournamentDetail = lazy(() => import('@/pages/Tournaments/TournamentDetail'));

// Charts and Analytics
export const LazyRakeChart = lazy(() => import('@/components/admin/RakeChart'));
export const LazyTransactionVolumeChart = lazy(() => import('@/components/admin/TransactionVolumeChart'));

// Hand History
export const LazyHandHistoryList = lazy(() => import('@/components/handHistory/HandHistoryList'));
export const LazyHandReplayViewer = lazy(() => import('@/components/handHistory/HandReplayViewer'));
