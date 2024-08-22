import { useEffect, useState } from "react";
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";

const DashboardComp = () => {
    const [users, setUsers] = useState([])
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const { currentUser } = useSelector((state) => state.user);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users/getusers?limit=5');
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/post/getposts?limit=5');
                const data = await res.json();
                if (res.ok) {
                    setPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPosts);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        const fetchComments = async () => {
            try {
                const res = await fetch('/api/comment/getcomments?limit=5');
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.lastMonthComments);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
        }
    }, [currentUser]);
    return (
        <div className='p-3 md:mx-auto'>
            <div className='flex-wrap flex gap-4 justify-center'>
                <div className='flex flex-col p-3  gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
                            <p className='text-2xl'>{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex  gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthUsers}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
                <div className='flex flex-col p-3 gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='text-gray-500 text-md uppercase'>
                                Total Comments
                            </h3>
                            <p className='text-2xl'>{totalComments}</p>
                        </div>
                        <HiAnnotation className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex  gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthComments}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
                <div className='flex flex-col p-3 gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
                            <p className='text-2xl'>{totalPosts}</p>
                        </div>
                        <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex  gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthPosts}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
            </div>
            <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md '>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2'>Recent users</h1>
                        <button className="btn btn-outline hover:bg-teal-600">
                            <Link to={'/dashboard?tab=users'}>See all</Link>
                        </button>
                    </div>
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>User image</th>
                                <th>Username</th>
                            </tr>
                        </thead>
                        {users && users.map((user) =>
                            <tbody key={user._id}>

                                <tr className="hover">
                                    <td>
                                        <img
                                            src={user.profilePicture}
                                            alt={user.username}
                                            className='w-10 h-10 rounded-full'
                                        />
                                    </td>
                                    <td>{user.username}</td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md '>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2'>Recent comments</h1>
                        <button className="btn btn-outline hover:bg-indigo-600">
                            <Link to={'/dashboard?tab=comments'}>See all</Link>
                        </button>
                    </div>
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>Comment content</th>
                                <th>Likes</th>
                            </tr>
                        </thead>
                        {comments && comments.map((comment) =>
                            <tbody key={comment._id}>

                                <tr className="hover w-96">
                                    <td>
                                        <p className="line-clamp-2">{comment.content}</p>
                                    </td>
                                    <td>{comment.numberOfLikes}</td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2'>Recent posts</h1>
                        <button className="btn btn-outline hover:bg-lime-600">
                            <Link to={'/dashboard?tab=posts'}>See all</Link>
                        </button>
                    </div>
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>Post image</th>
                                <th>Post title</th>
                                <th>category</th>
                            </tr>
                        </thead>
                        {posts && posts.map((post) =>
                            <tbody key={post._id}>

                                <tr className="hover">
                                    <td>
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className='w-14 h-10 rounded-md'
                                        />
                                    </td>
                                    <td className="w-96">{post.title}</td>
                                    <td className="w-5">{post.category}</td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DashboardComp