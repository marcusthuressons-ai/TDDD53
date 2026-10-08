import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Årstidsrummet',description:'En levande himmel, fyra årstider och dina egna uppdrag.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="sv"><body>{children}</body></html>}
