
// Remove lazy loading for components that should load immediately
// since they're being used directly in routes
import TournamentLobby from './TournamentLobby';
import TournamentDetail from './TournamentDetail';
import { TournamentCreateDialog } from './TournamentCreateDialog';

export { TournamentLobby, TournamentDetail, TournamentCreateDialog };
export default TournamentLobby;
