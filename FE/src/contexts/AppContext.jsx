import { createContext, useContext } from "react";

const AppContext = createContext();

export function AppProvider({children}) {
    const formatCurrency = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    return (
        <AppContext.Provider value={{formatCurrency}}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => useContext(AppContext);