import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTimer } from "../controller/useTimer.ts";
import { useScoreBoardApi } from "../controller/useScoreBoardApi.ts";
import { useLiveStats } from "../controller/useLiveStats.ts";
import { MatchStatusContext } from "../model/matchStatusContext.tsx";
import type { MatchStatus } from "../model/matchStatusContext.tsx";
import type { Player } from '../model/scoreTypes.ts';
import { MatchTimer } from "./components/matchTimer/matchTimer.tsx";
import { PlayersNames } from "./components/playerNames/playerNames.tsx";
import { CurrentGameColumn } from "./components/currentSetScoreBoard/currentSetScoreBoard.tsx";
import { GamePointsColumn } from "./components/boxScoreNumber/gamePointsColumn.tsx";
import { ScoreboardContainer } from "./components/scoreBoardContainer/scoreBoardContainer.tsx";
import { MatchControlButton } from "./components/matchControlButton/matchControlButton.tsx";
import styles from "./liveScoreBoard.module.css";
import { OrientationOverlay } from "./components/orientationOverlay/orientationOverlay.tsx";
import { ButtonGrid } from "./components/buttonGrid/buttonGrid.tsx";
import { PerformanceWidget } from "./components/statsBoard/performanceWidget.tsx";
import { MatchEndModal } from "./components/matchEndModal/MatchEndModal.tsx";

const buildFallbackStats = (name: string, breakPointsSub: string) => ({
    name, image: "", distance: "N/A", distanceWidth: "50%",
    winRatePct: "0%", winRateFrac: "0/0", breakPoints: "0/0",
    breakPointsSub, avgDuration: "00:00",
});

export const LiveScoreBoard = () => {
    const { uuid = '' } = useParams<{ uuid: string }>();
    const { state, onScoreUp, onUndo, onPause, onFinish } = useScoreBoardApi(uuid);
    const { p1: liveP1, p2: liveP2 } = useLiveStats(uuid);

    const [matchStatus, setMatchStatus] = useState<MatchStatus>('paused');

    const isRunning = matchStatus === 'started' && !state.matchEnded;

    // Timer de punto — mide la duración para enviar al API
    const { getElapsed: getPointElapsed, reset: resetPointTimer } = useTimer(false, isRunning);

    const handleScoreUp = (player: Player) => {
        const duration = getPointElapsed();
        resetPointTimer();
        onScoreUp(player, duration);
    };

    // El toggle del MatchControlButton ahora pausa vía API cuando el match está corriendo
    const toggle = () => {
        if (matchStatus === 'started') {
            onPause();
        } else {
            setMatchStatus('started');
        }
    };

    const p1IsServing = state.servingPlayer === 'p1';
    const p1BreakChance = !p1IsServing && state.breakPointChance;
    const p2BreakChance = p1IsServing && state.breakPointChance;

    if (state.loading) {
        return (
            <div className={styles.fullContainer}>
                <div className={styles.feedbackCenter}>
                    <span className={`material-symbols-outlined ${styles.spinIcon}`}>autorenew</span>
                    <p>Cargando partido...</p>
                </div>
            </div>
        );
    }

    if (state.error) {
        return (
            <div className={styles.fullContainer}>
                <div className={styles.feedbackCenter}>
                    <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#ffb4ab' }}>error</span>
                    <p style={{ color: '#ffb4ab' }}>{state.error}</p>
                </div>
            </div>
        );
    }

    return (
        <MatchStatusContext.Provider value={{ status: matchStatus, toggle }}>
            <div className={styles.fullContainer}>
                <OrientationOverlay />
                <section className={styles.container}>
                    <MatchTimer
                        gameId={state.currentGameId}
                        setId={state.currentSetId}
                        matchEnded={state.matchEnded}
                    />
                    <ScoreboardContainer>
                        <PlayersNames
                            player1={{ name: state.p1Name, isServing: p1IsServing }}
                            player2={{ name: state.p2Name, isServing: !p1IsServing }}
                        />
                        <CurrentGameColumn
                            completedSets={state.completedSets}
                            p1Games={state.p1Games}
                            p2Games={state.p2Games}
                        />
                        <GamePointsColumn
                            p1Points={state.p1Score}
                            p2Points={state.p2Score}
                            p1IsWinner={state.gameWinner === 'p1'}
                            p2IsWinner={state.gameWinner === 'p2'}
                            p1BreakChance={p1BreakChance}
                            p2BreakChance={p2BreakChance}
                        />
                    </ScoreboardContainer>
                    <ButtonGrid
                        player1Label={state.p1Name}
                        player2Label={state.p2Name}
                        onScoreUp={handleScoreUp}
                        onUndo={onUndo}
                        canUndo={state.hasUndo}
                        disabled={matchStatus === 'paused' || state.actionLoading || state.matchClosed}
                    />
                    <MatchControlButton />
                    {state.matchClosed && (
                        <MatchEndModal
                            onFinish={onFinish}
                            onUndo={onUndo}
                            canUndo={state.hasUndo}
                            loading={state.actionLoading}
                        />
                    )}
                </section>
                <section className={styles.container}>
                    <PerformanceWidget
                        player1={liveP1 ?? buildFallbackStats(state.p1Name, "WON")}
                        player2={liveP2 ?? buildFallbackStats(state.p2Name, "SAVED")}
                    />
                </section>
            </div>
        </MatchStatusContext.Provider>
    );
};
