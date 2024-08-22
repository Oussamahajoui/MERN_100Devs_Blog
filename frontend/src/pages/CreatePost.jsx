import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';

const CreatePost = () => {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setimageUploadProgress] = useState(null);
    const [imageUploadError, setimageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);

    const navigate = useNavigate()

    const handleUploadImage = async () => {
        try {
            if (!file) {
                setimageUploadError('Please select an image')
                return;
            }
            setimageUploadError(null)
            const storage = getStorage(app)
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setimageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    console.log(error)
                    setimageUploadError('Image Upload Failed');
                    setimageUploadProgress(null)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setimageUploadProgress(null);
                        setimageUploadError(null);
                        setFormData({ ...formData, image: downloadURL })
                    });
                }
            );
        } catch (error) {
            setimageUploadError('Image upload failed');
            setimageUploadProgress(null)
            console.log(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json();

            if (!res.ok) {
                setPublishError(data.message)
                return
            }
            if (res.ok) {
                setPublishError(null)
                navigate(`/post/${data.slug}`)
            }
        } catch (error) {
            console.log(error)
            setPublishError('Something went wrong 🤔')
        }
    };

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-5xl font-bold my-5">Create a post</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <input type="text" required='true' placeholder="Title"
                        id='title'
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="input input-bordered flex-1 min-h-10" />
                    <select className="select select-bordered" onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        <option disabled selected>Which category?</option>
                        <option>Tech Tips & Tutorials</option>
                        <option>Career advice</option>
                        <option>Interview wisdom</option>
                        <option >Uncategorized</option>
                    </select>
                </div>
                <div className="flex gap-4 items-center justify-between border-dotted border-4 p-3">
                    <input type="file" accept='image/*' onChange={(e) => setFile(e.target.files[0])} className="file-input file-input-bordered w-full max-w-xl" />
                    <button type="button" onClick={handleUploadImage} disabled={imageUploadProgress} className="btn btn-neutral">{imageUploadProgress ?
                        (<div className='w-12 h-12'>
                            <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                        </div>) : ('Upload Image')}</button>
                </div>
                {imageUploadError && (
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
                        <span>{imageUploadError}</span>
                    </div>
                )}
                {formData.image && (
                    <img
                        src={formData.image}
                        alt='Image uploaded'
                        className='w-full h-96 object-contain' />
                )}
                <ReactQuill theme='snow' placeholder='Share your thoughts...' className='h-72 mb-12'
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    required='true' />
                <button type="submit" className="btn btn-block btn-outline">Publish Post!</button>
                {publishError && (<div role="alert" className="alert alert-error">
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
                    <span>{publishError}</span>
                </div>)}
            </form>

        </div>
    )
}

export default CreatePost