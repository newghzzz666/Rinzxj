import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactModal from "react-modal";
import Popup from "reactjs-popup";
import { removeCookie } from "typescript-cookie";
import { Link, useLocation } from "wouter";
import { useLoginModal } from "../hooks/useLoginModal";
import { Profile, ProfileContext } from "../state/profile";
import { Button } from "./button";
import { IconSmall } from "./icon";
import { Input } from "./input";
import { Padding } from "./padding";
import { ClientConfigContext } from "../state/config";

// 提取 Modal 样式为常量
const MODAL_STYLE = {
    content: {
        top: "20%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        padding: "0",
        border: "none",
        borderRadius: "24px",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "center",
        background: "none",
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
    },
};

export function Header({ children }: { children?: React.ReactNode }) {
    const profile = useContext(ProfileContext);
    const { t } = useTranslation();

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 
                          backdrop-blur-xl bg-white/70 dark:bg-[#050505]/70 
                          border-b border-neutral-200/50 dark:border-white/5 shadow-sm">
                <div className="w-full max-w-screen-2xl mx-auto">
                    <Padding className="mx-4 my-2">
                        <div className="w-full flex justify-between items-center relative">
                            
                            {/* 左侧：Logo */}
                            <Link aria-label={t('home')} href="/"
                                className="hidden opacity-0 md:opacity-100 duration-300 mr-auto md:flex flex-row items-center group">
                                <div className="relative overflow-hidden rounded-2xl">
                                    <img src={process.env.AVATAR} alt="Avatar" className="w-11 h-11 border border-neutral-200 dark:border-neutral-800 transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                </div>
                                <div className="flex flex-col justify-center items-start mx-3">
                                    <p className="text-lg font-black dark:text-white leading-tight tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neutral-800 group-hover:to-neutral-500 dark:group-hover:from-white dark:group-hover:to-neutral-400 transition-all">
                                        {process.env.NAME}
                                    </p>
                                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                                        {process.env.DESCRIPTION}
                                    </p>
                                </div>
                            </Link>

                            {/* 中间：悬浮岛菜单 */}
                            <div className="w-full md:w-max transition-all duration-500 md:absolute md:left-1/2 md:translate-x-[-50%] flex flex-row justify-center items-center">
                                <div className="flex flex-row items-center px-1.5 py-1.5 rounded-full
                                              bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md
                                              border border-white/20 dark:border-white/10
                                              ring-1 ring-black/5 dark:ring-white/5
                                              shadow-sm hover:shadow-lg transition-all duration-300">
                                    
                                    {/* 移动端 Logo */}
                                    <Link aria-label={t('home')} href="/"
                                        className="visible opacity-100 md:hidden md:opacity-0 duration-300 mr-auto flex flex-row items-center py-1 pl-1 pr-3">
                                        <img src={process.env.AVATAR} alt="Avatar"
                                            className="w-9 h-9 rounded-full border border-neutral-200" />
                                    </Link>

                                    <NavBar menu={false} />
                                    {children}
                                    <Menu />
                                </div>
                            </div>

                            {/* 右侧：功能按钮 */}
                            <div className="ml-auto hidden opacity-0 md:opacity-100 duration-300 md:flex flex-row items-center space-x-2">
                                <SearchButton />
                                <LanguageSwitch />
                                <UserAvatar profile={profile} />
                            </div>
                        </div>
                    </Padding>
                </div>
            </div>
            {/* 占位符 */}
            <div className="h-24"></div>
        </>
    );
}

// 核心修改：NavItem (菜单项)
function NavItem({ menu, title, selected, href, when = true, onClick }: {
    title: string,
    selected: boolean,
    href: string,
    menu?: boolean,
    when?: boolean,
    onClick?: () => void
}) {
    return (
        <>
            {when &&
                <Link href={href}
                    /* 修改解析：
                       1. duration-300 ease-out transform-gpu: 保证动画丝滑且不卡顿
                       2. hover:scale-110: 鼠标悬停变大 (像头像一样)
                       3. hover:text-[#FF4500]: 悬停变橘色
                       4. selected状态: 
                          - text-[#FF4500]: 文字橘红
                          - scale-110: 保持放大
                          - bg-white dark:bg-white/10: 增加背景色
                          - shadow-[...]: 增加橘色系的柔和阴影，产生立体浮空感
                    */
                    className={`${menu ? "" : "hidden"} md:block cursor-pointer relative group
                                px-4 py-2 mx-1 rounded-full text-sm font-bold transition-all duration-300 ease-out transform-gpu
                                hover:scale-110 hover:text-[#FF4500] hover:bg-white/50 dark:hover:bg-white/5
                                ${selected 
                                    ? "text-[#FF4500] scale-110 bg-white dark:bg-neutral-800 shadow-[0_4px_12px_rgba(255,69,0,0.25)] ring-1 ring-black/5 dark:ring-white/10" 
                                    : "text-neutral-500 dark:text-neutral-400"}`}
                    state={{ animate: true }}
                    onClick={onClick}
                >
                    {title}
                    {/* 已删除下方的小圆点 span */}
                </Link>}
        </>
    )
}

function Menu() {
    const profile = useContext(ProfileContext);
    const [isOpen, setOpen] = useState(false)

    function onClose() {
        document.body.style.overflow = "auto"
        setOpen(false)
    }

    return (
        <div className="visible md:hidden flex flex-row items-center ml-2">
            <Popup
                arrow={false}
                trigger={
                    <button onClick={() => setOpen(true)}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                        <i className="ri-menu-line ri-lg text-neutral-800 dark:text-neutral-200" />
                    </button>
                }
                position="bottom right"
                open={isOpen}
                nested
                onOpen={() => document.body.style.overflow = "hidden"}
                onClose={onClose}
                closeOnDocumentClick
                closeOnEscape
                overlayStyle={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }}
            >
                <div className="flex flex-col bg-white dark:bg-[#121212] rounded-3xl p-5 mt-4 w-[70vw] shadow-2xl border border-neutral-100 dark:border-neutral-800 ring-1 ring-black/5">
                    <div className="flex flex-row justify-end space-x-3 mb-4">
                        <SearchButton onClose={onClose} />
                        <LanguageSwitch />
                        <UserAvatar profile={profile} />
                    </div>
                    <div className="flex flex-col space-y-1">
                         <NavBar menu={true} onClick={onClose} />
                    </div>
                </div>
            </Popup>
        </div>
    )
}

function NavBar({ menu, onClick }: { menu: boolean, onClick?: () => void }) {
    const profile = useContext(ProfileContext);
    const [location] = useLocation();
    const { t } = useTranslation()
    const containerClass = menu ? "flex flex-col space-y-1 w-full" : "flex flex-row items-center";

    return (
        <div className={containerClass}>
            <NavItem menu={menu} onClick={onClick} title={t('article.title')}
                selected={location === "/" || location.startsWith('/feed')} href="/" />
            <NavItem menu={menu} onClick={onClick} title={t('timeline')} selected={location === "/timeline"} href="/timeline" />
            <NavItem menu={menu} onClick={onClick} title={t('moments.title')} selected={location === "/moments"} href="/moments" />
            <NavItem menu={menu} onClick={onClick} title={t('hashtags')} selected={location === "/hashtags"} href="/hashtags" />
            <NavItem menu={menu} onClick={onClick} when={profile?.permission == true} title={t('writing')}
                selected={location.startsWith("/writing")} href="/writing" />
            <NavItem menu={menu} onClick={onClick} title={t('friends.title')} selected={location === "/friends"} href="/friends" />
            <NavItem menu={menu} onClick={onClick} title={t('about.title')} selected={location === "/about"} href="/about" />
