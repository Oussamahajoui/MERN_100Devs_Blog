import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized',
    });

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        setSidebarData({
            searchTerm: urlParams.get('searchTerm') || '',
            sort: urlParams.get('sort') || 'desc',
            category: urlParams.get('category') || 'uncategorized'
        });

        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/post/getposts?${searchQuery}`);
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts);
                setShowMore(data.posts.length === 9);
            }
            setLoading(false);
        };
        fetchPosts();
    }, [location.search]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setSidebarData((prevState) => ({
            ...prevState,
            [id]: value
        }));

        // Update URL parameters dynamically
        const urlParams = new URLSearchParams(location.search);
        if (value.trim()) {
            urlParams.set(id, value);
        } else {
            urlParams.delete(id);
        }
        navigate(`/search?${urlParams.toString()}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // URL is already updated dynamically by handleChange
    };

    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (res.ok) {
            const data = await res.json();
            setPosts([...posts, ...data.posts]);
            setShowMore(data.posts.length === 9);
        }
    };

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
                <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>
                            Search Term:
                        </label>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="input input-bordered md:w-auto"
                            id='searchTerm'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Sort:</label>
                        <select className="select select-bordered" onChange={handleChange}
                            value={sidebarData.sort} id='sort'>
                            <option value='desc'>Latest</option>
                            <option value='asc'>Oldest</option>
                        </select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Category:</label>
                        <select className="select select-bordered" onChange={handleChange}
                            value={sidebarData.category} id='category'>
                            <option value='uncategorized'>Uncategorized</option>
                            <option value='Tech Tips & Tutorials'>Tech Tips & Tutorials</option>
                            <option value='Career advice'>Career advice</option>
                            <option value='Interview wisdom'>Interview wisdom</option>
                        </select>
                    </div>
                </form>
            </div>
            <div className='w-full'>
                <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>
                    Posts results:
                </h1>
                <div className='p-7 flex flex-wrap gap-4'>
                    {!loading && posts.length === 0 && (
                        <p className='text-xl text-gray-500'>No posts found.</p>
                    )}
                    {loading && <p className='text-xl text-gray-500'>Loading...</p>}
                    {!loading &&
                        posts &&
                        posts.map((post) => <PostCard key={post._id} post={post} />)}
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='text-teal-500 text-lg hover:underline p-7 w-full'
                        >
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
