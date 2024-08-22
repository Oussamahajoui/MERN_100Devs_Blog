import { useState } from "react";
import { FaCode } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password) {
            return setErrorMessage('Please fill out all fields 🙏')
        }
        try {
            setLoading(true);
            setErrorMessage(null);
            const res = await fetch('api/auth/sign-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                return setErrorMessage(data.message)
            }
            setLoading(false);
            if (res.ok) {
                navigate('/')
            }
        } catch (err) {
            setErrorMessage(err.message);
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col h-screen">
            <p className="text-6xl font-bold text-center pt-4">Sign-Up Page</p>
            <div className="flex h-screen">
                {/* Left div - 40% width on medium and larger screens, hidden on small screens */}
                <div className="hidden md:flex md:flex-[40%] items-center justify-center  p-10 pt-0">
                    <div className="text-center">
                        <Link className="flex items-center justify-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold py-4 px-8">
                            <FaCode className="mr-2" />
                            <span>100Devs </span>&nbsp;Blog
                        </Link>
                        <p>Welcome to the 100 Devs Blog! People from the community use this space to share tips and advice on everything related to their Tech Career. From learning resources, debbuging code, networking and interview prep. So much wisdom from the best community!</p>
                    </div>
                </div>

                {/* Right div - 60% width on medium and larger screens, full width on small screens */}
                <div className="flex-1 md:flex-1 md:w-3/5 p-8 shadow-lg flex flex-col justify-center items-center pt-0">
                    <div className="w-full max-w-md">
                        <form onSubmit={handleSubmit}>
                            <label className="input input-bordered flex items-center gap-2 mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70">
                                    <path
                                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                </svg>
                                <input type="text" className="grow" placeholder="Username" id="username" onChange={handleChange} />
                            </label>
                            <label className="input input-bordered flex items-center gap-2 mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70">
                                    <path
                                        d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                    <path
                                        d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                                </svg>
                                <input type="email" className="grow" placeholder="Email" id="email" onChange={handleChange} />
                            </label>
                            <label className="input input-bordered flex items-center gap-2 mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70">
                                    <path
                                        fillRule="evenodd"
                                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                        clipRule="evenodd" />
                                </svg>
                                <input type="password" className="grow" placeholder="password" id="password" onChange={handleChange} />
                            </label>
                            {
                                loading ? (<button className="btn btn-outline btn-block">
                                    <span className="loading loading-spinner"></span>
                                    loading
                                </button>) : (<button type="submit" className="btn btn-block btn-outline">Sign Up</button>)
                            }
                            <OAuth />
                        </form>
                        <p className="text-sm mt-1">Already have an account ? <Link to='/sign-in' className=" font-bold hover:text-gray-500 cursor-pointer ">Sign-in</Link></p>
                    </div>
                    {errorMessage && (
                        <div role="alert" className="alert alert-error">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 shrink-0 stroke-current"
                                fill="none"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{errorMessage}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SignUp;
