import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';

const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch('/api/post/getPosts');
            const data = await res.json();
            setPosts(data.posts);
        };
        fetchPosts();
    }, []);
    return (
        <div>
            <div
                className="hero min-h-screen"
                style={{
                    backgroundImage: "url(https://web-assets.bcg.com/94/70/2491329948c68a4c65f3199d1fbe/tech-startups-should-prepare-now-for-the-next-ipo-boom-rectangle.jpg)",
                }}>
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-neutral-content text-center">
                    <div className="max-w-3xl mx-auto px-4">
                        <h1 className="mb-5 text-3xl font-bold lg:text-6xl">Welcome to the 100Devs Blog!</h1>
                        <p className='sm:text-lg'>
                            100Devs is an agency of full stack software engineers, with a training program.<br />
                            This blog, is a resource made by the community for the community to share Tech tips, carrer advice, words of wisdom and everything in between!
                        </p>
                        <Link to='/search'><button className="btn btn-primary mt-5">
                            View all posts</button></Link>
                    </div>
                </div>
            </div>

            <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
                {posts && posts.length > 0 && (
                    <div className='flex flex-col gap-6'>
                        <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
                        <div className='flex flex-wrap gap-4'>
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                        <Link
                            to={'/search'}
                            className='text-lg text-indigo-500 hover:underline text-center'
                        >
                            View all posts
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home