// Dashboard.js
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashBoardComp from "../components/DashBoardComp";
import { DashComments } from "../components/DashComments";
import { DashPosts } from "../components/DashPosts";
import { DashProfile } from "../components/DashProfile";
import { DashSidebar } from "../components/DashSidebar";
import { DashUsers } from "../components/DashUsers";
import { DashLogout } from "./DashLogout";

const Dashboard = () => {
    const location = useLocation();
    const [tab, setTab] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    return (
        <div className="flex flex-col sm:flex-row h-screen">
            {/* Sidebar */}
            <div className="w-full h-60 sm:w-56 sm:h-full bg-base-200 p-4 pb-6 pt-2">
                <DashSidebar />
            </div>
            {/* Content Area */}
            <div className="flex-1 w-full sm:w-auto overflow-auto">
                {tab === 'profile' && <DashProfile />}
                {tab === 'dash' && <DashBoardComp />}
                {tab === 'posts' && <DashPosts />}
                {tab === 'users' && <DashUsers />}
                {tab === 'comments' && <DashComments />}
                {tab === 'logout' && <DashLogout />}

            </div>
        </div>
    );
};

export default Dashboard;
