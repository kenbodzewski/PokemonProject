// external imports
import create from 'zustand';
import { persist } from 'zustand/middleware';

// create hook for storing a userProfile
const auth = (set) => ({
    // userProfile is set to null by default
    userProfile: null,
    // add the user passed in when addUser is called
    addUser: (user) => set({ userProfile: user }),
    // remove the current userProfile when removeUser is called
    removeUser: () => set({ userProfile: null })
})

// make the state of the user persistent
const useAuth = create(
    persist(auth, {
        name: 'auth'
    })
)

export default useAuth;