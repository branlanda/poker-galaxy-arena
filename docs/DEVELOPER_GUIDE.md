
# 👨‍💻 Developer Guide

## Project Architecture

### Technology Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand
- **Database:** Supabase (PostgreSQL)
- **Real-time:** Supabase Realtime
- **Authentication:** Supabase Auth
- **Testing:** Vitest + Testing Library

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (shadcn/ui)
│   ├── auth/           # Authentication components
│   ├── lobby/          # Lobby-specific components
│   ├── poker/          # Game components
│   └── admin/          # Admin panel components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── stores/             # Zustand stores
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── lib/                # Third-party integrations
└── i18n/               # Internationalization
```

## Development Setup

### Prerequisites
```bash
node --version  # v18+
npm --version   # v8+
```

### Installation
```bash
# Clone repository
git clone <repository-url>
cd poker-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Configure Supabase
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Coding Standards

### TypeScript Guidelines

**Strict Type Safety:**
```typescript
// ✅ Good - Explicit types
interface GameState {
  players: Player[];
  currentPlayer: number;
  pot: number;
  phase: GamePhase;
}

// ❌ Bad - Any types
const gameState: any = {};
```

**Component Props:**
```typescript
// ✅ Good - Interface for props
interface PokerTableProps {
  players: Player[];
  onPlayerAction: (action: PlayerAction) => void;
  gameState: GameState;
}

const PokerTable: React.FC<PokerTableProps> = ({ 
  players, 
  onPlayerAction, 
  gameState 
}) => {
  // Component implementation
};
```

### React Best Practices

**Custom Hooks:**
```typescript
// ✅ Good - Custom hook for game logic
export function usePokerGame(tableId: string) {
  const [gameState, setGameState] = useState<GameState>();
  const [loading, setLoading] = useState(true);
  
  const placeBet = useCallback((amount: number) => {
    // Bet logic
  }, []);
  
  return { gameState, loading, placeBet };
}
```

**Component Composition:**
```typescript
// ✅ Good - Small, focused components
const PlayerCard = ({ player }: { player: Player }) => (
  <div className="player-card">
    <PlayerAvatar player={player} />
    <PlayerInfo player={player} />
    <PlayerActions player={player} />
  </div>
);
```

### State Management (Zustand)

**Store Structure:**
```typescript
interface GameStore {
  // State
  gameState: GameState | null;
  players: Player[];
  loading: boolean;
  
  // Actions
  setGameState: (state: GameState) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  
  // Async actions
  joinTable: (tableId: string) => Promise<void>;
  leaveTable: () => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  players: [],
  loading: false,
  
  setGameState: (gameState) => set({ gameState }),
  addPlayer: (player) => set((state) => ({
    players: [...state.players, player]
  })),
  
  joinTable: async (tableId) => {
    set({ loading: true });
    try {
      const response = await supabase
        .from('lobby_tables')
        .select('*')
        .eq('id', tableId)
        .single();
      
      // Handle response
    } finally {
      set({ loading: false });
    }
  }
}));
```

## Component Guidelines

### File Organization
```typescript
// ComponentName/
//   ├── index.tsx          // Main component
//   ├── ComponentName.tsx  // Implementation
//   ├── hooks.ts           // Component-specific hooks
//   ├── types.ts           // Component types
//   └── __tests__/         // Tests
//       └── ComponentName.test.tsx
```

### Component Template
```typescript
// components/poker/PokerTable/PokerTable.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import type { PokerTableProps } from './types';

export const PokerTable: React.FC<PokerTableProps> = ({
  players,
  gameState,
  onPlayerAction,
  className,
  ...props
}) => {
  return (
    <div 
      className={cn(
        "poker-table relative rounded-full bg-green-800",
        "border-4 border-yellow-600 shadow-2xl",
        className
      )}
      {...props}
    >
      {/* Component content */}
    </div>
  );
};
```

## Database Integration

### Supabase Queries
```typescript
// hooks/useTableData.ts
export function useTableData(tableId: string) {
  return useQuery({
    queryKey: ['table', tableId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lobby_tables')
        .select(`
          *,
          creator:players(id, alias)
        `)
        .eq('id', tableId)
        .single();
        
      if (error) throw error;
      return data;
    }
  });
}
```

### Real-time Subscriptions
```typescript
// hooks/useGameSubscription.ts
export function useGameSubscription(tableId: string) {
  useEffect(() => {
    const channel = supabase
      .channel(`table:${tableId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'hands',
        filter: `table_id=eq.${tableId}`
      }, (payload) => {
        // Handle game updates
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableId]);
}
```

## Testing Strategy

### Unit Tests
```typescript
// __tests__/PokerTable.test.tsx
import { render, screen } from '@testing-library/react';
import { PokerTable } from '../PokerTable';
import { mockPlayers, mockGameState } from '@/test/mocks';

describe('PokerTable', () => {
  it('renders all players', () => {
    render(
      <PokerTable
        players={mockPlayers}
        gameState={mockGameState}
        onPlayerAction={jest.fn()}
      />
    );
    
    expect(screen.getAllByTestId('player-seat')).toHaveLength(
      mockPlayers.length
    );
  });
  
  it('handles player actions', async () => {
    const onPlayerAction = jest.fn();
    const user = userEvent.setup();
    
    render(
      <PokerTable
        players={mockPlayers}
        gameState={mockGameState}
        onPlayerAction={onPlayerAction}
      />
    );
    
    await user.click(screen.getByText('Call'));
    
    expect(onPlayerAction).toHaveBeenCalledWith({
      type: 'CALL',
      playerId: expect.any(String)
    });
  });
});
```

### Integration Tests
```typescript
// __tests__/integration/gameFlow.test.tsx
import { renderWithProviders } from '@/test/utils';
import { GameRoom } from '@/pages/Game/GameRoom';

describe('Game Flow Integration', () => {
  it('completes full game cycle', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(<GameRoom tableId="test-table" />);
    
    // Wait for game to load
    await waitFor(() => {
      expect(screen.getByTestId('poker-table')).toBeInTheDocument();
    });
    
    // Join table
    await user.click(screen.getByText('Join Table'));
    
    // Place bet
    await user.click(screen.getByText('Bet'));
    await user.type(screen.getByLabelText('Bet Amount'), '100');
    await user.click(screen.getByText('Confirm'));
    
    // Verify game state update
    await waitFor(() => {
      expect(screen.getByText('Current Bet: $100')).toBeInTheDocument();
    });
  });
});
```

## Performance Guidelines

### Component Optimization
```typescript
// ✅ Good - Memoized expensive calculations
const PlayerStats = React.memo(({ player }: { player: Player }) => {
  const stats = useMemo(() => 
    calculatePlayerStats(player), 
    [player.id, player.gamesPlayed]
  );
  
  return <div>{/* Render stats */}</div>;
});

// ✅ Good - Debounced actions
const SearchTables = () => {
  const [query, setQuery] = useState('');
  
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      // Perform search
    }, 300),
    []
  );
  
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);
};
```

### Bundle Optimization
```typescript
// ✅ Good - Lazy loading
const AdminDashboard = lazy(() => import('@/pages/Admin/Dashboard'));
const TournamentDetail = lazy(() => import('@/pages/Tournaments/TournamentDetail'));

// ✅ Good - Dynamic imports
const loadChartLibrary = () => import('recharts');
```

## Security Best Practices

### Input Validation
```typescript
// utils/validation.ts
import { z } from 'zod';

export const betAmountSchema = z.number()
  .min(1, 'Minimum bet is $1')
  .max(1000000, 'Maximum bet is $1M');

export const tableNameSchema = z.string()
  .min(3, 'Table name must be at least 3 characters')
  .max(50, 'Table name must be less than 50 characters')
  .regex(/^[a-zA-Z0-9\s]+$/, 'Only alphanumeric characters allowed');
```

### RLS Policies
```sql
-- Enable RLS on sensitive tables
ALTER TABLE lobby_tables ENABLE ROW LEVEL SECURITY;

-- Policy for table access
CREATE POLICY "Users can view active tables" ON lobby_tables
  FOR SELECT USING (status = 'ACTIVE' OR status = 'WAITING');

CREATE POLICY "Users can only modify their own tables" ON lobby_tables
  FOR UPDATE USING (creator_id = auth.uid());
```

## Debugging

### Development Tools
```typescript
// Store debugging
import { devtools } from 'zustand/middleware';

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      // Store implementation
    }),
    { name: 'game-store' }
  )
);
```

### Error Boundaries
```typescript
// components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

## Contributing

### Pull Request Process
1. Create feature branch from `main`
2. Write tests for new functionality
3. Ensure all tests pass
4. Update documentation
5. Submit PR with clear description
6. Address review feedback

### Commit Convention
```bash
feat: add tournament bracket visualization
fix: resolve betting calculation bug
docs: update API documentation
test: add integration tests for game flow
refactor: optimize table rendering performance
```

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests cover new functionality
- [ ] Documentation is updated
- [ ] No console.log statements
- [ ] Performance implications considered
- [ ] Security implications reviewed
- [ ] Accessibility guidelines followed
