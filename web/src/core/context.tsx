import { createContext } from 'react';
import { useScrapeData , useWebsocket, UseWebsocket,  UseScrapeData } from './hooks';

export const GlobalContext = createContext({} as UseWebsocket & UseScrapeData);

export const GlobalContextWrap = ({children}: {children: JSX.Element}) => {
  const args: UseWebsocket & UseScrapeData = {
    ...useWebsocket(),
    ...useScrapeData()
  }

  return (
    <GlobalContext.Provider value={args}>
      {children}
    </GlobalContext.Provider>
  )
}