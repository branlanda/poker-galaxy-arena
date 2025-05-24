
import { lazy } from 'react';

const TournamentLobby = lazy(() => import('./TournamentLobby'));
const TournamentDetail = lazy(() => import('./TournamentDetail'));
const TournamentCreateDialog = lazy(() => import('./TournamentCreateDialog').then(module => ({ default: module.TournamentCreateDialog })));

export { TournamentLobby, TournamentDetail, TournamentCreateDialog };
export default TournamentLobby;
