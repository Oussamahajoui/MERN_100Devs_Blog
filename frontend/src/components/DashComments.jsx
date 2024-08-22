import { useEffect, useState } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useSelector } from 'react-redux';



export const DashComments = () => {
    const { currentUser } = useSelector(state => state.user)
    const [comments, setComments] = useState([])
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState('');

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`api/comment/getcomments`)
                const data = await res.json()
                if (res.ok) {
                    setComments(data.comments)
                } if (data.comments.length < 9) {
                    setShowMore(false)
                }
            } catch (error) {
                console.log(error.message)
            }
        };
        if (currentUser.isAdmin) {
            fetchComments()
        }
    }, [currentUser._id])

    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const res = await fetch(
                `/api/comments/getcomments?&startIndex=${startIndex}`
            );
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => [...prev, ...data.comments]);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteComment = async () => {
        try {
            const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
                setShowModal(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };



    return (
        <>
            {currentUser.isAdmin && comments.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>Date updated</th>
                                <th>Comment content</th>
                                <th>Number of likes</th>
                                <th>PostId</th>
                                <th>UserId</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map((comment) => (
                                <tr key={comment._id} className="hover">
                                    <td>{new Date(comment.updatedAt).toLocaleDateString()}</td>
                                    <td>
                                        {comment.content}
                                    </td>
                                    <td>
                                        {comment.numberOfLikes}
                                    </td>
                                    <td>{comment.postId}</td>
                                    <td>{comment.userId}</td>
                                    <td>
                                        <span
                                            onClick={() => {
                                                handleOpenModal();
                                                setCommentIdToDelete(comment._id);
                                            }}
                                            className='font-medium text-red-500 hover:underline cursor-pointer'
                                        >
                                            Delete
                                        </span>
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
                <p>There are no comments yet 😓</p>
            )}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-3xl"><IoMdInformationCircleOutline /></h3>
                            <p className="py-4 text-center text-lg font-semibold">Are you sure you want to delete this comment?</p>
                            <div className="modal-action flex justify-center ">
                                <div className="space-x-10">
                                    <button
                                        className="btn bg-red-600 hover:bg-red-800 text-white"
                                        onClick={() => { handleCloseModal(); handleDeleteComment(commentIdToDelete) }}
                                    >
                                        Yes, I am sure delete this comment
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