/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import altLogo from "../../assets/images/altlogo.png";
import { BiHomeSmile } from "react-icons/bi";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";
import { BsCart2, BsBox } from "react-icons/bs";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdLogin, MdLogout } from "react-icons/md";
import { useAuth } from "../../context/auth";
import SearchBar from "./SearchBar";
import { useCart } from "../../context/cart";

const Header = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const headerRef = useRef(null);
    const { auth, LogOut } = useAuth();
    const [cartItems] = useCart();
    const [currentLogo, setCurrentLogo] = useState(logo);

    let closeTimeout;
    const toggleDropdown = () => {
        clearTimeout(closeTimeout);
        setDropdownOpen(true);
    };

    const closeDropdown = () => {
        closeTimeout = setTimeout(() => {
            setDropdownOpen(false);
        }, 200);
    };

    const handleLogout = () => {
        LogOut();
    };

    const handleStickyHeader = () => {
        if (
            document.body.scrollTop > 0 ||
            document.documentElement.scrollTop > 0
        ) {
            headerRef.current.classList.add("sticky__header");
            setCurrentLogo(altLogo);
        } else {
            headerRef.current.classList.remove("sticky__header");
            setCurrentLogo(logo);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleStickyHeader);
        return () =>
            window.removeEventListener("scroll", handleStickyHeader);
    }, []);

    return (
        <header ref={headerRef}>
            <nav className="container header-main px-4 md:px-[50px]">
                {/* Desktop Header Layout */}
                <div className="hidden md:flex items-center justify-between">
                    {/* Desktop Search Bar */}
                    <div className="flex-1 flex gap-[30px] ">
                        <SearchBar />
                    </div>

                    {/* Desktop Logo */}
                    <div className="flex-shrink-0 mx-4">
                        <Link to="/">
                            <img
                                src={currentLogo}
                                alt="logo"
                                className="w-auto"
                            />
                        </Link>
                    </div>

                    {/* Desktop Icons */}
                    <div className="flex-1 flex justify-end items-center gap-4">
                        <NavLink to="/" className="flex items-center gap-1">
                            <BiHomeSmile className="text-[22px]" />
                        </NavLink>

                        <div
                            className="relative cursor-pointer p-1 rounded-md hover:bg-slate-100"
                            onMouseEnter={toggleDropdown}
                            onMouseLeave={closeDropdown}
                        >
                            {auth.user ? (
                                <div className="flex items-center gap-1">
                                    <AiOutlineUser className="text-[22px]" />
                                    <span className="text-[18px]">
                                        {auth.user.name.split(" ")[0]}
                                    </span>
                                    <RiArrowDropDownLine className="transition-all" />
                                </div>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-1"
                                    >
                                        <AiOutlineUser className="text-[22px]" />
                                        <span className="text-[18px]">
                                            Sign in
                                        </span>
                                    </Link>
                                    <RiArrowDropDownLine className="transition-all" />
                                </div>
                            )}

                            {isDropdownOpen && (
                                <div
                                    className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-300 rounded-md p-2 w-[140px]"
                                    onMouseEnter={toggleDropdown}
                                    onMouseLeave={closeDropdown}
                                >
                                    <ul>
                                        {!auth.user && (
                                            <li className="p-1 hover:bg-slate-100 rounded-md">
                                                <Link
                                                    to="/register"
                                                    className="flex items-center gap-3"
                                                >
                                                    <MdLogin className="text-[14px]" />
                                                    <span className="text-[16px]">
                                                        Sign up
                                                    </span>
                                                </Link>
                                            </li>
                                        )}
                                        <li className="p-1 hover:bg-slate-100 rounded-md">
                                            <Link
                                                to={`${
                                                    auth?.user?.role === 1
                                                        ? "/admin"
                                                        : "/user"
                                                }/dashboard`}
                                                className="flex items-center gap-3"
                                            >
                                                <AiOutlineUser className="text-[14px]" />
                                                <span className="text-[16px]">
                                                    My Profile
                                                </span>
                                            </Link>
                                        </li>
                                        {auth.user?.role !== 1 && (
                                            <li className="p-1 hover:bg-slate-100 rounded-md">
                                                <Link
                                                    to="/user/wishlist"
                                                    className="flex items-center gap-3"
                                                >
                                                    <AiOutlineHeart className="text-[14px]" />
                                                    <span className="text-[16px]">
                                                        Wishlist
                                                    </span>
                                                </Link>
                                            </li>
                                        )}
                                        <li className="p-1 hover:bg-slate-100 rounded-md">
                                            <Link
                                                to={`${
                                                    auth?.user?.role === 1
                                                        ? "/admin"
                                                        : "/user"
                                                }/orders`}
                                                className="flex items-center gap-3"
                                            >
                                                <BsBox className="text-[14px]" />
                                                <span className="text-[16px]">
                                                    Orders
                                                </span>
                                            </Link>
                                        </li>
                                        {auth.user && (
                                            <li className="p-1 hover:bg-slate-100 rounded-md">
                                                <Link
                                                    onClick={handleLogout}
                                                    to="/login"
                                                    className="flex items-center gap-3"
                                                >
                                                    <MdLogout className="text-[14px]" />
                                                    <span className="text-[16px]">
                                                        Logout
                                                    </span>
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {auth?.user?.role !== 1 && (
                            <NavLink
                                to="/cart"
                                className="relative flex items-center gap-1"
                            >
                                <span className="absolute w-4 h-4 text-[11px] text-center font-semibold left-2 bottom-3 text-white bg-red-500 rounded-full">
                                    {cartItems?.length}
                                </span>
                                <BsCart2 className="text-[22px]" />
                            </NavLink>
                        )}
                    </div>
                </div>

                {/* Mobile Header Layout */}
                <div className="flex md:hidden items-center justify-between">
                    {/* Smaller Logo */}
                    <Link to="/">
                        <img src={currentLogo} alt="logo" className="w-20" />
                    </Link>
                    {/* Icons */}
                    <div className="flex items-center gap-4">
                        <NavLink to="/" className="flex items-center gap-1">
                            <BiHomeSmile className="text-[22px]" />
                        </NavLink>

                        <div
                            className="relative cursor-pointer p-1 rounded-md hover:bg-slate-100"
                            onMouseEnter={toggleDropdown}
                            onMouseLeave={closeDropdown}
                        >
                            {auth.user ? (
                                <div className="flex items-center gap-1">
                                    <AiOutlineUser className="text-[22px]" />
                                    <RiArrowDropDownLine className="transition-all" />
                                </div>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-1"
                                    >
                                        <AiOutlineUser className="text-[22px]" />
                                    </Link>
                                    <RiArrowDropDownLine className="transition-all" />
                                </div>
                            )}

                            {isDropdownOpen && (
                                <div
                                    className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-300 rounded-md p-2 w-[140px]"
                                    onMouseEnter={toggleDropdown}
                                    onMouseLeave={closeDropdown}
                                >
                                    <ul>
                                        {!auth.user && (
                                            <li className="p-1 hover:bg-slate-100 rounded-md">
                                                <Link
                                                    to="/register"
                                                    className="flex items-center gap-3"
                                                >
                                                    <MdLogin className="text-[14px]" />
                                                    <span className="text-[16px]">
                                                        Sign up
                                                    </span>
                                                </Link>
                                            </li>
                                        )}
                                        <li className="p-1 hover:bg-slate-100 rounded-md">
                                            <Link
                                                to={`${
                                                    auth?.user?.role === 1
                                                        ? "/admin"
                                                        : "/user"
                                                }/dashboard`}
                                                className="flex items-center gap-3"
                                            >
                                                <AiOutlineUser className="text-[14px]" />
                                                <span className="text-[16px]">
                                                    My Profile
                                                </span>
                                            </Link>
                                        </li>
                                        {auth.user?.role !== 1 && (
                                            <li className="p-1 hover:bg-slate-100 rounded-md">
                                                <Link
                                                    to="/user/wishlist"
                                                    className="flex items-center gap-3"
                                                >
                                                    <AiOutlineHeart className="text-[14px]" />
                                                    <span className="text-[16px]">
                                                        Wishlist
                                                    </span>
                                                </Link>
                                            </li>
                                        )}
                                        <li className="p-1 hover:bg-slate-100 rounded-md">
                                            <Link
                                                to={`${
                                                    auth?.user?.role === 1
                                                        ? "/admin"
                                                        : "/user"
                                                }/orders`}
                                                className="flex items-center gap-3"
                                            >
                                                <BsBox className="text-[14px]" />
                                                <span className="text-[16px]">
                                                    Orders
                                                </span>
                                            </Link>
                                        </li>
                                        {auth.user && (
                                            <li className="p-1 hover:bg-slate-100 rounded-md">
                                                <Link
                                                    onClick={handleLogout}
                                                    to="/login"
                                                    className="flex items-center gap-3"
                                                >
                                                    <MdLogout className="text-[14px]" />
                                                    <span className="text-[16px]">
                                                        Logout
                                                    </span>
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {auth?.user?.role !== 1 && (
                            <NavLink
                                to="/cart"
                                className="relative flex items-center gap-1"
                            >
                                <span className="absolute w-4 h-4 text-[11px] text-center font-semibold left-2 bottom-3 text-white bg-red-500 rounded-full">
                                    {cartItems?.length}
                                </span>
                                <BsCart2 className="text-[22px]" />
                            </NavLink>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
