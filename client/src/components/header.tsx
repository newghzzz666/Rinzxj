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
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "center",
        background: "none",
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
    },
};

export function Header({ children }: { children?: React.ReactNode }) {
    const profile = useContext(ProfileContext);
    const { t } = useTranslation();

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 shadow-sm border-b border-neutral-200/50 dark:border-neutral-800/50">
                <div className="w-full max-w-screen-2xl mx-auto">
                    <Padding className="mx-4 my-3">
                        <div className="w-full flex justify-between items-center relative">
                            {/* 左侧：Logo */}
                            <Link aria-label={t('home')} href="/"
                                className="hidden opacity-0 md:opacity-100 duration-300 mr-auto md:flex flex-row items-center hover:opacity-80 transition-opacity">
                                <img src={process.env.AVATAR} alt="Avatar" className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm" />
                                <div className="flex flex-col justify-center items-start mx-3">
                                    <p className="text-lg font-bold dark:text-white leading-tight">
                                        {process.env.NAME}
                                    </p>
                                    <p className="text-xs text-neutral-500 font-medium">
                                        {process.env.DESCRIPTION}
                                    </p>
                                </div>
                            </Link>

                            {/* 中间：导航栏 */}
                            <div className="w-full md:w-max transition-all duration-500 md:absolute md:left-1/2 md:translate-x-[-50%] flex flex-row justify-center items-center">
                                <div className="flex flex-row items-center bg-white dark:bg-neutral-800 t-primary rounded-full px-1 py-1 shadow-lg shadow-neutral-200/50 dark:shadow-none border border-neutral-100 dark:border-neutral-700">
                                    <Link aria-label={t('home')} href="/"
                                        className="visible opacity-100 md:hidden md:opacity-0 duration-300 mr-auto flex flex-row items-center py-1 pl-1 pr-3">
                                        <img src={process.env.AVATAR} alt="Avatar"
                                            className="w-8 h-8 rounded-full border border-neutral-200" />
                                        <div className="flex flex-col justify-center items-start mx-2">
                                            <p className="text-sm font-bold truncate max-w-[100px]">
                                                {process.env.NAME}
                                            </p>
                                        </div>
                                    </Link>

                                    <NavBar menu={false} />
                                    {children}
                                    <Menu />
                                </div>
                            </div>

                            {/* 右侧：功能按钮 */}
                            <div className="ml-auto hidden opacity-0 md:opacity-100 duration-300 md:flex flex-row items-center space-x-3">
                                <SearchButton />
                                <LanguageSwitch />
                                <UserAvatar profile={profile} />
                            </div>
                        </div>
                    </Padding>
                </div>
            </div>
            <div className="h-24"></div>
        </>
    );
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
                    className={`${menu ? "" : "hidden"} md:block cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700/50 rounded-full duration-200 px-4 py-2 text-sm font-medium ${selected ? "text-theme bg-neutral-50 dark:bg-neutral-700/30" : "text-neutral-600 dark:text-neutral-300"}`}
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
        <div className="visible md:hidden flex flex-row items-center ml-2">
            <Popup
                arrow={false}
                trigger={
                    <button onClick={() => setOpen(true)}
                        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                        <i className="ri-menu-line ri-lg" />
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
                <div className="flex flex-col bg-white dark:bg-neutral-800 rounded-2xl p-4 mt-4 w-[60vw] shadow-2xl border border-neutral-100 dark:border-neutral-700">
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
    const containerClass = menu ? "flex flex-col space-y-1 w-full" : "flex flex-row items-center space-x-1";

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

const ACTION_BTN_CLASS = "flex rounded-full border border-neutral-200 dark:border-neutral-700 w-9 h-9 items-center justify-center text-neutral-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shadow-sm";

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
                <button title={label} aria-label={label} className={ACTION_BTN_CLASS}>
                    <i className="ri-translate-2"></i>
                </button>
            }
                position="bottom right"
                arrow={false}
                closeOnDocumentClick
                contentStyle={{ padding: '0px', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            >
                <div className="flex flex-col bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl overflow-hidden min-w-[120px]">
                    <p className='px-4 py-2 text-xs font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-700'>
                        Languages
                    </p>
                    {languages.map(({ code, name }) => (
                        <button key={code} onClick={() => i18n.changeLanguage(code)}
                            className="px-4 py-2 text-sm text-left hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors dark:text-neutral-200">
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
        <button onClick={() => setIsOpened(true)} title={label} aria-label={label} className={ACTION_BTN_CLASS}>
            <i className="ri-search-line"></i>
        </button>
        <ReactModal
            isOpen={isOpened}
            style={MODAL_STYLE}
            onRequestClose={() => setIsOpened(false)}
        >
            <div className="bg-white dark:bg-neutral-900 w-full md:w-[500px] flex flex-row items-center justify-between p-4 space-x-4 rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-700">
                <Input value={value} setValue={setValue} placeholder={t('article.search.placeholder')}
                    autofocus
                    onSubmit={onSearch} />
                <Button title={value.length === 0 ? t("close") : label} onClick={onSearch} />
            </div>
        </ReactModal>
    </div>
    )
}

// 已完全重构，确保不会报错
function UserAvatar({ className, profile, onClose }: { className?: string, profile?: Profile, onClose?: () => void }) {
    const { t } = useTranslation();
    const { LoginModal, setIsOpened } = useLoginModal(onClose);
    const label = t('github_login');
    const config = useContext(ClientConfigContext);

    // 将判断逻辑移到 JSX 之外，避免 TSX 解析错误
    const loginEnabled = config.get<boolean>('login.enabled');

    if (!loginEnabled) {
        return null;
    }

    return (
        <div className={className + " flex flex-row items-center"}>
            {profile?.avatar ? (
                <div className="w-9 h-9 relative group cursor-pointer">
                    <img src={profile.avatar} alt="Avatar" className="w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-600 shadow-sm" />
                    <div className="z-50 absolute left-0 top-0 w-full h-full rounded-full bg-black/50 opacity-0 group-hover:opacity-100 duration-300 flex items-center justify-center">
                        <IconSmall label={t('logout')} name="ri-logout-circle-line" onClick={() => {
                            removeCookie("token");
                            window.location.reload();
                        }} hover={false} className="text-white" />
                    </div>
                </div>
            ) : (
                <button onClick={() => setIsOpened(true)} title={label} aria-label={label} className={ACTION_BTN_CLASS}>
                    <i className="ri-user-received-line"></i>
                </button>
            )}
            <LoginModal />
        </div>
    );
}
