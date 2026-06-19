import { createContext, useContext } from 'react';

export type MatchStatus = 'paused' | 'started';

interface MatchStatusContextValue {
    status: MatchStatus;
    toggle: () => void;
}

export const MatchStatusContext = createContext<MatchStatusContextValue>({
    status: 'paused',
    toggle: () => {},
});

export const useMatchStatus = () => useContext(MatchStatusContext);
