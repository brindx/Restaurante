import './globals.css'
import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-display',
    display: 'swap',
})

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-body',
    display: 'swap',
})

export const metadata = {
    title: 'LIT | Alta Cocina',
    description: 'Experiencia gastronómica inigualable.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
            <body>{children}</body>
        </html>
    )
}
