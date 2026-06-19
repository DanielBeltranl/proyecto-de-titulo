export type ScoreLabel = '0' | '15' | '30' | '40' | 'A';
export type Player = 'p1' | 'p2';

// Resultado de un set cerrado
export interface SetScore {
    p1: number;
    p2: number;
}

export interface MatchContext {
    p1Id: string;
    p2Id: string;
    id_match: string;
    id_match_score: string;
    bestOf: 1 | 3 | 5;
}

// Espeja match_point
export interface PointPayload {
    id_game: string;
    id_player_1: string;
    id_player_2: string;
    is_serving: string;
    winner_id: string;
    score_p1: string;
    score_p2: string;
    duration: number;
    break_point_chance: boolean;
    break_point: boolean;
    created_at: string;
}

// Espeja match_game
export interface GamePayload {
    id_game: string;
    id_set: string;
    p1_game_final_score: string;
    p2_game_final_score: string;
    duration: number;
    winner_id: string;
    is_break: boolean;
    is_Serving: string;
    created_at: string;
    updated_at: string;
}

// Espeja match_set
export interface SetPayload {
    id_set: string;
    score_p1: number;
    score_p2: number;
    winner_id: string;
    duration: number;
}

// Espeja match_score
export interface MatchScorePayload {
    id_match_score: string;
    id_partido: string;
    winner_id: string;
    duration: number;
    created_at: string;
    updated_at: string;
}

// Snapshot de campos mutables para rollback
export interface ScoreSnapshot {
    p1Score: string;
    p2Score: string;
    p1Games: number;
    p2Games: number;
    gameEnded: boolean;
    gameWinner: Player | null;
    breakPointChance: boolean;
    servingPlayer: Player;
    currentGameId: string;
    currentSetId: string;
    isTiebreak: boolean;
    tiebreakStartServer: Player;
    setWon: boolean;
    // Dev: array local — se reemplazará por fetch cuando haya backend
    completedSets: SetScore[];
    p1Sets: number;
    p2Sets: number;
}

export interface ScoreState {
    // Punto actual
    p1Score: string;
    p2Score: string;
    gameEnded: boolean;
    gameWinner: Player | null;
    breakPointChance: boolean;

    // Juego actual
    p1Games: number;
    p2Games: number;
    servingPlayer: Player;
    currentGameId: string;

    // Set actual
    currentSetId: string;

    // Modo tiebreak
    isTiebreak: boolean;
    tiebreakStartServer: Player;

    // Set terminado (señal para overlay futuro)
    setWon: boolean;

    // Dev: array local — se reemplazará por fetch cuando haya backend
    completedSets: SetScore[];
    p1Sets: number;
    p2Sets: number;

    // Contexto estático del partido
    matchContext: MatchContext;

    // Partido terminado
    matchEnded: boolean;

    // Payloads listos para sincronizar con DB
    lastPoint: PointPayload | null;
    lastGame: GamePayload | null;
    lastSet: SetPayload | null;
    lastMatchScore: MatchScorePayload | null;

    // Rollback
    prevSnapshot: ScoreSnapshot | null;
}

export type ScoreAction =
    | { type: 'SCORE_UP'; player: Player; gameDuration?: number; pointDuration?: number; setDuration?: number; matchDuration?: number }
    | { type: 'UNDO' };
