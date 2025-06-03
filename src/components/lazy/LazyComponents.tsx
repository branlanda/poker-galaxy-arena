
import { lazy } from 'react';

// Poker Game Components
export const LazyGameTable = lazy(() => import('@/components/poker/game/GameTable').then(module => ({ default: module.GameTable })));
export const LazyGameModal = lazy(() => import('@/components/poker/game/GameModal').then(module => ({ default: module.GameModal })));
export const LazyPokerGame = lazy(() => import('@/components/poker/PokerGame').then(module => ({ default: module.default })));

// Admin Components
export const LazyAdminDashboard = lazy(() => import('@/pages/Admin/Dashboard').then(module => ({ default: module.default })));
export const LazyUserTable = lazy(() => import('@/components/admin/UserTable').then(module => ({ default: module.default })));
export const LazyLedgerTable = lazy(() => import('@/components/admin/LedgerTable').then(module => ({ default: module.default })));

// Funds Components
export const LazyPaymentIntegration = lazy(() => import('@/components/payments/PaymentIntegration').then(module => ({ default: module.default })));
export const LazyKycVerification = lazy(() => import('@/components/kyc/KycVerification').then(module => ({ default: module.default })));

// Tournament Components
export const LazyTournamentLobby = lazy(() => import('@/pages/Tournaments/TournamentLobby').then(module => ({ default: module.default })));
export const LazyTournamentDetail = lazy(() => import('@/pages/Tournaments/TournamentDetail').then(module => ({ default: module.default })));

// Charts and Analytics
export const LazyRakeChart = lazy(() => import('@/components/admin/RakeChart').then(module => ({ default: module.default })));
export const LazyTransactionVolumeChart = lazy(() => import('@/components/admin/TransactionVolumeChart').then(module => ({ default: module.default })));

// Hand History
export const LazyHandHistoryList = lazy(() => import('@/components/handHistory/HandHistoryList').then(module => ({ default: module.default })));
export const LazyHandReplayViewer = lazy(() => import('@/components/handHistory/HandReplayViewer').then(module => ({ default: module.default })));
