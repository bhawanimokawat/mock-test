import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  FileCheck2,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Practice Tests", path: "/practice", icon: BookOpen },
    { name: "My Results", path: "/history", icon: FileCheck2 },
  ];

  const isActive = (path) => location.pathname === path;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">

          {/* Logo */}
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="group flex shrink-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/60 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-indigo-300/70">
              <Sparkles size={21} strokeWidth={2.2} />
            </div>

            <div className="flex flex-col">
              <span className="text-[19px] font-extrabold leading-6 tracking-tight text-slate-900">
                EnglishMock
              </span>
              <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[2px] text-indigo-600">
                AI Evaluator
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="ml-8 hidden h-full items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative flex h-10 items-center gap-2 rounded-xl px-4 text-[13px] font-semibold transition-all duration-200 ${
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={17} strokeWidth={active ? 2.3 : 1.9} />
                    {link.name}

                    {active && (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-indigo-600" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2 transition-colors hover:bg-slate-100/80">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-sm font-bold uppercase text-indigo-700 ring-2 ring-white">
                    {user?.name?.charAt(0) || "S"}
                  </div>

                  <div className="max-w-32">
                    <p className="truncate text-[13px] font-bold leading-5 text-slate-800">
                      {user?.name || "Student"}
                    </p>
                    <p className="text-[11px] capitalize text-slate-500">
                      {user?.role || "Student"}
                    </p>
                  </div>
                  <ChevronDown size={15} className="text-slate-400" />
                </div>

                <button
                  onClick={handleLogout}
                  className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3.5 text-[13px] font-semibold text-slate-600 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 active:scale-95"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button  variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-95 md:hidden"
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-4 shadow-lg shadow-slate-200/30 md:hidden">
          {isAuthenticated ? (
            <>
              {/* Mobile User Profile */}
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-base font-bold uppercase text-indigo-700">
                  {user?.name?.charAt(0) || "S"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {user?.name || "Student"}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {user?.email || user?.role || "Student"}
                  </p>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-1.5">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={closeMobileMenu}
                      className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition-colors duration-200 ${
                        active
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon size={19} />
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 border-t border-slate-200 pt-3">
                <button
                  onClick={handleLogout}
                  className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2.5">
              <Link to="/login" onClick={closeMobileMenu}>
                <Button variant="outline" className="w-full">
                  Log In
                </Button>
              </Link>

              <Link to="/signup" onClick={closeMobileMenu}>
                <Button variant="primary" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
