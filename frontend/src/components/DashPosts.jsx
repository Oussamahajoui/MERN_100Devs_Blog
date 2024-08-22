import { useEffect, useState } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";


export const DashPosts = () => {
    const { currentUser } = useSelector(state => state.user)
    const [userPosts, setUserPosts] = useState([])
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState('');

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`api/post/getposts?userId=${currentUser._id}`)
                const data = await res.json()
                if (res.ok) {
                    setUserPosts(data.posts)
                } if (data.posts.length < 9) {
                    setShowMore(false)
                }
            } catch (error) {
                console.log(error.message)
            }
        };
        if (currentUser.isAdmin) {
            fetchPosts()
        }
    }, [currentUser._id, currentUser.isAdmin])

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await fetch(
                `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
            );
            const data = await res.json();
            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts]);
                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeletePost = async () => {
        setShowModal(false);
        try {
            const res = await fetch(
                `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const data = await res.json();
            console.log(data.message)
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUserPosts((prev) =>
                    prev.filter((post) => post._id !== postIdToDelete)
                );
            }
        } catch (error) {
            console.log(error.message);
        }
    };


    return (
        <>
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>Date updated</th>
                                <th>Post image</th>
                                <th>Post title</th>
                                <th>Category</th>
                                <th>Delete</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userPosts.map((post) => (
                                <tr key={post._id} className="hover">
                                    <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                                    <td>
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className='w-20 h-10 object-cover'
                                            />
                                        </Link>
                                    </td>
                                    <td>
                                        <Link
                                            className='font-medium text-blue-600 hover:text-blue-800'
                                            to={`/post/${post.slug}`}
                                        >
                                            {post.title}
                                        </Link>
                                    </td>
                                    <td>{post.category}</td>
                                    <td>
                                        <span
                                            onClick={() => {
                                                handleOpenModal();
                                                setPostIdToDelete(post._id);
                                            }}
                                            className='font-medium text-red-500 hover:underline cursor-pointer'
                                        >
                                            Delete
                                        </span>
                                    </td>
                                    <td>
                                        <Link
                                            className='text-teal-500 hover:underline'
                                            to={`/update-post/${post._id}`}
                                        >
                                            <span>Edit</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {showMore && (
                        <button onClick={handleShowMore} className="btn btn-outline  btn-success btn-block">Show More!</button>
                    )}
                </div>
            ) : (
                <p>There are no posts yet 😓</p>
            )}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-3xl"><IoMdInformationCircleOutline /></h3>
                            <p className="py-4 text-center text-lg font-semibold">Are you sure you want to delete this post?</p>
                            <div className="modal-action flex justify-center ">
                                <div className="space-x-10">
                                    <button
                                        className="btn bg-red-600 hover:bg-red-800 text-white"
                                        onClick={() => { handleCloseModal(); handleDeletePost() }}
                                    >
                                        Yes, I am sure delete this post
                                    </button>
                                    <button
                                        className="btn bg-gray-400 hover:bg-gray-600 text-white"
                                        onClick={handleCloseModal}
                                    >
                                        No, cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-backdrop" onClick={handleCloseModal}></div>
                    </div>
                </div>
            )}
        </>
    )
};