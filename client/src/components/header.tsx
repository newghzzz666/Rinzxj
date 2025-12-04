import { useContext, useMemo, useState } from "react";
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

// 定义主题色：橘红色 (可随时调整)
const ACCENT_COLOR = "text-[#FF4500]"; // 橘红文字
const ACCENT_BORDER = "border-[#FF4500]"; // 橘红边框
const ACCENT_HOVER_BG = "hover:bg-[#FF4500]/10"; // 悬停时的淡淡橘红背景

export function Header({ children }: { children?: React.ReactNode }) {
    const profile = useContext(ProfileContext);
    const { t } = useTranslation()

    return useMemo(() => (
        <>
            {/* Header 容器：
                1. bg-[#0a0a0a]/80: 极夜黑半透明背景
                2. border-t-2 border-[#FF4500]: 顶部的橘红色“能量条”装饰
            */}
            <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-[#050505]/80 border-t-2 border-[#FF4500] border-b border-transparent dark:border-white/5 transition-all duration-300">
                <div className="w-full">
                    <Padding className="mx-4 mt-3 mb-3">
                        <div className="w-full flex justify-between items-center relative">
                            
                            {/* LOGO 区域 */}
                            <Link aria-label={t('home')} href="/"
                                className="hidden opacity-0 md:opacity-100 duration-300 mr-auto md:flex flex-row items-center group">
                                <div className="relative">
                                    <img src={process.env.AVATAR} alt="Avatar" 
                                        className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-800 group-hover:border-[#FF4500] transition-colors duration-300" />
                                </div>
                                <div className="flex flex-col justify-center items-start mx-3">
                                    <p className="text-lg font-black dark:text-white tracking-tight leading-tight group-hover:text-[#FF4500] transition-colors duration-300">
                                        {process.env.NAME}
                                    </p>
                                    <p className="text-xs text-neutral-500 font-medium">
                                        {process.env.DESCRIPTION}
                                    </p>
                                </div>
                            </Link>
                            
                            {/* 中间导航区：去掉了外框，纯文字悬浮 */}
                            <div className="w-full md:w-max transition-all duration-500 md:absolute md:left-1/2 md:translate-x-[-50%] flex-row justify-center items-center">
                                <div className="flex flex-row items-center justify-center">
                                    {/* 移动端 Logo */}
                                    <Link aria-label={t('home')} href="/"
                                        className="visible opacity-100 md:hidden md:opacity-0 duration-300 mr-auto flex flex-row items-center py-2 pr-4">
                                        <img src={process.env.AVATAR} alt="Avatar"
                                            className="w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-800" />
                                    </Link>

                                    <NavBar menu={false} />
                                    {children}
                                    <Menu />
                                </div>
                            </div>

                            {/* 右侧功能区 */}
                            <div className="ml-auto hidden opacity-0 md:opacity-100 duration-300 md:flex flex-row items-center space-x-3">
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
    ), [profile, children])
}

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
                    /* NavItem 样式：
                       1. 默认灰色文字，悬停变橘红色 (text-[#FF4500])
                       2. 选中状态：橘红色 + 加粗
                       3. 鼠标悬停：微微上浮 (-translate-y-0.5)
                    */
                    className={`${menu ? "" : "hidden"} md:block cursor-pointer relative group
                    mx-2 px-3 py-2 text-sm font-bold transition-all duration-300 ease-out transform-gpu
                    hover:-translate-y-0.5 hover:text-[#FF4500]
                    ${selected 
                        ? "text-[#FF4500] drop-shadow-[0_0_8px_rgba(255,69,0,0.4)]" 
                        : "text-neutral-500 dark:text-neutral-400"}`}
                    state={{ animate: true }}
                    onClick={onClick}
                >
                    {title}
                    {/* 选中时底部的小光点 */}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF4500] transition-all duration-300 ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}></span>
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
        <div className="visible md:hidden flex flex-row items-center pl-2 ml-2">
            <Popup
                arrow={false}
                trigger={<div>
                    <button onClick={() => setOpen(true)}
                        className="w-10 h-10 rounded-full flex flex-row items-center justify-center active:scale-95 transition-transform">
                        <i className="ri-menu-line ri-lg text-neutral-800 dark:text-white hover:text-[#FF4500]" />
                    </button>
                </div>
                }
                position="bottom right"
                open={isOpen}
                nested
                onOpen={() => document.body.style.overflow = "hidden"}
                onClose={onClose}
                closeOnDocumentClick
                closeOnEscape
                overlayStyle={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)" }}
            >
                {/* 移动端菜单弹窗：增加橘色边框 */}
                <div className="flex flex-col bg-white dark:bg-[#0a0a0a] rounded-xl p-5 mt-4 w-[70vw] shadow-2xl border border-neutral-100 dark:border-neutral-800 border-t-4 border-t-[#FF4500]">
                    <div className="flex flex-row justify-end space-x-4 mb-6">
                        <SearchButton onClose={onClose} />
                        <LanguageSwitch />
                        <UserAvatar profile={profile} />
                    </div>
                    <div className="flex flex-col space-y-2">
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
    return (
        <>
            <NavItem menu={menu} onClick={onClick} title={t('article.title')}
                selected={location === "/" || location.startsWith('/feed')} href="/" />
            <NavItem menu={menu} onClick={onClick} title={t('timeline')} selected={location === "/timeline"} href="/timeline" />
            <NavItem menu={menu} onClick={onClick} title={t('moments.title')} selected={location === "/moments"} href="/moments" />
            <NavItem menu={menu} onClick={onClick} title={t('hashtags')} selected={location === "/hashtags"} href="/hashtags" />
            <NavItem menu={menu} onClick={onClick} when={profile?.permission == true} title={t('writing')}
                selected={location.startsWith("/writing")} href="/writing" />
            <NavItem menu={menu} onClick={onClick} title={t('friends.title')} selected={location === "/friends"} href="/friends" />
            <NavItem menu={menu} onClick={onClick} title={t('about.title')} selected={location === "/about"} href="/about" />
            <NavItem menu={menu} onClick={onClick} when={profile?.permission == true} title={t('settings.title')}
                selected={location === "/settings"}
                href="/settings" />
        </>
    )
}

// 右侧圆形按钮样式
const ACTION_BTN_CLASS = "flex rounded-full border border-neutral-200 dark:border-neutral-800 w-10 h-10 items-center justify-center text-neutral-600 dark:text-neutral-400 bg-transparent hover:border-[#FF4500] hover:text-[#FF4500] transition-all duration-300 cursor-pointer";

function LanguageSwitch({ className }: { className?: string }) {
    const { i18n } = useTranslation()
    const label = 'Languages'
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'zh-CN', name: '简体中文' },
        { code: 'zh-TW', name: '繁體中文' },
        { code: 'ja', name: '日本語' }
    ]
    return (
        <div className={className + " flex flex-row items-center"}>
            <Popup trigger={
                <button title={label} aria-label={label}
                    className={ACTION_BTN_CLASS}>
                    <i className="ri-translate-2"></i>
                </button>
            }
                position="bottom right"
                arrow={false}
                closeOnDocumentClick
                contentStyle={{ padding: '0px', border: 'none' }}
            >
                <div className="flex flex-col bg-white dark:bg-[#0a0a0a] border border-neutral-100 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xl min-w-[140px] mt-2">
                    <p className='px-4 py-3 text-xs font-bold text-[#FF4500] uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900'>
                        Languages
                    </p>
                    {languages.map(({ code, name }) => (
                        <button key={code} onClick={() => i18n.changeLanguage(code)} 
                            className="w-full text-left px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-[#FF4500]/10 hover:text-[#FF4500] transition-colors">
                            {name}
                        </button>
                    ))}
                </div>
            </Popup>
        </div>
    )
}

function SearchButton({ className, onClose }: { className?: string, onClose?: () => void }) {
    const { t } = useTranslation()
    const [isOpened, setIsOpened] = useState(false);
    const [_, setLocation] = useLocation()
    const [value, setValue] = useState('')
    const label = t('article.search.title')
    const onSearch = () => {
        const key = `${encodeURIComponent(value)}`
        setTimeout(() => {
            setIsOpened(false)
            if (value.length !== 0)
                onClose?.()
        }, 100)
        if (value.length !== 0)
            setLocation(`/search/${key}`)
    }
    return (<div className={className + " flex flex-row items-center"}>
        <button onClick={() => setIsOpened(true)} title={label} aria-label={label}
            className={ACTION_BTN_CLASS}>
            <i className="ri-search-line"></i>
        </button>
        <ReactModal
            isOpen={isOpened}
            style={{
                content: {
                    top: "20%",
                    left: "50%",
                    right: "auto",
                    bottom: "auto",
                    marginRight: "-50%",
                    transform: "translate(-50%, -50%)",
                    padding: "0",
                    border: "none",
                    borderRadius: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "none",
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.8)", // 深色遮罩
                    backdropFilter: "blur(8px)", // 强模糊
                    zIndex: 1000,
                },
            }}
            onRequestClose={() => setIsOpened(false)}
        >
            {/* 搜索框：暗黑风格 */}
            <div className="bg-white dark:bg-[#0a0a0a] w-full md:w-[600px] flex flex-row items-center justify-between p-6 space-x-4 shadow-2xl rounded-2xl border border-neutral-200 dark:border-neutral-800 border-t-4 border-t-[#FF4500]">
                <Input value={value} setValue={setValue} placeholder={t('article.search.placeholder')}
                    autofocus
                    onSubmit={onSearch} />
                <Button title={value.length === 0 ? t("close") : label} onClick={onSearch} />
            </div>
        </ReactModal>
    </div>
    )
}


function UserAvatar({ className, profile, onClose }: { className?: string, profile?: Profile, onClose?: () => void }) {
    const { t } = useTranslation()
    const { LoginModal, setIsOpened } = useLoginModal(onClose)
    const label = t('github_login')
    const config = useContext(ClientConfigContext);


    return (
        <> {config.get<boolean>('login.enabled') && <div className={className + " flex flex-row items-center"}>
            {profile?.avatar ? <>
                <div className="w-10 h-10 relative group">
                    <img src={profile.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800 cursor-pointer transition-transform duration-300 transform-gpu group-hover:scale-110 group-hover:border-[#FF4500]" />
                    <div className="z-50 absolute left-0 top-0 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300 bg-black/60 rounded-full cursor-pointer backdrop-blur-sm group-hover:scale-110 transition-transform">
                        <IconSmall label={t('logout')} name="ri-logout-circle-line" onClick={() => {
                            removeCookie("token")
                            window.location.reload()
                        }} hover={false} className="text-[#FF4500]" />
                    </div>
                </div>
            </> : <>
                <button onClick={() => setIsOpened(true)} title={label} aria-label={label}
                    className={ACTION_BTN_CLASS}>
                    <i className="ri-user-received-line"></i>
                </button>
            </>}
            <LoginModal />
        </div>
        }</>)
}
