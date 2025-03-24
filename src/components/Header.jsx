import { Link } from 'react-router-dom'; 

export default function Header() {
    return (
        <header className='mb-5 mt-5 bg-none relative z-30'>
            <nav className='flex justify-center items-center space-x-10'>
                <Link to="/heroes">Heros</Link>
                <Link to="/"><img className='w-20' src="./img/bw.png" alt="BlackWatch Logo" /></Link>
                <Link to="/maps">Maps</Link>
            </nav>
        </header>
    );
}