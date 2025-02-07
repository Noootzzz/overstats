import { useState, useEffect } from 'react'
import Header from "../components/Header"

export default function Heroes() {

    const [heroesData, setHeroesData] = useState({ Tank: [], Damage: [], Support: [] });
    const [roleIcons, setRoleIcons] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    const fetchHeroes = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://overfast-api.tekrop.fr/heroes?locale=en-us`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Fetch Heroes error!');
            }
            
            // Trier les héros par rôle
            const sortedHeroes = {
                Tank: data.filter(hero => hero.role === "tank"),
                Damage: data.filter(hero => hero.role === "damage"),
                Support: data.filter(hero => hero.role === "support"),
            };

            setHeroesData(sortedHeroes);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchIcons = async () => {
        try {
            const response = await fetch(`https://overfast-api.tekrop.fr/roles?locale=en-us`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Fetch Roles Icons error!');
            }

            // Transformer le tableau en un objet clé-valeur
            const iconsMap = data.reduce((acc, role) => {
                acc[role.name] = role.icon;
                return acc;
            }, {});

            setRoleIcons(iconsMap);
        } catch (err) {
            setError(err.message);
        }
    };

     // useEffect pour charger les héros et les icônes au chargement de la page
    useEffect(() => {
        fetchHeroes();
        fetchIcons();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    return (<>
        <Header />
        <main className='flex w-full flex-col justify-center items-center mt-40'>
            <h1 className="mr-5 text-4xl text-center">Search for an <span className="px-2 text-4xl sm:px-2 md:px-3 bg-red-700 text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg">Overwatch hero</span> to view their stats!</h1>
            <div className="mt-20 w-full max-w-xl">
                <form className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter the Name of the Hero (e.g., Cassidy)"
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-500"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </form>
            </div>
            
            {/* Display loading state */}
            {loading && <p>Loading heroes...</p>}
                
            {/* Display error message */}
            {error && <p className="text-red-500">Error: {error}</p>}
            
            {/* Display heroes sorted by role */}
            <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-20">
                {["Tank", "Damage", "Support"].map(role => (
                    <div key={role} className="w-full">
                        <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
                            {roleIcons[role] ? <img src={roleIcons[role]} alt={role} className="w-8 h-8" /> : null}
                            {role}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {heroesData[role]
                            .slice() // Pour éviter de modifier l'état original
                            .sort((a, b) => {
                                const aMatches = a.name.toLowerCase().includes(searchQuery);
                                const bMatches = b.name.toLowerCase().includes(searchQuery);
                                return bMatches - aMatches; // Met les correspondances en haut
                            })
                            .map(hero => {
                                const isMatch = searchQuery && hero.name.toLowerCase().includes(searchQuery);
                                return (
                                <div 
                                    key={hero.key} 
                                    className={`cursor-pointer hover:bg-gray-300 p-4 rounded-md text-center text-black ${isMatch ? 'bg-blue-300' : 'bg-white'}`}
                                >
                                    <img src={hero.portrait} alt={hero.name} className="w-32 h-32 mx-auto rounded-md" />
                                    <h3 className="text-xl font-bold mt-2">{hero.name}</h3>
                                </div>
                            );
                        })}

                        </div>
                    </div>
                ))}
            </section>
        </main>
    </>);
}
