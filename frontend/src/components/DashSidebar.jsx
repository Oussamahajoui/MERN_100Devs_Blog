// DashSidebar.js
import { CiLogout } from "react-icons/ci";
import { HiAnnotation, HiChartPie, HiOutlineDocumentText, HiOutlineUserCircle, HiOutlineUserGroup } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signoutSuccess } from "../redux/Slices/userSlice";

export const DashSidebar = () => {
    const { currentUser } = useSelector(state => state.user);
    const dispatch = useDispatch();
    //Logout function:
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
        <div className="flex flex-col min-h-screen">
            <ul className="menu text-base-content flex-1">
                {/* Sidebar content here */}
                {currentUser.isAdmin && (<li>
                    <Link
                        to="/dashboard?tab=dash"
                        className="flex items-center py-2 px-4 rounded-lg cursor-pointer">
                        <HiChartPie className="text-xl mr-2" />
                        <span>Dashboard</span>
                    </Link>
                </li>)}
                <li>
                    <Link
                        to="/dashboard?tab=profile"
                        className="flex items-center py-2 px-4 rounded-lg cursor-pointer"
                    >
                        <HiOutlineUserCircle className="text-xl mr-2" />
                        <span>Profile</span>
                    </Link>
                </li>
                {currentUser.isAdmin && (
                    <li>
                        <Link
                            to="/dashboard?tab=posts"
                            className="flex items-center py-2 px-4 rounded-lg cursor-pointer"
                        >
                            <HiOutlineDocumentText className="text-xl mr-2" />
                            <span>Posts</span>
                        </Link>
                    </li>
                )}
                {currentUser.isAdmin && (
                    <li>
                        <Link
                            to="/dashboard?tab=users"
                            className="flex items-center py-2 px-4 rounded-lg cursor-pointer"
                        >
                            <HiOutlineUserGroup className="text-xl mr-2" />
                            <span>Users</span>
                        </Link>
                    </li>
                )}
                {currentUser.isAdmin && (
                    <li>
                        <Link
                            to="/dashboard?tab=comments"
                            className="flex items-center py-2 px-4 rounded-lg cursor-pointer"
                        >
                            <HiAnnotation className="text-xl mr-2" />
                            <span>Comments</span>
                        </Link>
                    </li>
                )}
                <li>
                    <Link
                        to="/dashboard?tab=logout"
                        className="flex items-center py-2 px-4 rounded-lg cursor-pointer"
                    >
                        <CiLogout className="text-xl mr-2" />
                        <span onClick={handleSignout}>Sign Out</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
}
