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

// 提取 Modal 样式
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

// 通用按钮样式
const ACTION_BTN_CLASS = "flex rounded-full border border-neutral-200 dark:border-neutral-700 w-9 h-9 items-center justify-center text-neutral-600 dark:text-neutral-400 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all duration-200 shadow-sm active:scale-90";

export function Header({ children }: { children?: React.ReactNode }) {
    const profile = useContext(ProfileContext);
    const { t } = useTranslation();

    return useMemo(() => (
        <>
            {/* 灵动岛 Header 容器 */}
            <div className="fixed z-50 transition-all duration-300
                          top-3 left-3 right-3 rounded-3xl
                          md:top-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-max md:rounded-full
                          backdrop-blur-xl bg-white/80 dark:bg-[#0a0a0a]/80
                          border border-white/20 dark:border-white/5
                          shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                
                <div className="px-4 py-3 md:px-6 md:py-2 flex justify-between items-center relative min-w-full md:min-w-[700px]">
                    {/* 左侧：Logo & 文字 */}
                    <Link aria-label={t('home')} href="/"
                        className="flex flex-row items-center group mr-auto max-w-[60%] md:max-w-none">
                        <div className="relative overflow-hidden rounded-full flex-shrink-0">
                            <img src={process.env.AVATAR} alt="Avatar" className="w-9 h-9 md:w-10 md:h-10 border border-neutral-200 dark:border-neutral-800 transition-transform duration-500 md:group-hover:scale-110" />
                        </div>
                        <div className="flex flex-col justify-center items-start mx-3 overflow-hidden">
                            <p className="text-sm md:text-lg font-black text-neutral-900 dark:text-white leading-tight tracking-tight md:group-hover:text-[#FF4500] transition-colors truncate w-full">
                                {process.env.NAME}
                            </p>
                            <p className="text-[10px] md:text-xs text-neutral-500 font-bold uppercase tracking-wider truncate w-full">
                                {process.env.DESCRIPTION}
                            </p>
                        </div>
                    </Link>

                    {/* 中间：桌面端菜单 */}
                    <div className="hidden md:flex flex-row items-center justify-center absolute left-1/2 -translate-x-1/2">
                        <NavBar menu={false} />
                        {children}
                    </div>

                    {/* 右侧：功能按钮 */}
                    <div className="flex flex-row items-center space-x-2 md:space-x-3 ml-auto flex-shrink-0">
                        <div className="hidden md:flex items-center space-x-2">
                            <SearchButton />
                            <LanguageSwitch />
                        </div>
                        <UserAvatar profile={profile} />
                        <div className="md:hidden">
                            <Menu />
                        </div>
                    </div>
                </div>
            </div>
            {/* 占位符 */}
            <div className="h-28"></div>
        </>
    ), [profile, children]);
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
                    className={`${menu ? "w-full text-center py-3 text-base border-b border-neutral-100 dark:border-white/5 last:border-0" : "hidden md:block px-4 py-2 mx-1 rounded-full text-sm"} 
                                cursor-pointer relative group font-bold transition-all duration-200 ease-out transform-gpu
                                active:scale-95 md:active:scale-95
                                md:hover:scale-110 md:hover:text-[#FF4500] md:hover:bg-white/50 md:dark:hover:bg-white/5
                                ${selected 
                                    ? "text-[#FF4500] md:scale-110 md:bg-white md:dark:bg-neutral-800 md:shadow-sm" 
                                    : "text-neutral-500 dark:text-neutral-400"}`}
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
        <div className="flex flex-row items-center ml-1">
            <Popup
                arrow={false}
                trigger={
                    <button onClick={() => setOpen(true)}
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 active:scale-90 transition-transform">
                        <i className="ri-menu-line text-neutral-800 dark:text-neutral-200" />
                    </button>
                }
                position="bottom right"
                open={isOpen}
                nested
                onOpen={() => document.body.style.overflow = "hidden"}
                onClose={onClose}
                closeOnDocumentClick
                closeOnEscape
                overlayStyle={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1000 }}
                contentStyle={{ width: '90%', maxWidth: '400px', border: 'none', background: 'transparent' }}
            >
                <div className="flex flex-col bg-white dark:bg-[#121212] rounded-[32px] p-2 mt-4 shadow-2xl border border-white/20 dark:border-white/10 ring-1 ring-black/5 animate-in slide-in-from-top-5 duration-300">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="bg-neutral-50 dark:bg-white/5 rounded-2xl p-2 flex justify-center">
                            <SearchButton mobile />
                        </div>
                        <div className="bg-neutral-50 dark:bg-white/5 rounded-2xl p-2 flex justify-center">
                            <LanguageSwitch mobile />
                        </div>
                    </div>
                    <div className="flex flex-col bg-neutral-50 dark:bg-white/5 rounded-2xl p-2">
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
    const containerClass = menu ? "flex flex-col w-full" : "flex flex-row items-center";

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
            <NavItem menu={menu} onClick={onClick} when={profile?.permission == true} title={t('settings.title')}
                selected={location === "/settings"}
                href="/settings" />
        </div>
    )
}

function LanguageSwitch({ className, mobile }: { className?: string, mobile?: boolean }) {
    const { i18n } = useTranslation()
    const label = 'Languages'
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'zh-CN', name: '简体中文' },
        { code: 'zh-TW', name: '繁體中文' },
        { code: 'ja', name: '日本語' }
    ]
    
    if (mobile) {
        return (
            <div className="flex flex-row gap-2 items-center justify-center w-full" onClick={(e) => e.stopPropagation()}>
                 <button onClick={() => i18n.changeLanguage(i18n.language === 'zh-CN' ? 'en' : 'zh-CN')} className="w-full py-2 text-sm font-bold text-neutral-600 dark:text-neutral-300">
                    <i className="ri-translate-2 mr-1"></i> {i18n.language === 'zh-CN' ? 'EN' : '中'}
                 </button>
            </div>
        )
    }

    return (
        <div className={className + " flex flex-row items-center"}>
            <Popup trigger={
                <button title={label} aria-label={label} className={ACTION_BTN_CLASS}>
                    <i className="ri-translate-2"></i>
                </button>
            }
                position="bottom right"
                arrow={false}
                closeOnDocumentClick
                contentStyle={{ padding: '0px', border: 'none', borderRadius: '16px', boxShadow: '0 20px 40px -5px rgba(0, 0, 0, 0.1)' }}
            >
                <div className="flex flex-col bg-white dark:bg-[#121212] border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden min-w-[140px] p-1">
                    <p className='px-4 py-2 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1 pl-3'>
                        Languages
                    </p>
                    {languages.map(({ code, name }) => (
                        <button key={code} onClick={() => i18n.changeLanguage(code)}
                            className="px-3 py-2 text-sm text-left rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors dark:text-neutral-300 font-medium">
                            {name}
                        </button>
                    ))}
                </div>
            </Popup>
        </div>
    )
}

function SearchButton({ className, onClose, mobile }: { className?: string, onClose?: () => void, mobile?: boolean }) {
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

    if (mobile) {
        return (
            <div className="w-full">
                <button onClick={() => setIsOpened(true)} className="w-full py-2 text-sm font-bold text-neutral-600 dark:text-neutral-300">
                    <i className="ri-search-line mr-1"></i> Search
                </button>
                <ReactModal
                    isOpen={isOpened}
                    style={MODAL_STYLE}
                    onRequestClose={() => setIsOpened(false)}
                >
                    <div className="bg-white dark:bg-[#121212] w-[90vw] flex flex-row items-center justify-between p-4 space-x-2 rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800">
                        <Input value={value} setValue={setValue} placeholder={t('article.search.placeholder')}
                            autofocus
                            onSubmit={onSearch} />
                        <Button title="Go" onClick={onSearch} />
                    </div>
                </ReactModal>
            </div>
        )
    }

    return (<div className={className + " flex flex-row items-center"}>
        <button onClick={() => setIsOpened(true)} title={label} aria-label={label} className={ACTION_BTN_CLASS}>
            <i className="ri-search-line"></i>
        </button>
        <ReactModal
            isOpen={isOpened}
            style={MODAL_STYLE}
            onRequestClose={() => setIsOpened(false)}
        >
            <div className="bg-white dark:bg-[#121212] w-full md:w-[500px] flex flex-row items-center justify-between p-5 space-x-4 rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800">
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

    // 安全获取配置：使用 as boolean 或类型断言
    const loginEnabled = config.get('login.enabled') as boolean;

    if (!loginEnabled) {
        return null;
    }

    return (
        <div className={className + " flex flex-row items-center"}>
            {profile?.avatar ? (
                <div className="w-9 h-9 relative group cursor-pointer ml-1">
                    <img src={profile.avatar} alt="Avatar" className="w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm transition-transform duration-300 md:group-hover:scale-105 active:scale-95" />
                    <div className="z-50 absolute left-0 top-0 w-full h-full rounded-full bg-black/40 backdrop-blur-[1px] opacity-0 md:group-hover:opacity-100 duration-200 flex items-center justify-center">
                        <IconSmall label={t('logout')} name="ri-logout-circle-line" onClick={() => {
                            removeCookie("token")
                            window.location.reload()
                        }} hover={false} className="text-white scale-90" />
                    </div>
                </div>
            ) : (
                <button onClick={() => setIsOpened(true)} title={label} aria-label={label} className={ACTION_BTN_CLASS}>
                    <i className="ri-user-received-line"></i>
                </button>
            )}
            <LoginModal />
        </div>
    )
}
