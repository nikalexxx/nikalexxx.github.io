import { TemplateTree } from "parvis";

export type Particle = {
    name: string;
    symbol: TemplateTree;
    charge: string;
    spin: string;
    mass: TemplateTree;
    group?: string;
    interaction?: string;
    category?: string;
    modifier?: string;
}

export const particles: Particle[] = [
    {
        name: 'электронное антинейтрино',
        symbol: <span><span style={`text-decoration: overline`}>ν</span><sub>e</sub></span>,
        charge: '0',
        spin: '1/2',
        mass: <span>{'<'}1.0 eV/c<sup>2</sup></span>
    },
    {
        name: 'мюонное антинейтрино',
        symbol: <span><span style={`text-decoration: overline`}>ν</span><sub>μ</sub></span>,
        charge: '0',
        spin: '1/2',
        mass: <span>{'<'}0.17 MeV/c<sup>2</sup></span>
    },
    {
        name: 'тау антинейтрино',
        symbol: <span><span style={`text-decoration: overline`}>ν</span><sub>τ</sub></span>,
        charge: '0',
        spin: '1/2',
        mass: <span>{'<'}18.2 MeV/c<sup>2</sup></span>
    },
    {
        name: 'электронное нейтрино',
        symbol: <span>ν<sub>e</sub></span>,
        charge: '0',
        spin: '1/2',
        mass: <span>{'<'}1.0 eV/c<sup>2</sup></span>
    },
    {
        name: 'мюонное нейтрино',
        symbol: <span>ν<sub>μ</sub></span>,
        charge: '0',
        spin: '1/2',
        mass: <span>{'<'}0.17 MeV/c<sup>2</sup></span>
    },
    {
        name: 'тау нейтрино',
        symbol: <span>ν<sub>τ</sub></span>,
        charge: '0',
        spin: '1/2',
        mass: <span>{'<'}18.2 MeV/c<sup>2</sup></span>
    },
    {
        name: 'W бозон',
        symbol: <span>W</span>,
        charge: '±1',
        spin: '1',
        mass: <span>≃80.39 GeV/c<sup>2</sup></span>,
        group: 'SU(2)',
        interaction: 'weak'
    },
    {
        name: 'Z бозон',
        symbol: <span>Z</span>,
        charge: '0',
        spin: '1',
        mass: <span>≃91.19 GeV/c<sup>2</sup></span>,
        group: 'SU(2)',
        interaction: 'weak'
    },
    {
        name: 'бозон Хиггса',
        symbol: <span>H</span>,
        charge: '0',
        spin: '0',
        mass: <span>≃124.97 GeV/c<sup>2</sup></span>,
        interaction: 'mass'
    },
    {
        name: 'позитрон',
        symbol: <span>e<sup>+</sup></span>,
        charge: '+1',
        spin: '1/2',
        mass: <span>≃0.511 MeV/c<sup>2</sup></span>,
    },
    {
        name: 'антимюон',
        symbol: <span>μ<sup>+</sup></span>,
        charge: '+1',
        spin: '1/2',
        mass: <span>≃105.66 MeV/c<sup>2</sup></span>,
    },
    {
        name: 'антитау',
        symbol: <span>τ<sup>+</sup></span>,
        charge: '+1',
        spin: '1/2',
        mass: <span>≃1.7768 GeV/c<sup>2</sup></span>,
    },
    {
        name: 'электрон',
        symbol: <span>e<sup>–</sup></span>,
        charge: '-1',
        spin: '1/2',
        mass: <span>≃0.511 MeV/c<sup>2</sup></span>,
    },
    {
        name: 'мюон',
        symbol: <span>μ<sup>–</sup></span>,
        charge: '-1',
        spin: '1/2',
        mass: <span>≃105.66 MeV/c<sup>2</sup></span>,
    },
    {
        name: 'тау',
        symbol: <span>τ<sup>–</sup></span>,
        charge: '-1',
        spin: '1/2',
        mass: <span>≃1.7768 GeV/c<sup>2</sup></span>,
    },
    {
        name: 'фотон',
        symbol: <span>γ</span>,
        charge: '0',
        spin: '1',
        mass: <span>0</span>,
        modifier: 'y',
        group: 'U(1)',
        interaction: 'electromagnetic'
    },
    {
        name: 'верхний',
        symbol: <span style={`text-decoration: overline`}>u</span>,
        charge: '-2/3',
        spin: '1/2',
        mass: <span>≃2.2 MeV/c<sup>2</sup></span>,
        category: 'anti-quark',
        modifier: 'au'
    },
    {
        name: 'очаровательный',
        symbol: <span style={`text-decoration: overline`}>c</span>,
        charge: '-2/3',
        spin: '1/2',
        mass: <span>≃1.28 GeV/c<sup>2</sup></span>,
        category: 'anti-quark'
    },
    {
        name: 'истинный',
        symbol: <span style={`text-decoration: overline`}>t</span>,
        charge: '-2/3',
        spin: '1/2',
        mass: <span>≃173.1 GeV/c<sup>2</sup></span>,
        category: 'anti-quark'
    },
    {
        name: 'верхний',
        symbol: <span>u</span>,
        charge: '+2/3',
        spin: '1/2',
        mass: <span>≃2.2 MeV/c<sup>2</sup></span>,
        category: 'quark'
    },
    {
        name: 'очаровательный',
        symbol: <span>c</span>,
        charge: '+2/3',
        spin: '1/2',
        mass: <span>≃1.28 GeV/c<sup>2</sup></span>,
        category: 'quark'
    },
    {
        name: 'истинный',
        symbol: <span>t</span>,
        charge: '+2/3',
        spin: '1/2',
        mass: <span>≃173.1 GeV/c<sup>2</sup></span>,
        category: 'quark'
    },
    {
        name: 'глюон',
        symbol: <span>g</span>,
        charge: '0',
        spin: '1',
        mass: <span>0</span>,
        modifier: 'g',
        group: 'SU(3)',
        interaction: 'strong'
    },
    {
        name: 'нижний',
        symbol: <span style={`text-decoration: overline`}>d</span>,
        charge: '+1/3',
        spin: '1/2',
        mass: <span>≃4.7 MeV/c<sup>2</sup></span>,
        category: 'anti-quark',
        modifier: 'ad'
    },
    {
        name: 'странный',
        symbol: <span style={`text-decoration: overline`}>s</span>,
        charge: '+1/3',
        spin: '1/2',
        mass: <span>≃96 MeV/c<sup>2</sup></span>,
        category: 'anti-quark'
    },
    {
        name: 'прелестный',
        symbol: <span style={`text-decoration: overline`}>b</span>,
        charge: '+1/3',
        spin: '1/2',
        mass: <span>≃4.18 GeV/c<sup>2</sup></span>,
        category: 'anti-quark'
    },
    {
        name: 'нижний',
        symbol: <span>d</span>,
        charge: '-1/3',
        spin: '1/2',
        mass: <span>≃4.7 MeV/c<sup>2</sup></span>,
        category: 'quark'
    },
    {
        name: 'странный',
        symbol: <span>s</span>,
        charge: '-1/3',
        spin: '1/2',
        mass: <span>≃96 MeV/c<sup>2</sup></span>,
        category: 'quark'
    },
    {
        name: 'прелестный',
        symbol: <span>b</span>,
        charge: '-1/3',
        spin: '1/2',
        mass: <span>≃4.18 GeV/c<sup>2</sup></span>,
        category: 'quark'
    }
]
