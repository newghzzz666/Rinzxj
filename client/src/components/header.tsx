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
import { ClientConfigContext } from "../state/config";

// 定义通用按钮样式
const ICON_BTN_CLASS = "w-9 h-9 rounded-full flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-95";

export function Header({ children }: { children?: React.ReactNode }) {
    const profile = useContext(ProfileContext);
    const { t } = useTranslation()

    return useMemo(() => (
        <>
            {/* 大改动：Header 容器 
                1. md:top-6: 电脑端距离顶部有 24px 间距 (悬浮感)
                2. md:w-auto: 电脑端宽度自适应
                3. md:rounded-full: 电脑端是大圆角胶囊
                4. top-0 w-full: 手机端依然是吸顶通栏
            */}
            <div className="fixed z-50 left-0 right-0 flex justify-center transition-all duration-500
                            top-0 w-full 
                            md:top-6 md:w-auto">
                
                <div className="relative group">
                    {/* 背景与边框层：增加流光溢彩的渐变边框效果 */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-purple-600 rounded-none md:rounded-full opacity-30 group-hover:opacity-60 blur transition duration-1000 group-hover:duration-200"></div>
                    
                    {/* 核心内容层 */}
                    <div className="relative flex items-center justify-between px-4 py-2 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-xl border-b md:border border-white/10 shadow-2xl rounded-none md:rounded-full min-w-[320px] md:min-w-[700px] transition-all duration-300">
                        
                        {/* 1. 左侧 Logo */}
                        <Link aria-label={t('home')} href="/" className="flex items-center gap-3 mr-4 group/logo">
                            <img src={process.env.AVATAR} alt="Avatar" className="w-9 h-9 rounded-full border-2 border-transparent group-hover/logo:border-orange-500 transition-all duration-300" />
                            <div className="flex flex-col">
                                <span className="font-bold text-sm tracking-wide dark:text-white group-hover/logo:text-orange-500 transition-colors">
                                    {process.env.NAME}
                                </span>
                            </div>
                        </Link>

                        {/* 2. 中间菜单 (桌面端显示，移动端隐藏) */}
                        <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                            <NavBar menu={false} />
                            {children}
                        </div>

                        {/* 3. 右侧功能区 */}
                        <div className="flex items-center gap-1">
                            <div className="hidden md:flex items-center gap-1">
                                <SearchButton />
                                <LanguageSwitch />
                            </div>
                            
                            {/* 分割线 */}
                            <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800 mx-2 hidden md:block"></div>
                            
                            <UserAvatar profile={profile} />
                            
                            {/* 移动端菜单按钮 (汉堡包) */}
                            <div className="md:hidden ml-1">
                                <Menu />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 占位符：因为 Header 悬浮了，不需要太大占位，但为了防止遮挡加一点 */}
            <div className="h-24 md:h-32"></div>
        </>
    ), [profile, children])
}

// 导航菜单项
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
                    className={`${menu ? "block w-full text-left py-3 px-4 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5" : "hidden md:block"} 
                    text-sm font-medium transition-all duration-200 px-4 py-1.5 rounded-full relative group
                    ${selected 
                        ? "text-orange-500" 
                        : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"}`}
                    state={{ animate: true }}
                    onClick={onClick}
                >
                    {title}
                    {/* 桌面端的底部光标动画 */}
                    {!menu && (
                        <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-1/2 ${selected ? 'w-1/2' : ''}`}></span>
                    )}
                </Link>}
        </>
    )
}

// 移动端折叠菜单
function Menu() {
    const profile = useContext(ProfileContext);
    const [isOpen, setOpen] = useState(false)

    function onClose() {
        document.body.style.overflow = "auto"
        setOpen(false)
    }

    return (
        <div className="flex items-center">
            <Popup
                arrow={false}
                trigger={
                    <button onClick={() => setOpen(true)} className={ICON_BTN_CLASS}>
                        <i className="ri-menu-4-line ri-lg" />
                    </button>
                }
                position="bottom right"
                open={isOpen}
                nested
                onOpen={() => document.body.style.overflow = "hidden"}
                onClose={onClose}
                closeOnDocumentClick
                closeOnEscape
                overlayStyle={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            >
                <div className="bg-white dark:bg-[#09090b] w-[80vw] max-w-[300px] p-4 m-4 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col gap-2">
                    {/* 移动端菜单内部头部 */}
                    <div className="flex justify-between items-center pb-4 border-b dark:border-white/10 mb-2">
                        <span className="text-xs font-bold text-neutral-400 uppercase">Menu</span>
                        <div className="flex gap-2">
                            <SearchButton />
                            <LanguageSwitch />
                        </div>
                    </div>
                    <NavBar menu={true} onClick={onClose} />
                </div>
            </Popup>
        </div>
    )
}

// 导航逻辑组件
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

// 语言切换
function LanguageSwitch({ className }: { className?: string }) {
    const { i18n } = useTranslation()
    const languages = [
        { code: 'en', name: 'EN' },
        { code: 'zh-CN', name: '简' },
        { code: 'zh-TW', name: '繁' },
        { code: 'ja', name: 'JP' }
    ]
    return (
        <div className={className}>
            <Popup trigger={
                <button className={ICON_BTN_CLASS} title="Language">
                    <i className="ri-translate-2"></i>
                </button>
            }
                position="bottom right"
                arrow={false}
                closeOnDocumentClick
                contentStyle={{ padding: '0px', border: 'none' }}
            >
                <div className="bg-white dark:bg-[#09090b] border dark:border-white/10 rounded-xl shadow-xl overflow-hidden min-w-[80px] mt-2 p-1">
                    {languages.map(({ code, name }) => (
                        <button key={code} onClick={() => i18n.changeLanguage(code)} 
                            className="w-full text-center py-2 text-sm font-medium rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 dark:text-neutral-300">
                            {name}
                        </button>
                    ))}
                </div>
            </Popup>
        </div>
    )
}

// 搜索按钮
function SearchButton({ className, onClose }: { className?: string, onClose?: () => void }) {
    const { t } = useTranslation()
    const [isOpened, setIsOpened] = useState(false);
    const [_, setLocation] = useLocation()
    const [value, setValue] = useState('')
    
    const onSearch = () => {
        const key = `${encodeURIComponent(value)}`
        setTimeout(() => {
            setIsOpened(false)
            if (value.length !== 0) onClose?.()
        }, 100)
        if (value.length !== 0) setLocation(`/search/${key}`)
    }

    return (<div className={className}>
        <button onClick={() => setIsOpened(true)} className={ICON_BTN_CLASS} title="Search">
            <i className="ri-search-line"></i>
        </button>
        <ReactModal
            isOpen={isOpened}
            style={{
                content: {
                    top: "15%",
                    left: "50%",
                    transform: "translate(-50%, -15%)",
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    overflow: "visible"
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    backdropFilter: "blur(5px)",
                    zIndex: 1000,
                },
            }}
            onRequestClose={() => setIsOpened(false)}
        >
            <div className="bg-white dark:bg-[#09090b] w-[90vw] md:w-[600px] p-4 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex gap-3 items-center animate-in fade-in zoom-in-95 duration-200">
                <Input value={value} setValue={setValue} placeholder={t('article.search.placeholder')}
                    autofocus onSubmit={onSearch} />
                <Button title={t("close")} onClick={onSearch} />
            </div>
        </ReactModal>
    </div>)
}

// 用户头像
function UserAvatar({ className, profile, onClose }: { className?: string, profile?: Profile, onClose?: () => void }) {
    const { t } = useTranslation()
    const { LoginModal, setIsOpened } = useLoginModal(onClose)
    const config = useContext(ClientConfigContext);
    
    // 提前获取配置，避免JSX错误
    const loginEnabled = config.get<boolean>('login.enabled');

    if (!loginEnabled) return null;

    return (
        <div className={className + " flex items-center"}>
            {profile?.avatar ? (
                <div className="w-9 h-9 relative group cursor-pointer ml-2">
                    <img src={profile.avatar} alt="Avatar" className="w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-700 transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[1px]">
                        <IconSmall label={t('logout')} name="ri-logout-circle-line" onClick={() => {
                            removeCookie("token")
                            window.location.reload()
                        }} hover={false} className="text-white scale-75" />
                    </div>
                </div>
            ) : (
                <button onClick={() => setIsOpened(true)} className={`${ICON_BTN_CLASS} bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white ml-2`}>
                    <i className="ri-user-received-line"></i>
                </button>
            )}
            <LoginModal />
        </div>
    )
}
