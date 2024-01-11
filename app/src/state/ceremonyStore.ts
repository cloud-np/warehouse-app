import { create } from 'zustand';
import { serverAxios } from '../api/axiosInstance';
import { formatDate, formatTime } from '../util';

interface CeremonyStore {
    ceremonies: Ceremony[];
    addCeremony: (ceremony: Ceremony) => void;
    fetchCeremonies: () => void;
    tablePage: number;
};

export const useCeremonyStore = create<CeremonyStore>(set => ({
    ceremonies: [],
    addCeremony: (ceremony: Ceremony) => set((state: CeremonyStore) => ({ ceremonies: [...state.ceremonies, ceremony] })),
    fetchCeremonies: async () => {
        const res = await serverAxios.get('/ceremonies');
        console.log(res.data);
        set({
            ceremonies: res.data.map((ceremony: Ceremony) => ({
                ...ceremony,
                cdate: formatDate(ceremony.cdate),
                ctime: formatTime (ceremony.ctime)
            }))
        });
    },
    tablePage: 0,
    // bears: 0,
    // increasePopulation: () => set((state: any) => ({ bears: state.bears + 1 })),
    // removeAllBears: () => set({ bears: 0 }),
}));

export interface Ceremony {
    id: number;
    details: string;
    people: number;
    cdate: Date;
    ctime: Date;
    cpriority: number;
};
