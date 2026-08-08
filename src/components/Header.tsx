import React, { useState } from 'react';
import { Logo } from './Logo';
import { NAVIGATION_TREE } from '../data/navigation';
import { NavItem, User } from '../types';
import {
  Search,
  Mail,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  User as UserIcon,
  Bookmark,
  TrendingUp,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  currentUser: User | null;
  savedArticlesCount: number;
  onNavigate: (item: NavItem) => void;
  onOpenSearch: () => void;
  onOpenSubscribe: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  currentUser,
  savedArticlesCount,
  onNavigate,
  onOpenSearch,
  onOpenSubscribe,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>('news');
  const [expandedMobileSub, setExpandedMobileSub] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavItemClick = (item: NavItem) => {
    onNavigate(item);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const toggleMobileCategory = (id: string) => {
    setExpandedMobileCategory(expandedMobileCategory === id ? null : id);
  };

  const toggleMobileSub = (id: string) => {
    setExpandedMobileSub(expandedMobileSub === id ? null : id);
  };

  return (
    <header className="w-full bg-[#0A0F1A] text-white sticky top-0 z-40 shadow-lg border-b border-[#1A2234]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-6 lg:gap-10">
            <button
              onClick={() =>
                handleNavItemClick({
                  id: 'home',
                  label: 'Home',
                  path: '/',
                  template: 'home',
                })
              }
              className="flex items-center text-left focus:outline-none focus:ring-2 focus:ring-[#22C55E] rounded-md cursor-pointer shrink-0"
            >
              <Logo size="md" lightText={true} />
            </button>

            {/* Desktop Navigation Hierarchy */}
            <nav className="hidden lg:flex items-center space-x-1">
              {NAVIGATION_TREE.map((item) => {
                const isActive =
                  item.path === '/'
                    ? currentPath === '/'
                    : currentPath === item.path || currentPath.startsWith(item.path + '/');
                const hasChildren = item.children && item.children.length > 0;

                return (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => handleNavItemClick(item)}
                      className={`flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-md cursor-pointer ${
                        isActive
                          ? 'text-[#22C55E] bg-white/5 font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{item.label}</span>
                      {hasChildren && <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white" />}
                    </button>

                    {/* Level 1 Dropdown */}
                    {hasChildren && (
                      <div className="absolute left-0 top-full pt-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50">
                        <div className="w-64 bg-[#0A0F1A] border border-[#1A2234] shadow-2xl rounded-lg p-2 space-y-1">
                          {item.children?.map((subItem) => {
                            const hasSubChildren = subItem.children && subItem.children.length > 0;
                            const isSubActive =
                              currentPath === subItem.path || currentPath.startsWith(subItem.path + '/');

                            return (
                              <div key={subItem.id} className="relative group/sub">
                                <button
                                  onClick={() => handleNavItemClick(subItem)}
                                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md transition-colors text-left cursor-pointer ${
                                    isSubActive
                                      ? 'bg-[#22C55E] text-white font-bold'
                                      : 'text-slate-300 hover:text-white hover:bg-[#151D2F]'
                                  }`}
                                >
                                  <div>
                                    <div className="font-semibold">{subItem.label}</div>
                                    {subItem.description && (
                                      <div className="text-[10px] text-slate-400 font-normal line-clamp-1">
                                        {subItem.description}
                                      </div>
                                    )}
                                  </div>
                                  {hasSubChildren && <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-2" />}
                                </button>

                                {/* Level 2 Nested Flyout (Technology sub-verticals under Sectors) */}
                                {hasSubChildren && (
                                  <div className="absolute left-full top-0 pl-1 opacity-0 pointer-events-none group-hover/sub:opacity-100 group-hover/sub:pointer-events-auto transition-all duration-150 z-50">
                                    <div className="w-56 bg-[#070A12] border border-[#1A2234] shadow-2xl rounded-lg p-2 space-y-1">
                                      <div className="px-2 py-1 text-[10px] font-mono font-bold text-[#22C55E] uppercase border-b border-white/5">
                                        Technology Verticals
                                      </div>
                                      {subItem.children?.map((nestedItem) => {
                                        const isNestedActive = currentPath === nestedItem.path;
                                        return (
                                          <button
                                            key={nestedItem.id}
                                            onClick={() => handleNavItemClick(nestedItem)}
                                            className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                                              isNestedActive
                                                ? 'bg-[#22C55E] text-white font-bold'
                                                : 'text-slate-300 hover:text-white hover:bg-[#151D2F]'
                                            }`}
                                          >
                                            {nestedItem.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-300 hover:text-white hover:bg-[#151D2F] rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#22C55E] cursor-pointer"
              title="Search Market data & insights"
              aria-label="Search insights"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Auth / Account Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#141A29] hover:bg-[#1C2538] border border-white/10 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[#22C55E] text-white font-bold text-[11px] flex items-center justify-center">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-medium max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#0A0F1A] border border-[#1A2234] shadow-2xl rounded-xl p-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <div className="font-bold text-white truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                    </div>

                    <button
                      onClick={() => {
                        handleNavItemClick({
                          id: 'portfolio',
                          label: 'My Portfolio',
                          path: '/portfolio',
                          template: 'portfolio',
                        });
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-200 hover:text-white hover:bg-[#151D2F] rounded-lg text-left cursor-pointer"
                    >
                      <TrendingUp className="w-4 h-4 text-[#22C55E]" />
                      <span>My Portfolio Watchlist</span>
                    </button>

                    <button
                      onClick={() => {
                        handleNavItemClick({
                          id: 'saved',
                          label: 'Saved Articles',
                          path: '/saved-articles',
                          template: 'saved',
                        });
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-slate-200 hover:text-white hover:bg-[#151D2F] rounded-lg text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Bookmark className="w-4 h-4 text-[#22C55E]" />
                        <span>Saved Articles</span>
                      </div>
                      {savedArticlesCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-[#22C55E] text-white text-[10px] font-bold rounded-full">
                          {savedArticlesCount}
                        </span>
                      )}
                    </button>

                    {currentUser.is_admin && (
                      <button
                        onClick={() => {
                          handleNavItemClick({
                            id: 'admin-reports',
                            label: 'Admin Reports Desk',
                            path: '/admin/reports',
                            template: 'admin-reports',
                          });
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-indigo-300 hover:text-white hover:bg-[#151D2F] rounded-lg text-left cursor-pointer font-semibold border-t border-white/10 mt-1 pt-2"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span>Admin Reports Desk</span>
                      </button>
                    )}

                    <div className="border-t border-white/10 my-1 pt-1">
                      <button
                        onClick={() => {
                          onLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg text-left cursor-pointer font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-sm cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Log In / Register</span>
              </button>
            )}

            {/* Newsletter Subscribe Trigger */}
            <button
              onClick={onOpenSubscribe}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider rounded-md transition-all border border-white/10 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#00D1B2]" />
              <span>Newsletter</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-md hover:bg-[#151D2F] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Accordion Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070A12] border-b border-[#1A2234] px-4 pt-3 pb-6 space-y-2 max-h-[80vh] overflow-y-auto">
          {NAVIGATION_TREE.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMobileCategory === item.id;

            return (
              <div key={item.id} className="border-b border-white/5 pb-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleNavItemClick(item)}
                    className="text-sm font-bold text-white uppercase tracking-wider py-1.5 cursor-pointer hover:text-[#00D1B2]"
                  >
                    {item.label}
                  </button>

                  {hasChildren && (
                    <button
                      onClick={() => toggleMobileCategory(item.id)}
                      className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-[#1E5EFF]' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Mobile Sub-Items Accordion */}
                {hasChildren && isExpanded && (
                  <div className="pl-3 mt-1 space-y-1 border-l border-white/10 ml-2">
                    {item.children?.map((subItem) => {
                      const hasSubChildren = subItem.children && subItem.children.length > 0;
                      const isSubExpanded = expandedMobileSub === subItem.id;

                      return (
                        <div key={subItem.id} className="py-1">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => handleNavItemClick(subItem)}
                              className="text-xs text-slate-300 hover:text-white font-medium cursor-pointer"
                            >
                              {subItem.label}
                            </button>

                            {hasSubChildren && (
                              <button
                                onClick={() => toggleMobileSub(subItem.id)}
                                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                              >
                                <ChevronDown
                                  className={`w-3.5 h-3.5 transition-transform ${
                                    isSubExpanded ? 'rotate-180 text-[#1E5EFF]' : ''
                                  }`}
                                />
                              </button>
                            )}
                          </div>

                          {/* Mobile Nested Sub-children */}
                          {hasSubChildren && isSubExpanded && (
                            <div className="pl-3 mt-1 space-y-1 border-l border-[#1E5EFF]/30 ml-2">
                              {subItem.children?.map((nestedItem) => (
                                <button
                                  key={nestedItem.id}
                                  onClick={() => handleNavItemClick(nestedItem)}
                                  className="block w-full text-left py-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
                                >
                                  {nestedItem.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </header>
  );
};
