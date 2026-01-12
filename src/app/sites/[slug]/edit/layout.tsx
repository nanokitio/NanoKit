import { Inter, Roboto, Open_Sans, Lato, Montserrat, Poppins, Playfair_Display, Oswald, Raleway, Bebas_Neue } from 'next/font/google'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const roboto = Roboto({ variable: '--font-roboto', subsets: ['latin'], weight: ['400', '700', '900'] })
const openSans = Open_Sans({ variable: '--font-open-sans', subsets: ['latin'] })
const lato = Lato({ variable: '--font-lato', subsets: ['latin'], weight: ['400', '700', '900'] })
const montserrat = Montserrat({ variable: '--font-montserrat', subsets: ['latin'] })
const poppins = Poppins({ variable: '--font-poppins', subsets: ['latin'], weight: ['400', '600', '700', '900'] })
const playfair = Playfair_Display({ variable: '--font-playfair', subsets: ['latin'] })
const oswald = Oswald({ variable: '--font-oswald', subsets: ['latin'] })
const raleway = Raleway({ variable: '--font-raleway', subsets: ['latin'] })
const bebas = Bebas_Neue({ variable: '--font-bebas', subsets: ['latin'], weight: '400' })

export default function EditLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${inter.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} ${montserrat.variable} ${poppins.variable} ${playfair.variable} ${oswald.variable} ${raleway.variable} ${bebas.variable}`}
    >
      {children}
    </div>
  )
}
