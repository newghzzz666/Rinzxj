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


export function Header({ children }: { children?: React.ReactNode }) {
    const profile = useContext(ProfileContext);
    const { t } = useTranslation()

    return useMemo(() => (
        <>
            {/* 顶栏容器：保持毛玻璃和半透明效果 */}
            <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/70 dark:bg-[#121212]/70 border-b border-neutral-200/30 dark:border-neutral-800/30 transition-all duration-300">
                <div className="w-full">
                    <Padding className="mx-4 mt-4 mb-2">
                        <div className="w-full flex justify-between items-center relative">
                            {/* 左侧 Logo */}
                            <Link aria-label={t('home')} href="/"
                                className="hidden opacity-0 md:opacity-100 duration-300 mr-auto md:flex flex-row items-center hover:opacity-80 transition-opacity">
                                <img src={process.env.AVATAR} alt="Avatar" className="w-11 h-11 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm" />
                                <div className="flex flex-col justify-center items-start mx-3">
                                    <p className="text-lg font-bold dark:text-white tracking-tight">
                                        {process.env.NAME}
                                    </p>
                                    <p className="text-xs text-neutral-500 font-medium">
                                        {process.env.DESCRIPTION}
                                    </p>
                                </div>
                            </Link>
                            
                            {/* 中间菜单容器 */}
                            <div
                                className="w-full md:w-max transition-all duration-500 md:absolute md:left-1/2 md:translate-x-[-50%] flex-row justify-center items-center">
                                {/* UI 修改重点：
                                    1. shadow-[...] 自定义高强度阴影，增强立体感
                                    2. hover:scale-[1.02] 鼠标放上去整体微微放大
                                    3. px-3 py-1.5 调整容器内边距
                                */}
                                <div
                                    className="flex flex-row items-center rounded-full px-3 py-1.5 
                                    bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-xl
                                    border border-neutral-200/50 dark:border-neutral-700/50
                                    shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.6)]
                                    hover:shadow-[0_15px_40px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)]
                                    hover:scale-[1.01] transition-all duration-300 ease-out">
                                    
                                    {/* 移动端显示的 Logo (小屏幕可见) */}
                                    <Link aria-label={t('home')} href="/"
                                        className="visible opacity-100 md:hidden md:opacity-0 duration-300 mr-auto flex flex-row items-center py-2 pr-4">
                                        <img src={process.env.AVATAR} alt="Avatar"
                                            className="w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-600" />
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
                    /* UI 修改细节：
                       1. mx-1: 增加左右间距，让菜单不挤
                       2. px-4 py-2: 增加点击区域和视觉留白
                       3. hover:-translate-y-0.5: 鼠标悬停时向上浮动 0.5个单位
                       4. hover:bg-neutral-100...: 悬停时的椭圆背景
                    */
                    className={`${menu ? "" : "hidden"} md:block cursor-pointer relative group
                    mx-1 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300
                    hover:bg-neutral-100 dark:hover:bg-white/10 hover:-translate-y-0.5
                    ${selected 
                        ? "text-black dark:text-white bg-neutral-100 dark:bg-white/10 shadow-sm" 
                        : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"}`}
                    state={{ animate: true }}
                    onClick={onClick}
                >
                    {title}
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
        <div className="visible md:hidden flex flex-row items-center pl-2 border-l border-neutral-200 dark:border-neutral-700 ml-2">
            <Popup
                arrow={false}
                trigger={<div>
                    <button onClick={() => setOpen(true)}
                        className="w-9 h-9 rounded-full flex flex-row items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                        <i className="ri-menu-line ri-lg text-neutral-600 dark:text-neutral-300" />
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
                overlayStyle={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
            >
                <div className="flex flex-col bg-white dark:bg-[#1c1c1c] rounded-2xl p-4 mt-4 w-[60vw] shadow-2xl border border-neutral-100 dark:border-neutral-800 ring-1 ring-black/5">
                    <div className="flex flex-row justify-end space-x-3 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-3">
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

const ACTION_BTN_CLASS = "flex rounded-full border border-neutral-200 dark:border-neutral-700 w-9 h-9 items-center justify-center text-neutral-600 dark:text-neutral-400 bg-white dark:bg-[#1e1e1e] hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all shadow-sm hover:scale-105";

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
                <div className="flex flex-col bg-white dark:bg-[#1e1e1e] border border-neutral-100 dark:border-neutral-700 rounded-xl overflow-hidden shadow-xl min-w-[120px] mt-2">
                    <p className='px-4 py-2 text-xs font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50'>
                        Languages
                    </p>
                    {languages.map(({ code, name }) => (
                        <button key={code} onClick={() => i18n.changeLanguage(code)} 
                            className="w-full text-left px-4 py-2.5 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
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
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    backdropFilter: "blur(4px)",
                    zIndex: 1000,
                },
            }}
            onRequestClose={() => setIsOpened(false)}
        >
            <div className="bg-white dark:bg-[#1e1e1e] w-full md:w-[500px] flex flex-row items-center justify-between p-4 space-x-4 shadow-2xl rounded-2xl border border-neutral-100 dark:border-neutral-700">
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
                <div className="w-9 h-9 relative group">
                    <img src={profile.avatar} alt="Avatar" className="w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-600 cursor-pointer shadow-sm transition-transform hover:scale-105" />
                    <div className="z-50 absolute left-0 top-0 w-9 h-9 flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300 bg-black/60 rounded-full cursor-pointer backdrop-blur-sm">
                        <IconSmall label={t('logout')} name="ri-logout-circle-line" onClick={() => {
                            removeCookie("token")
                            window.location.reload()
                        }} hover={false} className="text-white" />
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
