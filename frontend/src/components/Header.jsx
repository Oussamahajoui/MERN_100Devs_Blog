import { useEffect, useState } from 'react';
import { AiOutlineSearch } from "react-icons/ai";
import { FaCode } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signoutSuccess } from '../redux/Slices/userSlice';


const Header = () => {
    const location = useLocation()
    const navigate = useNavigate()
    // useSelector initialization to later only display sign-in if not logged in
    const { currentUser } = useSelector(state => state.user)
    // Search Term state for the Search bar + useEffect
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const SearchTermFromUrl = urlParams.get('searchTerm');
        if (SearchTermFromUrl) {
            setSearchTerm(SearchTermFromUrl);
        }

    }, [location.search])

    // use theme from local storage if available or set light theme
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
    );

    const dispatch = useDispatch()

    // update state on toggle
    const handleToggle = (e) => {
        if (e.target.checked) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    // set theme state in localstorage on mount & also update localstorage on state change
    useEffect(() => {
        localStorage.setItem("theme", theme);
        const localTheme = localStorage.getItem("theme");
        // add custom data-theme attribute to html tag required to update theme using DaisyUI
        document.querySelector("html").setAttribute("data-theme", localTheme);
    }, [theme]);

    //Logout function:
    const handleSignout = async () => {
        try {
            const res = await fetch('/api/users/signout', {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    return (
        <div className="navbar bg-base-100 mb-4">
            <div className="flex-1">
                <Link to='/' className="btn btn-ghost text-base sm:text-xl">
                    <FaCode /><span>100Devs</span>Blog</Link>
            </div>
            <div className="form-control relative flex items-center">
                <form className='hidden sm:inline' onSubmit={handleSubmit} >
                    <input type="text"
                        placeholder="Search..."
                        className="input input-bordered  md:w-auto"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} />
                    <AiOutlineSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
                </form>
                <button className='sm:hidden flex items-center justify-center p-2 border border-gray-500 rounded-2xl shadow-sm text-gray-500 hover:border-gray-400 focus:outline-none mr-2'><AiOutlineSearch className='text-xl' /></button>
            </div>
            <div className="hidden lg:flex lg:items-center">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to='/dashboard' >Dashboard</Link></li>
                    {currentUser && currentUser.isAdmin && (
                        <li><Link to='/create-post'>Create post</Link></li>
                    )}
                    <li><Link to='/about'>About</Link></li>
                </ul>
            </div>
            <div className='lg:order-2'>
                <label className="swap swap-rotate">
                    {/* this hidden checkbox controls the state */}
                    <input type="checkbox"
                        onChange={handleToggle}
                        checked={theme === "light" ? false : true}
                    />
                    {/* sun icon */}
                    <svg
                        className="swap-on h-8 w-8 fill-current mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24">
                        <path
                            d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                    </svg>

                    {/* moon icon */}
                    <svg
                        className="swap-off h-8 w-8 fill-current mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24">
                        <path
                            d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                    </svg>
                </label>
                {currentUser ?
                    (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Profile Picture"
                                        src={currentUser.profilePicture} />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-auto p-2 shadow">
                                <li >Username: <span className='italic font-thin'>{currentUser.username}</span></li>
                                <li>Email: <span className='italic font-thin'>{currentUser.email}</span></li>
                                <li><Link to='/dashboard?tab=profile'>Profile</Link></li>
                                <li onClick={handleSignout}><a>Logout</a></li>
                            </ul>

                        </div>
                    ) : (
                        <Link to='/sign-in'>
                            <button className="btn btn-ghost mr-2">Sign in</button>
                        </Link>
                    )}

            </div>
            {/* Hamburguer menu below */}
            <div className="flex-none lg:hidden">
                <div className="dropdown dropdown-end">
                    <button className="btn btn-square btn-ghost" aria-haspopup="true" aria-expanded="false">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block h-5 w-5 stroke-current">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                    <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li><Link to='/dashboard'>Dashboard</Link></li>
                        {currentUser && currentUser.isAdmin && (
                            <li><Link to='/create-post'>Create post</Link></li>
                        )}
                        <li><Link to='/about'>About</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Header