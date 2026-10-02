"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  HelpCircle,
  Info,
  Lightbulb,
  Menu,
  MessageCircle,
  Search,
  X,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  DOCS_CATEGORIES,
  DOCS_ARTICLES,
  type DocSection,
} from "@/lib/docs-data";

interface Props {
  initialSlug?: string;
  user?: { name: string; hasVendor: boolean } | null;
}

export function DocsShell({ initialSlug = "introduction", user = null }: Props) {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic");

  const [activeSlug, setActiveSlug] = useState<string>(
    topicParam && DOCS_ARTICLES[topicParam] ? topicParam : initialSlug,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");

  // Sync state if topicParam changes
  useEffect(() => {
    if (topicParam && DOCS_ARTICLES[topicParam]) {
      setActiveSlug(topicParam);
    }
  }, [topicParam]);

  const activeArticle: DocSection = useMemo(() => {
    return DOCS_ARTICLES[activeSlug] || DOCS_ARTICLES["introduction"];
  }, [activeSlug]);

  const selectArticle = useCallback((slug: string) => {
    setActiveSlug(slug);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const url = new URL(window.location.href);
    url.searchParams.set("topic", slug);
    window.history.pushState({}, "", url.toString());
  }, []);

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return DOCS_CATEGORIES;
    const query = searchQuery.toLowerCase();
    return DOCS_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          DOCS_ARTICLES[item.slug]?.content.overview.toLowerCase().includes(query),
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  // Copy link handler
  const handleCopyLink = () => {
    const url = `${window.location.origin}/docs?topic=${activeArticle.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  // Keyboard shortcut ⌘K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("docs-search-input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll spy for TOC
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = activeArticle.headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean) as HTMLElement[];

      const scrollPosition = window.scrollY + 140;
      let currentId = activeArticle.headings[0]?.id || "";

      for (const el of headingElements) {
        if (el.offsetTop <= scrollPosition) {
          currentId = el.id;
        }
      }
      setActiveHeadingId(currentId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeArticle]);

  // Find previous and next articles
  const allArticlesList = useMemo(() => {
    return DOCS_CATEGORIES.flatMap((c) => c.items);
  }, []);

  const currentIndex = allArticlesList.findIndex((item) => item.slug === activeArticle.slug);
  const prevArticle = currentIndex > 0 ? allArticlesList[currentIndex - 1] : null;
  const nextArticle =
    currentIndex < allArticlesList.length - 1 ? allArticlesList[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="focus-ring rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Logo />
            <span className="hidden items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 sm:inline-flex">
              <BookOpen size={12} /> Documentation
            </span>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/docs"
              className="text-sm font-semibold text-indigo-700"
            >
              Docs
            </Link>
            <Link
              href="/explore"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Explore Stores
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Support
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Button href={user.hasVendor ? "/dashboard" : "/onboarding"} size="sm">
                {user.hasVendor ? "Dashboard" : "Start selling"}
              </Button>
            ) : (
              <>
                <Button href="/login" tone="ghost" size="sm" className="hidden sm:inline-flex">
                  Sign in
                </Button>
                <Button href="/signup" size="sm">
                  Start selling
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto flex max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Left Sidebar (Desktop) */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-68 shrink-0 overflow-y-auto border-r border-slate-200/80 py-6 pr-4 lg:block">
          <div className="relative mb-5">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <input
              id="docs-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search docs... (⌘K)"
              className="focus-ring w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <nav className="space-y-6">
            {filteredCategories.map((category) => (
              <div key={category.name}>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {category.name}
                </h3>
                <ul className="space-y-1">
                  {category.items.map((item) => {
                    const isActive = activeSlug === item.slug;
                    return (
                      <li key={item.slug}>
                        <button
                          onClick={() => selectArticle(item.slug)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                            isActive
                              ? "bg-indigo-50 font-bold text-indigo-700 shadow-xs"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                          }`}
                        >
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <span className="ml-2 rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Documentation Index</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative mb-5">
                <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search docs..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-6">
                {filteredCategories.map((category) => (
                  <div key={category.name}>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      {category.name}
                    </h3>
                    <ul className="space-y-1">
                      {category.items.map((item) => (
                        <li key={item.slug}>
                          <button
                            onClick={() => selectArticle(item.slug)}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                              activeSlug === item.slug
                                ? "bg-indigo-50 font-bold text-indigo-700"
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <span>{item.title}</span>
                            {item.badge && (
                              <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Center Content Area */}
        <main className="min-w-0 flex-1 py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-3xl">
            {/* Breadcrumb & Actions */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span>Docs</span>
                <ChevronRight size={13} className="text-slate-400" />
                <span>{activeArticle.category}</span>
                <ChevronRight size={13} className="text-slate-400" />
                <span className="font-semibold text-slate-800">{activeArticle.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                  {activeArticle.readingTime}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50"
                >
                  {copiedLink ? (
                    <>
                      <Check size={13} className="text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Copy link
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Document Header */}
            <div className="mb-8 border-b border-slate-200 pb-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                {activeArticle.title}
              </h1>
              <p className="mt-3 text-lg leading-relaxed text-slate-600">
                {activeArticle.subtitle}
              </p>
            </div>

            {/* Overview Section */}
            <div className="prose prose-slate mb-10 max-w-none text-base leading-relaxed text-slate-700">
              <p className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5 font-normal text-indigo-950 leading-relaxed">
                {activeArticle.content.overview}
              </p>
            </div>

            {/* Article Sections */}
            <div className="space-y-12">
              {activeArticle.content.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    {section.heading}
                  </h2>
                  <p className="text-base leading-relaxed text-slate-600">
                    {section.body}
                  </p>

                  {/* Callout */}
                  {section.callout && (
                    <div
                      className={`flex gap-3.5 rounded-xl border p-4.5 ${
                        section.callout.tone === "tip"
                          ? "border-emerald-200 bg-emerald-50/70 text-emerald-950"
                          : section.callout.tone === "warning"
                          ? "border-amber-200 bg-amber-50/70 text-amber-950"
                          : "border-indigo-200 bg-indigo-50/70 text-indigo-950"
                      }`}
                    >
                      <div className="shrink-0 pt-0.5">
                        {section.callout.tone === "tip" ? (
                          <Lightbulb className="size-5 text-emerald-600" />
                        ) : section.callout.tone === "warning" ? (
                          <AlertTriangle className="size-5 text-amber-600" />
                        ) : (
                          <Info className="size-5 text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{section.callout.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed opacity-90">
                          {section.callout.text}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step Cards */}
                  {section.steps && (
                    <div className="grid gap-3 pt-2">
                      {section.steps.map((step) => (
                        <div
                          key={step.title}
                          className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4.5 shadow-2xs"
                        >
                          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-indigo-100 text-xs font-extrabold text-indigo-700">
                            {step.stepNumber}
                          </span>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-900">
                              {step.title}
                            </h4>
                            <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                              {step.description}
                            </p>
                            {step.actionLink && (
                              <Link
                                href={step.actionLink.href}
                                className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                              >
                                {step.actionLink.label} <ArrowRight size={12} />
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bullet Key Points */}
                  {section.keyPoints && (
                    <ul className="grid gap-2.5 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                      {section.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                          <Check className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {/* Ask a Question / Support helper bar */}
            <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                    <HelpCircle className="size-5 text-indigo-600" />
                    Still have questions?
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Our team is here to help you get your store and drops running smoothly.
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <Button
                    href="/contact"
                    tone="secondary"
                    size="sm"
                    className="gap-1.5"
                  >
                    <MessageCircle size={15} /> Contact Support
                  </Button>
                  <Button
                    href="mailto:hello@hemigo.com.ng"
                    tone="primary"
                    size="sm"
                  >
                    Email hello@hemigo.com.ng
                  </Button>
                </div>
              </div>
            </div>

            {/* Previous and Next Navigation */}
            <div className="mt-8 flex flex-col justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
              {prevArticle ? (
                <button
                  onClick={() => selectArticle(prevArticle.slug)}
                  className="group flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-2xs transition hover:border-indigo-300 hover:bg-indigo-50/30"
                >
                  <ArrowLeft className="size-4 text-slate-400 transition group-hover:-translate-x-1 group-hover:text-indigo-600" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Previous
                    </span>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-700">
                      {prevArticle.title}
                    </p>
                  </div>
                </button>
              ) : (
                <div className="flex-1" />
              )}

              {nextArticle && (
                <button
                  onClick={() => selectArticle(nextArticle.slug)}
                  className="group flex flex-1 items-center justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 text-right shadow-2xs transition hover:border-indigo-300 hover:bg-indigo-50/30"
                >
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Next
                    </span>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-700">
                      {nextArticle.title}
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar ("On this page" TOC) */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 overflow-y-auto py-8 pl-6 xl:block">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            On this page
          </h4>
          <ul className="space-y-2 border-l border-slate-200 pl-3 text-xs">
            {activeArticle.headings.map((heading) => {
              const isCurrent = activeHeadingId === heading.id;
              return (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className={`block leading-relaxed transition ${
                      isCurrent
                        ? "-ml-[13px] border-l-2 border-indigo-600 pl-2.5 font-bold text-indigo-700"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {heading.title}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 text-xs">
            <p className="font-bold text-slate-800">Launch Your Store</p>
            <p className="mt-1 text-slate-500 leading-normal">
              First month free. Collect online payments with Paystack.
            </p>
            <Link
              href="/signup"
              className="mt-3 inline-flex items-center gap-1 font-bold text-indigo-600 hover:underline"
            >
              Get started <ExternalLink size={12} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
