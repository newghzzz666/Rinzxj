import React, { useContext, useState } from "react";
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

// --- 样式常量 ---
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

const ROUND_BTN_CLASS = "flex shrink-0 w-9 h-9 rounded-full items-center justify-center border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-all active:scale-95 hover:bg-neutral-100 dark:hover:bg-neutral-700";

// --- 主组件 ---
export function Header({ children }: { children?: React.ReactNode }) {
    const profile = useContext(ProfileContext);
    const { t } = useTranslation();

    // 修复：直接返回 JSX，移除了导致报错的 useMemo
    return (
        <>
            {/* ===========================================================================
               1. 移动端 Header (md:hidden) - 回归原版：贴顶、通栏、稳健
               =========================================================================== */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-200 dark:border-white/5 transition-colors duration-300">
                <Padding className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* 移动端左侧 Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <img src={process.env.AVATAR} alt="Avatar" className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-700" />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-neutral-900 dark:text-white leading-none">
                                    {process.env.NAME}
                                </span>
                            </div>
                        </Link>

                        {/* 移动端右侧：汉堡菜单 */}
                        <MobileMenu />
                    </div>
                </Padding>
            </div>

            {/* ===========================================================================
               2. 电脑端 Header (hidden md:flex) - 保持灵动岛：悬浮、高级
               =========================================================================== */}
            <div className="hidden md:flex fixed z-50 top-6 left-1/2 -translate-x-1/2 w-auto transition-all duration-300">
                <div className="flex items-center justify-between px-6 py-3 rounded-full
                              bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-xl
                              border border-white/20 dark:border-white/10
                              shadow-lg shadow-neutral-200/20 dark:shadow-black/40
                              min-w-[720px]">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group px-2 shrink-0">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800">
                            <img src={process.env.AVATAR} alt="Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="flex flex-col justify-center overflow-hidden">
                            <span className="text-base font-bold text-neutral-900 dark:text-white truncate leading-tight group-hover:text-[#FF4500] transition-colors">
                                {process.env.NAME}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider truncate">
                                {process.env.DESCRIPTION}
                            </span>
                        </div>
                    </Link>

                    {/* 桌面菜单 */}
                    <div className="flex items-center gap-1 mx-4">
                        <NavBarItem href="/" title={t('article.title')} />
                        <NavBarItem href="/timeline" title={t('timeline')} />
                        <NavBarItem href="/moments" title={t('moments.title')} />
                        <NavBarItem href="/friends" title={t('friends.title')} />
                        <NavBarItem href="/about" title={t('about.title')} />
                        {children}
                    </div>

                    {/* 功能区 */}
                    <div className="flex items-center gap-2 shrink-0">
                        <SearchButton />
                        <LanguageSwitch />
                        <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800 mx-1"></div>
                        <UserAvatar profile={profile} />
                    </div>
                </div>
            </div>

            {/* 占位符 */}
            <div className="h-20 md:h-32"></div>
        </>
    );
}

// --- 子组件：桌面端导航项 ---
function NavBarItem({ href, title, onClick }: { href: string, title: string, onClick?: () => void }) {
    const [location] = useLocation();
    const isSelected = href === "/" ? location === "/" : location.startsWith(href);

    return (
        <Link href={href} onClick={onClick}>
            <div className={`
                px-4 py-2 rounded-full text-sm font-bold cursor-pointer transition-all duration-200
                ${isSelected 
                    ? "text-[#FF4500] bg-neutral-100 dark:bg-white/10" 
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-white/5"}
            `}>
                {title}
            </div>
        </Link>
    );
}

// --- 子组件：移动端菜单 (Hamburger) ---
function MobileMenu() {
    const profile = useContext(ProfileContext);
    const { t } = useTranslation();
    const [isOpen, setOpen] = useState(false);
    const close = () => setOpen(false);

    return (
        <Popup
            trigger={
                <button className={ROUND_BTN_CLASS} onClick={() => setOpen(true)}>
                    <i className="ri-menu-line"></i>
                </button>
            }
            open={isOpen}
            onOpen={() => document.body.style.overflow = "hidden"}
            onClose={() => {
                document.body.style.overflow = "auto";
                setOpen(false);
            }}
            modal
            nested
            overlayStyle={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 1000 }}
            contentStyle={{ width: "85%", maxWidth: "300px", border: "none", background: "transparent", padding: 0 }}
        >
            <div className="bg-white dark:bg-[#121212] rounded-2xl p-4 shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
                {/* 移动端菜单内容 */}
                <div className="flex flex-col gap-1">
                    <div className="px-4 py-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">Navigation</div>
                    <NavBarItem href="/" title={t('article.title')} onClick={close} />
                    <NavBarItem href="/timeline" title={t('timeline')} onClick={close} />
                    <NavBarItem href="/moments" title={t('moments.title')} onClick={close} />
                    <NavBarItem href="/friends" title={t('friends.title')} onClick={close} />
                    <NavBarItem href="/about" title={t('about.title')} onClick={close} />
                    {profile?.permission && (
                        <>
                            <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-2 mx-4"></div>
                            <NavBarItem href="/writing" title={t('writing')} onClick={close} />
                            <NavBarItem href="/settings" title={t('settings.title')} onClick={close} />
                        </>
                    )}
                </div>

                {/* 移动端功能区 */}
                <div className="grid grid-cols-3 gap-2 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                    <div className="flex justify-center"><SearchButton /></div>
                    <div className="flex justify-center"><LanguageSwitch /></div>
                    <div className="flex justify-center"><UserAvatar profile={profile} /></div>
                </div>
            </div>
        </Popup>
    );
}

// --- 功能组件：搜索 ---
function SearchButton() {
    const { t } = useTranslation();
    const [isOpen, setOpen] = useState(false);
    const [_, setLocation] = useLocation();
    const [value, setValue] = useState("");

    const onSearch = () => {
        if (!value) return;
        setOpen(false);
        setLocation(`/search/${encodeURIComponent(value)}`);
    };

    return (
        <>
            <button className={ROUND_BTN_CLASS} onClick={() => setOpen(true)} title="Search">
                <i className="ri-search-line"></i>
            </button>
            
            <ReactModal
                isOpen={isOpen}
                onRequestClose={() => setOpen(false)}
                style={MODAL_STYLE}
            >
                <div className="bg-white dark:bg-[#121212] w-[90vw] md:w-[500px] p-4 rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                    <div className="flex-1">
                        <Input 
                            value={value} 
                            setValue={setValue} 
                            placeholder={t('article.search.placeholder')}
                            autofocus
                            onSubmit={onSearch} 
                        />
                    </div>
                    <div className="shrink-0">
                        <Button title="Go" onClick={onSearch} />
                    </div>
                </div>
            </ReactModal>
        </>
    );
}

// --- 功能组件：语言切换 ---
function LanguageSwitch() {
    const { i18n } = useTranslation();
    
    const toggleLanguage = () => {
        const langs = ['zh-CN', 'en', 'ja', 'zh-TW'];
        const currentIdx = langs.indexOf(i18n.language) !== -1 ? langs.indexOf(i18n.language) : 0;
        const nextLang = langs[(currentIdx + 1) % langs.length];
        i18n.changeLanguage(nextLang);
    };

    return (
        <button className={ROUND_BTN_CLASS} onClick={toggleLanguage} title="Change Language">
            <i className="ri-translate-2"></i>
        </button>
    );
}

// --- 功能组件：用户头像 ---
function UserAvatar({ profile }: { profile?: Profile }) {
    const { t } = useTranslation();
    const { LoginModal, setIsOpened } = useLoginModal();
    const config = useContext(ClientConfigContext);
    
    // 安全获取配置
    const loginEnabled = config.get('login.enabled') as boolean;
    if (!loginEnabled) return null;

    if (profile?.avatar) {
        return (
            <div className="relative group w-9 h-9">
                <img src={profile.avatar} alt="Avatar" 
                     className="w-full h-full rounded-full border border-neutral-200 dark:border-neutral-700 cursor-pointer" />
                
                {/* 登出遮罩 */}
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[1px]"
                     onClick={() => {
                         removeCookie("token");
                         window.location.reload();
                     }}>
                    <i className="ri-logout-circle-line text-white text-xs"></i>
                </div>
            </div>
        );
    }

    return (
        <>
            <button className={ROUND_BTN_CLASS} onClick={() => setIsOpened(true)}>
                <i className="ri-user-Line"></i>
            </button>
            <LoginModal />
        </>
    );
}
