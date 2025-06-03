
# 📚 API Documentation

## Supabase Database Schema

### Core Tables

#### `lobby_tables`
Manages poker table listings in the lobby.

```sql
CREATE TABLE lobby_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  table_type TEXT NOT NULL DEFAULT 'CASH',
  small_blind NUMERIC NOT NULL,
  big_blind NUMERIC NOT NULL,
  min_buy_in NUMERIC NOT NULL,
  max_buy_in NUMERIC NOT NULL,
  max_players SMALLINT NOT NULL DEFAULT 9,
  current_players SMALLINT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'WAITING',
  is_private BOOLEAN NOT NULL DEFAULT false,
  password TEXT,
  creator_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Endpoints:**
- `GET /api/tables` - List all active tables
- `POST /api/tables` - Create new table
- `PUT /api/tables/:id` - Update table
- `DELETE /api/tables/:id` - Delete table

#### `players`
User profiles and authentication data.

```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alias TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  kyc_level SMALLINT NOT NULL DEFAULT 0,
  last_login_at TIMESTAMPTZ,
  show_public_stats BOOLEAN DEFAULT false
);
```

**Endpoints:**
- `GET /api/players/:id` - Get player profile
- `PUT /api/players/:id` - Update player profile
- `POST /api/players/register` - Register new player

#### `hands`
Poker hand history and audit trail.

```sql
CREATE TABLE hands (
  id BIGINT PRIMARY KEY,
  table_id BIGINT NOT NULL,
  hand_no BIGINT NOT NULL,
  players_json JSONB NOT NULL,
  community_json JSONB NOT NULL,
  actions_json JSONB NOT NULL,
  winners_json JSONB NOT NULL,
  pot NUMERIC NOT NULL,
  rake NUMERIC NOT NULL DEFAULT 0,
  table_kind CHAR(1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Endpoints:**
- `GET /api/hands/:id` - Get hand details
- `GET /api/hands/player/:playerId` - Get player hand history
- `POST /api/hands/analyze` - Submit hand for analysis

### Real-time Subscriptions

#### Table Updates
```typescript
supabase
  .channel('table-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'lobby_tables'
  }, (payload) => {
    // Handle table changes
  })
  .subscribe();
```

#### Game Events
```typescript
supabase
  .channel(`game-${tableId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'hands',
    filter: `table_id=eq.${tableId}`
  }, (payload) => {
    // Handle game state changes
  })
  .subscribe();
```

## Frontend API Hooks

### Authentication
```typescript
import { useAuth } from '@/stores/auth';

const { user, login, logout, register } = useAuth();
```

### Game Management
```typescript
import { usePokerGame } from '@/hooks/usePokerGame';

const {
  gameState,
  playerActions,
  joinTable,
  leaveTable,
  placeBet,
  fold,
  call,
  raise
} = usePokerGame(tableId);
```

### Table Operations
```typescript
import { useLobbyTables } from '@/hooks/useLobbyTables';

const {
  tables,
  loading,
  createTable,
  joinTable,
  refreshTables
} = useLobbyTables();
```

## Error Handling

### API Error Responses
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}
```

### Common Error Codes
- `AUTH_REQUIRED` - Authentication needed
- `INSUFFICIENT_FUNDS` - Not enough chips
- `TABLE_FULL` - Table at capacity
- `INVALID_ACTION` - Action not allowed
- `TIMEOUT` - Action timeout

## Rate Limiting

- **Authentication:** 5 requests/minute
- **Game Actions:** 30 requests/minute
- **Table Creation:** 2 requests/minute
- **Chat Messages:** 10 requests/minute

## WebSocket Events

### Client to Server
```typescript
// Join table
socket.emit('join-table', { tableId, buyIn });

// Game actions
socket.emit('player-action', {
  type: 'BET',
  amount: 100,
  tableId
});

// Chat message
socket.emit('chat-message', {
  message: 'Hello!',
  tableId
});
```

### Server to Client
```typescript
// Game state update
socket.on('game-state', (gameState) => {
  // Update UI
});

// Player action
socket.on('player-action', (action) => {
  // Show action in UI
});

// Chat message
socket.on('chat-message', (message) => {
  // Display message
});
```
