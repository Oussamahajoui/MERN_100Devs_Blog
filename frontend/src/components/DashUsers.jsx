import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useSelector } from 'react-redux';



export const DashUsers = () => {
    const { currentUser } = useSelector(state => state.user)
    const [users, setUsers] = useState([])
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`api/users/getusers`)
                const data = await res.json()
                if (res.ok) {
                    setUsers(data.users)
                } if (data.users.length < 9) {
                    setShowMore(false)
                }
            } catch (error) {
                console.log(error.message)
            }
        };
        if (currentUser.isAdmin) {
            fetchUsers()
        }
    }, [currentUser._id])

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(
                `/api/users/getusers?&startIndex=${startIndex}`
            );
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const res = await fetch(`/api/users/delete/${userIdToDelete}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
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
            {currentUser.isAdmin && users.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>Date created</th>
                                <th>User profile image</th>
                                <th>Username</th>
                                <th>email</th>
                                <th>Admin status</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="hover">
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <img
                                            src={user.profilePicture}
                                            alt={user.username}
                                            className='w-10 h-10 object-cover rounded-full'
                                        />
                                    </td>
                                    <td>
                                        {user.username}
                                    </td>
                                    <td>{user.email}</td>
                                    <td className="text-center text-xl">{user.isAdmin ? <FaCheckCircle className="text-green-600" /> : <FaTimesCircle className="text-red-600" />}</td>
                                    <td>
                                        <span
                                            onClick={() => {
                                                handleOpenModal();
                                                setUserIdToDelete(user._id);
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
                <p>There are no users yet 😓</p>
            )}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-3xl"><IoMdInformationCircleOutline /></h3>
                            <p className="py-4 text-center text-lg font-semibold">Are you sure you want to delete this user?</p>
                            <div className="modal-action flex justify-center ">
                                <div className="space-x-10">
                                    <button
                                        className="btn bg-red-600 hover:bg-red-800 text-white"
                                        onClick={() => { handleCloseModal(); handleDeleteUser() }}
                                    >
                                        Yes, I am sure delete this user
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