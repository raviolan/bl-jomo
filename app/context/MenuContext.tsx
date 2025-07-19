import React, { createContext, useContext, useState } from 'react';

type MenuContextType = {
    isOpen: boolean;
    toggleMenu: () => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(prev => !prev);

    return (
        <MenuContext.Provider value={{ isOpen, toggleMenu }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) throw new Error('useMenu must be used within a MenuProvider');
    return context;
};
