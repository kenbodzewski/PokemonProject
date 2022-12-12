import create from 'zustand';
import { persist } from 'zustand/middleware';

const auth = (set) => ({
    userProfile: null,

    addUser: (user) => set({ userProfile: user }),
    removeUser: () => set({ userProfile: null })
})

const useAuth = create(
    persist(auth, {
        name: 'auth'
    })
)

export default useAuth;