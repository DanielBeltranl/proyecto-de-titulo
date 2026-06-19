import type { ScoreLabel, ScoreState, Player } from './scoreTypes';

const SCORES: ReadonlyArray<ScoreLabel> = ['0', '15', '30', '40'];

const nextScore = (current: ScoreLabel): ScoreLabel => {
    const idx = SCORES.indexOf(current as Exclude<ScoreLabel, 'A'>);
    return SCORES[idx + 1] ?? '40';
};

type ScoreUpResult = Pick<ScoreState, 'p1Score' | 'p2Score' | 'gameEnded' | 'gameWinner'>;

export const scoreUp = (state: ScoreState, player: Player): ScoreUpResult => {
    const scorer = player === 'p1' ? state.p1Score : state.p2Score;
    const opponent = player === 'p1' ? state.p2Score : state.p1Score;

    if (scorer === 'A') {
        return { p1Score: state.p1Score, p2Score: state.p2Score, gameEnded: true, gameWinner: player };
    }

    if (opponent === 'A') {
        return { p1Score: '40', p2Score: '40', gameEnded: false, gameWinner: null };
    }

    if (scorer === '40' && opponent === '40') {
        return {
            p1Score: player === 'p1' ? 'A' : '40',
            p2Score: player === 'p2' ? 'A' : '40',
            gameEnded: false,
            gameWinner: null,
        };
    }

    if (scorer === '40') {
        return { p1Score: state.p1Score, p2Score: state.p2Score, gameEnded: true, gameWinner: player };
    }

    return {
        p1Score: player === 'p1' ? nextScore(scorer) : state.p1Score,
        p2Score: player === 'p2' ? nextScore(scorer) : state.p2Score,
        gameEnded: false,
        gameWinner: null,
    };
};
