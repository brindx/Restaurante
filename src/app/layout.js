import './globals.css'
import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-display',
    display: 'swap',
    weight: ['400', '700', '900'],
})

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-body',
    display: 'swap',
    weight: ['300', '400', '500', '700'],
})

export const metadata = {
    title: 'LIT | The Culinary Ritual',
    description: 'Alta cocina de fuego en CDMX. Experiencia gastronómica premium en Polanco.',
    keywords: ['restaurante', 'alta cocina', 'CDMX', 'Polanco', 'gastronomía'],
}

export default function RootLayout({ children }) {
    return (
        <html lang="es" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
            <head>
                <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔥</text></svg>" />
            </head>
            <body className="bg-premium-cream text-premium-black antialiased overflow-x-hidden selection:bg-premium-gold selection:text-white" suppressHydrationWarning>
                {children}
            </body>
        </html>
    )
}
