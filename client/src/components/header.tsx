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
        borderRadius: "24px", // 更圆润的圆角
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "center",
        background: "none",
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.6)", // 加深遮罩
        backdropFilter: "blur(4px)", // 遮罩模糊
        zIndex: 1000,
    },
};

export function Header({ children }: { children?: React.ReactNode }) {
    const profile = useContext(ProfileContext);
    const { t } = useTranslation();

    return (
        <>
            {/* Header 容器：
                1. backdrop-blur-xl: 极高模糊度，像磨砂玻璃
                2. border-b: 底部增加一条极细的微光边框
            */}
            <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 
                          backdrop-blur-xl bg-white/70 dark:bg-[#050505]/70 
                          border-b border-neutral-200/50 dark:border-white/5 shadow-sm">
                <div className="w-full max-w-screen-2xl mx-auto">
                    <Padding className="mx-4 my-2"> {/* 稍微减小垂直间距，更精致 */}
                        <div className="w-full flex justify-between items-center relative">
                            
                            {/* 左侧：Logo (增加悬停发光) */}
                            <Link aria-label={t('home')} href="/"
                                className="hidden opacity-0 md:opacity-100 duration-300 mr-auto md:flex flex-row items-center group">
                                <div className="relative overflow-hidden rounded-2xl">
                                    <img src={process.env.AVATAR} alt="Avatar" className="w-11 h-11 border border-neutral-200 dark:border-neutral-800 transition-transform duration-500 group-hover:scale-110" />
                                    {/* Logo 扫光特效 */}
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
                                {/* 大改动：这里的 div 变成了 "悬浮岛"
                                   1. ring-1: 细微的内描边
                                   2. shadow-xl: 柔和的投影
                                   3. hover:scale-[1.01]: 鼠标放上去微微变大
                                */}
                                <div className="flex flex-row items-center px-2 py-1.5 rounded-full
                                              bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md
                                              border border-white/20 dark:border-white/10
                                              ring-1 ring-black/5 dark:ring-white/5
                                              shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] dark:shadow-none
                                              transition-all duration-300 hover:shadow-lg hover:bg-white/80 dark:hover:bg-neutral-800/80">
                                    
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

// 导航项：大胆的样式
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
                       1. relative group: 用于定位下划线
                       2. hover:bg-black/5: 极淡的背景悬停
                       3. active:scale-95: 点击时微缩，手感好
                    */
                    className={`${menu ? "" : "hidden"} md:block cursor-pointer relative group
                                px-4 py-2 mx-0.5 rounded-full text-sm font-bold transition-all duration-200
                                hover:bg-black/5 dark:hover:bg-white/10 active:scale-95
                                ${selected ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"}`}
                    state={{ animate: true }}
                    onClick={onClick}
                >
                    {title}
                    {/* 选中时的底部光条：只有选中时才显示 */}
                    {selected && !menu && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></span>
                    )}
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
            <NavItem menu={menu} onClick={onClick} when={profile?.permission == true} title={t('settings.title')}
                selected={location === "/settings"}
                href="/settings" />
        </div>
    )
}

// 通用按钮样式：圆形、微弱边框、悬停变色
const ACTION_BTN_CLASS = "flex rounded-full border border-neutral-200 dark:border-neutral-700 w-10 h-10 items-center justify-center text-neutral-600 dark:text-neutral-400 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all duration-200 shadow-sm active:scale-90";

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
            {/* 搜索框：更大气，阴影更重 */}
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

    return (
        <> {config.get<boolean>('login.enabled') && <div className={className + " flex flex-row items-center"}>
            {profile?.avatar ? <>
                <div className="w-10 h-10 relative group cursor-pointer ml-1">
                    <img src={profile.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm transition-transform duration-300 group-hover:scale-105" />
                    <div className="z-50 absolute left-0 top-0 w-full h-full rounded-full bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 duration-200 flex items-center justify-center">
                        <IconSmall label={t('logout')} name="ri-logout-circle-line" onClick={() => {
                            removeCookie("token")
                            window.location.reload()
                        }} hover={false} className="text-white scale-90" />
                    </div>
                </div>
            </> : <>
                <button onClick={() => setIsOpened(true)} title={label} aria-label={label} className={ACTION_BTN_CLASS}>
                    <i className="ri-user-received-line"></i>
                </button>
            </>}
            <LoginModal />
        </div>
        }</>)
}
