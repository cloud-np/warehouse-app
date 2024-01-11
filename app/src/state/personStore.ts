import { create } from 'zustand';

interface Person {
    id: number;
    fname: string;
    lname: string;
    email: string;
    phone_number: string;
    proffesion: string;
    ppriority: number;
    ceremony_id: number;
};

interface PersonStore {
    persons: Person[];
    addPerson: (person: Person) => void;
};

const usePersonStore = create<PersonStore>(set => ({
    persons: [],
    addPerson: (person: Person) => set((state: PersonStore) => ({ persons: [...state.persons, person] })),
}));

export { Person, usePersonStore };
