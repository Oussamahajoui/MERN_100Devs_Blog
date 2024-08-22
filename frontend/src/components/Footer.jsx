import { FaCode } from "react-icons/fa";

const Footer = () => {

    return (
        <footer className='footer border-t-2 mt-4 border-transparent text-neutral-400 items-center p-4'>
            <div className="flex-1">
                <span className="btn btn-ghost text-xl">
                    <FaCode /><span>100Devs</span>Blog</span>
            </div>
            <aside className="grid-flow-col items-center">
                <p className="text-lg">Copyright © {new Date().getFullYear()} - All right reserved - Made by Oussama H.</p>
            </aside>
            <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
            </nav>
        </footer>
    )
}

export default Footer