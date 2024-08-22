import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useRef, useState } from "react";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';

import { app } from '../firebase';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutSuccess, updateFailure, updateStart, updateSuccess } from '../redux/Slices/userSlice';

export const DashProfile = () => {
    const { currentUser, error, loading } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const filePickerRef = useRef();
    const dispatch = useDispatch();

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };
    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
        setImageFileUploading(true);
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                // console.log(error)
                setImageFileUploadError(
                    'Could not upload image (File must be less than 2MB) 🥺'
                );
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({ ...formData, profilePicture: downloadURL });
                    setImageFileUploadProgress(null)
                    setImageFileUploading(false);
                });
            }
        );
    };

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            username: currentUser.username || '', // Default to empty string if undefined
            email: currentUser.email || ''        // Default to empty string if undefined
        }));
    }, [currentUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);

        // Validate username length
        const username = formData.username;
        if (username && (username.length < 7 || username.length > 20)) {
            setUpdateUserError('Username must be between 7 and 20 characters');
            return;
        }

        // Validate email address
        const email = formData.email;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            setUpdateUserError('Please enter a valid email address');
            return;
        }

        if (Object.keys(formData).length === 0) {
            setUpdateUserError('No changes made');
            return;
        }
        if (imageFileUploading) {
            setUpdateUserError('Please wait for image to upload');
            return;
        }

        try {
            dispatch(updateStart());
            const res = await fetch(`/api/users/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (!res.ok) {
                setUpdateUserError(data.message || 'An error occurred while updating user');
                dispatch(updateFailure(data.message || 'An error occurred while updating user'));
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User's profile updated successfully 🙌");
            }
        } catch (error) {
            setUpdateUserError(error.message);
            dispatch(updateFailure(error.message));
            // console.log(error.message);
        }
    };
    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/users/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message));
            } else {
                dispatch(deleteUserSuccess(data));
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };
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

    return (
        <div className="p-4">
            <h1 className="text-4xl font-bold mb-6">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col max-w-lg mx-auto space-y-4">
                <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />
                <div className="avatar self-center mb-6" onClick={() => filePickerRef.current.click()}>
                    {imageFileUploadProgress && (<CircularProgressbar
                        value={imageFileUploadProgress || 0}
                        text={`${imageFileUploadProgress}%`}
                        strokeWidth={5}
                        styles={{
                            root: {
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                            },
                            path: {
                                stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100
                                    })`,
                            },
                        }}
                    />
                    )}
                    <div className={`ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2 cursor-pointer ${imageFileUploadProgress &&
                        imageFileUploadProgress < 100 &&
                        'opacity-60'}`}>
                        <img src={imageFileUrl || currentUser.profilePicture} alt="Profile" />
                    </div>
                    {imageFileUploadError && (
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
                            <span>{imageFileUploadError}</span>
                        </div>
                    )}
                </div>
                <label className="input input-bordered flex items-center gap-4 mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70"
                    >
                        <path
                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input
                        type="text"
                        className="grow font-medium"
                        value={formData.username}
                        id="username"
                        onChange={handleChange}
                    />
                </label>
                <label className="input input-bordered flex items-center gap-4 mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70"
                    >
                        <path
                            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path
                            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input
                        type="email"
                        className="grow font-medium text-black	"
                        value={formData.email}
                        id="email"
                        onChange={handleChange}
                    />
                </label>
                <label className="input input-bordered flex items-center gap-4 mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70"
                    >
                        <path
                            fillRule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clipRule="evenodd" />
                    </svg>
                    <input
                        type="password"
                        className="grow"
                        placeholder="Change password"
                        id="password"
                        onChange={handleChange}
                    />
                </label>
                <button type="submit" className="btn btn-block btn-outline" disabled={loading || setImageFileUploading}>
                    {loading ? 'Loading...' : 'Update'}</button>
                {currentUser.isAdmin && (
                    <Link to={'/create-post'}>
                        <button type="button" className="btn btn-block btn-outline btn-primary">Create a post</button>
                    </Link>)}
                {updateUserSuccess && (
                    <div role="alert" className="alert alert-success">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{updateUserSuccess}</span>
                    </div>
                )}
                {updateUserError && (
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
                        <span>{updateUserError}</span>
                    </div>
                )}
                {error && (
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
                        <span>{error}</span>
                    </div>
                )}
                <div className="flex justify-between text-red-600 font-semibold">
                    <p onClick={handleSignout} className='cursor-pointer' >Sign Out</p>
                    <p onClick={handleOpenModal} className='cursor-pointer'>Delete Account</p>
                </div>
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h3 className="font-bold text-3xl"><IoMdInformationCircleOutline /></h3>
                                <p className="py-4 text-center text-lg font-semibold">Are you sure you want to delete your account?</p>
                                <div className="modal-action flex justify-center ">
                                    <div className="space-x-10">
                                        <button
                                            className="btn bg-red-600 hover:bg-red-800 text-white"
                                            onClick={() => { handleCloseModal, handleDeleteUser }}
                                        >
                                            Yes, I am sure delete my account
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

            </form >
        </div >
    );
};
