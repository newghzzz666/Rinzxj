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

    return (
        <>
            {/* 灵动岛容器：固定定位 + 响应式宽度 */}
            <div className="fixed z-50 top-3 left-3 right-3 md:top-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-auto transition-all duration-300">
                
                {/* 岛屿本体 */}
                <div className="flex items-center justify-between p-2 md:px-6 md:py-3 rounded-[2rem] md:rounded-full
                              bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-xl
                              border border-white/20 dark:border-white/10
                              shadow-lg shadow-neutral-200/20 dark:shadow-black/40
                              min-w-0 md:min-w-[720px]">

                    {/* 1. 左侧：Logo区域 */}
                    <Link href="/" className="flex items-center gap-3 group px-2 shrink-0">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800">
                            <img src={process.env.AVATAR} alt="Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="flex flex-col justify-center overflow-hidden">
                            <span className="text-base font-bold text-neutral-900 dark:text-white truncate leading-tight group-hover:text-[#FF4500] transition-colors">
                                {process.env.NAME}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider truncate hidden sm:block">
                                {process.env.DESCRIPTION}
                            </span>
                        </div>
                    </Link>

                    {/* 2. 中间：桌面导航 (手机隐藏) */}
                    <div className="hidden md:flex items-center gap-1 mx-4">
                        <NavBarItem href="/" title={t('article.title')} />
                        <NavBarItem href="/timeline" title={t('timeline')} />
                        <NavBarItem href="/moments" title={t('moments.title')} />
                        <NavBarItem href="/friends" title={t('friends.title')} />
                        <NavBarItem href="/about" title={t('about.title')} />
                        {/* 额外子元素 */}
                        {children}
                    </div>

                    {/* 3. 右侧：功能区 */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* 桌面端显示搜索和语言 */}
                        <div className="hidden md:flex items-center gap-2">
                            <SearchButton />
                            <LanguageSwitch />
                        </div>

                        {/* 用户头像 (响应式) */}
                        <UserAvatar profile={profile} />

                        {/* 手机端菜单触发器 */}
                        <div className="md:hidden">
                            <MobileMenu />
                        </div>
                    </div>
                </div>
            </div>

            {/* 占位符 */}
            <div className="h-24 md:h-32"></div>
        </>
    );
}

// --- 子组件：导航项 (简化版) ---
function NavBarItem({ href, title, onClick }: { href: string, title: string, onClick?: () => void }) {
    const [location] = useLocation();
    // 简单判断选中状态：当前路径以 href 开头 (除了首页 / 特殊处理)
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

// --- 子组件：移动端菜单 (重构为纯净版) ---
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
            contentStyle={{ width: "90%", maxWidth: "350px", border: "none", background: "transparent", padding: 0 }}
        >
            <div className="bg-white dark:bg-[#121212] rounded-[2rem] p-4 shadow-2xl border border-white/20 ring-1 ring-black/5 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
                {/* 1. 功能网格 */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-3 flex justify-center">
                        <SearchButton />
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-3 flex justify-center">
                        <LanguageSwitch />
                    </div>
                </div>

                {/* 2. 导航列表 */}
                <div className="flex flex-col gap-1">
                    <div className="px-4 py-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">Menu</div>
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
            </div>
        </Popup>
    );
}

// --- 功能组件：搜索按钮 ---
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
                <div className="bg-white dark:bg-[#121212] w-[90vw] md:w-[500px] p-2 rounded-[2rem] shadow-2xl border border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                    <div className="flex-1">
                        <Input 
                            value={value} 
                            setValue={setValue} 
                            placeholder={t('article.search.placeholder')}
                            autofocus
                            onSubmit={onSearch} 
                        />
                    </div>
                    <div className="shrink-0 mr-1">
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
    
    // 简化逻辑：点击直接循环切换语言，不再弹窗
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
    
    // 类型安全检查
    const loginEnabled = config.get('login.enabled');
    if (!loginEnabled) return null;

    if (profile?.avatar) {
        return (
            <div className="relative group w-9 h-9 ml-1">
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
            <button className={ROUND_BTN_CLASS + " ml-1"} onClick={() => setIsOpened(true)}>
                <i className="ri-user-Line"></i>
            </button>
            <LoginModal />
        </>
    );
}
