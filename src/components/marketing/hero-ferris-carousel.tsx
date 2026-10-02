"use client";

import { useState, useEffect, useCallback, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  ShoppingBag,
  Wifi,
  Battery,
} from "lucide-react";

export interface CarouselItem {
  id: string;
  storeName: string;
  batchName: string;
  productName: string;
  categoryTag: string;
  location: string;
  price: string;
  imageUrl: string;
  closingTime: string;
  remainingInfo: string;
  storeSlug: string;
}

const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: "item-1",
    storeName: "Amaka's Kitchen",
    batchName: "Sunday Lunch Drop",
    productName: "Smoky Jollof + Grilled Chicken",
    categoryTag: "Food Drop",
    location: "Victoria Island",
    price: "₦5,500",
    imageUrl:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85",
    closingTime: "Closes Friday · 6:00 PM",
    remainingInfo: "45/50 orders booked",
    storeSlug: "amaka-kitchen/sunday-lunch",
  },
  {
    id: "item-2",
    storeName: "Urban Vintage Co.",
    batchName: "September Streetwear Drop",
    productName: "Heavyweight Boxy Tees & Cargoes",
    categoryTag: "Vintage Thrift",
    location: "Yaba, Lagos",
    price: "₦14,000",
    imageUrl:
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=900&q=85",
    closingTime: "Closes Sunday · Midnight",
    remainingInfo: "18 pieces remaining",
    storeSlug: "explore",
  },
  {
    id: "item-3",
    storeName: "Lekki Bakehouse",
    batchName: "Saturday Morning Batch",
    productName: "Almond Butter Croissant Box",
    categoryTag: "Artisan Bakery",
    location: "Lekki Phase 1",
    price: "₦4,800",
    imageUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
    closingTime: "Closes Thursday · 8:00 PM",
    remainingInfo: "8 slots left",
    storeSlug: "explore",
  },
  {
    id: "item-4",
    storeName: "The Sunset Live",
    batchName: "Acoustic Rooftop Session",
    productName: "VIP Pass & Welcome Cocktails",
    categoryTag: "Event Tickets",
    location: "Ikoyi, Lagos",
    price: "₦12,500",
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=85",
    closingTime: "Closes Saturday · 4:00 PM",
    remainingInfo: "Tier 1: 90% Sold Out",
    storeSlug: "explore",
  },
  {
    id: "item-5",
    storeName: "Terra Harvest",
    batchName: "Weekly Organic Farm Box",
    productName: "Sweet Roman Tomatoes & Basil",
    categoryTag: "Farm Produce",
    location: "Ikeja & Delivery",
    price: "₦9,500",
    imageUrl:
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=900&q=85",
    closingTime: "Closes Wednesday · 10:00 AM",
    remainingInfo: "Harvest Batch #14",
    storeSlug: "explore",
  },
];

export function HeroFerrisCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const gradientId = useId();

  const count = CAROUSEL_ITEMS.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Autoplay rotation every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 4200);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const activeItem = CAROUSEL_ITEMS[activeIndex];

  // Helper to determine relative position in the carousel cycle: -2, -1, 0, 1, 2
  const getRelativePosition = (itemIndex: number) => {
    let diff = itemIndex - activeIndex;
    if (diff > 2) diff -= count;
    if (diff < -2) diff += count;
    return diff;
  };

  return (
    <div
      className="relative mx-auto mt-10 w-full max-w-6xl px-2 py-8 sm:px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Smooth Blue Ribbon Graphic (just like the reference image) */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 flex items-center justify-center opacity-85">
        <svg
          viewBox="0 0 1200 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[380px] w-full max-w-5xl text-indigo-600/90"
        >
          <path
            d="M 60 380 C 140 180, 260 220, 360 360 C 440 460, 560 480, 680 340 C 820 180, 940 140, 1140 320"
            stroke={`url(#${gradientId})`}
            strokeWidth="84"
            strokeLinecap="round"
            fill="none"
          />
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#4338ca" stopOpacity="0.85" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Ferris Wheel Arc Carousel Stage */}
      <div className="relative flex h-[540px] items-center justify-center sm:h-[620px]">
        {CAROUSEL_ITEMS.map((item, index) => {
          const relPos = getRelativePosition(index);
          const isCenter = relPos === 0;

          // Compute horizontal ferris-wheel arc transform
          let transformStyle = "";
          let zIndex = 10;
          let opacity = 0;
          let pointerEvents: "auto" | "none" = "none";

          if (isCenter) {
            transformStyle = "translate3d(0, -12px, 0) scale(1) rotate(0deg)";
            zIndex = 30;
            opacity = 1;
            pointerEvents = "auto";
          } else if (relPos === -1) {
            transformStyle = "translate3d(-240px, 18px, 0) scale(0.92) rotate(-5deg)";
            zIndex = 20;
            opacity = 0.95;
            pointerEvents = "auto";
          } else if (relPos === 1) {
            transformStyle = "translate3d(240px, 18px, 0) scale(0.92) rotate(5deg)";
            zIndex = 20;
            opacity = 0.95;
            pointerEvents = "auto";
          } else if (relPos === -2) {
            transformStyle = "translate3d(-460px, 48px, 0) scale(0.84) rotate(-9deg)";
            zIndex = 10;
            opacity = 0.65;
            pointerEvents = "auto";
          } else if (relPos === 2) {
            transformStyle = "translate3d(460px, 48px, 0) scale(0.84) rotate(9deg)";
            zIndex = 10;
            opacity = 0.65;
            pointerEvents = "auto";
          }

          // Desktop transforms (scale adjustments for mobile vs desktop)
          return (
            <div
              key={item.id}
              onClick={() => !isCenter && setActiveIndex(index)}
              style={{
                transform: transformStyle,
                zIndex,
                opacity,
                pointerEvents,
                transition: "all 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              className={`absolute flex cursor-pointer select-none items-center justify-center transition-all ${
                isCenter ? "cursor-default" : "hover:brightness-105"
              }`}
            >
              {isCenter ? (
                /* ================= ULTRA-SLEEK IPHONE 16 PRO MOCKUP ================= */
                <div className="relative h-[550px] w-[275px] sm:h-[610px] sm:w-[305px]">
                  {/* Subtle 3D hardware buttons on frame */}
                  {/* Action Button */}
                  <span className="absolute -left-[3px] top-[95px] h-6 w-[3px] rounded-l-xs bg-slate-600/90" />
                  {/* Volume Up */}
                  <span className="absolute -left-[3px] top-[135px] h-11 w-[3px] rounded-l-xs bg-slate-600/90" />
                  {/* Volume Down */}
                  <span className="absolute -left-[3px] top-[195px] h-11 w-[3px] rounded-l-xs bg-slate-600/90" />
                  {/* Power / Side Button */}
                  <span className="absolute -right-[3px] top-[145px] h-16 w-[3px] rounded-r-xs bg-slate-600/90" />

                  {/* Titanium Outer Chassis */}
                  <div className="relative h-full w-full rounded-[48px] p-[3px] bg-gradient-to-b from-slate-600 via-slate-800 to-slate-950 shadow-[0_30px_90px_-15px_rgba(15,23,42,0.4),0_0_0_1px_rgba(255,255,255,0.18)_inset]">
                    {/* Inner Black Bezel (Razor-Thin ~4px) */}
                    <div className="relative h-full w-full overflow-hidden rounded-[45px] bg-black p-[3.5px]">
                      {/* OLED Screen Content Container */}
                      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[41px] bg-white text-slate-900 select-none">
                        {/* Diagonal Specular Glass Reflection Sheen */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -inset-y-24 -left-20 z-30 w-44 rotate-25 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />

                        {/* Top iOS Status Bar + Dynamic Island */}
                        <div className="relative z-20 flex h-9 shrink-0 items-center justify-between px-6 pt-1.5 text-[11px] font-semibold text-slate-950">
                          <span className="font-semibold tracking-tight">9:41</span>

                          {/* Dynamic Island */}
                          <div className="absolute left-1/2 top-2 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black px-2 flex items-center justify-between shadow-xs">
                            {/* Camera optic */}
                            <span className="size-2 rounded-full bg-[#0a0e14] ring-1 ring-[#1e293b]/70" />
                            {/* Sensor indicator dot */}
                            <span className="size-1.5 rounded-full bg-[#030712]" />
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Wifi size={12} className="stroke-[2.5]" />
                            <Battery size={13} className="stroke-[2.2]" />
                          </div>
                        </div>

                        {/* In-app Store Navigation Bar */}
                        <div className="relative z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-2.5 backdrop-blur-md">
                          <div className="flex items-center gap-2">
                            <span className="grid size-7.5 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 text-xs font-black text-white shadow-xs">
                              {activeItem.storeName.charAt(0)}
                            </span>
                            <div>
                              <p className="text-xs font-bold leading-tight text-slate-900">
                                {activeItem.storeName}
                              </p>
                              <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                                <MapPin size={9} className="text-indigo-500" /> {activeItem.location}
                              </span>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Open
                          </span>
                        </div>

                        {/* Screen Scrollable Body */}
                        <div className="flex-1 overflow-y-auto px-3.5 py-3 hide-scrollbar space-y-3">
                          {/* Active Selling Window Banner */}
                          <div className="rounded-2xl border border-indigo-100/90 bg-gradient-to-br from-indigo-50/90 via-indigo-50/50 to-white p-3 shadow-2xs">
                            <div className="flex items-center justify-between text-[10px] font-bold text-indigo-700">
                              <span className="uppercase tracking-wider">Selling Window</span>
                              <span className="flex items-center gap-1 font-extrabold text-indigo-900 bg-white/80 px-1.5 py-0.5 rounded-md border border-indigo-100">
                                <Clock3 size={10} className="text-indigo-600" /> 05:42:18
                              </span>
                            </div>
                            <h4 className="mt-1.5 text-sm font-extrabold text-slate-900">
                              {activeItem.batchName}
                            </h4>
                            <p className="text-[10px] text-slate-500">{activeItem.closingTime}</p>
                          </div>

                          {/* Hero Product Card */}
                          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition hover:shadow-md">
                            <div className="relative h-36 w-full bg-slate-100">
                              <Image
                                src={activeItem.imageUrl}
                                alt={activeItem.productName}
                                fill
                                sizes="320px"
                                priority
                                className="object-cover"
                              />
                              <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-0.5 text-[9px] font-extrabold text-slate-900 shadow-xs backdrop-blur-xs">
                                {activeItem.categoryTag}
                              </span>
                            </div>
                            <div className="p-3">
                              <h5 className="text-xs font-bold text-slate-900 leading-snug">
                                {activeItem.productName}
                              </h5>
                              <div className="mt-2.5 flex items-center justify-between">
                                <span className="text-base font-black tracking-tight text-indigo-700">
                                  {activeItem.price}
                                </span>
                                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-800 border border-amber-200/60">
                                  {activeItem.remainingInfo}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Batch Capacity Meter */}
                          <div className="rounded-xl border border-slate-100 bg-slate-50/90 p-2.5 text-[10px]">
                            <div className="flex items-center justify-between font-bold text-slate-600">
                              <span>Batch Capacity</span>
                              <span className="text-indigo-600 font-extrabold">90% Ordered</span>
                            </div>
                            <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                              <div className="h-full w-[90%] rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600" />
                            </div>
                          </div>
                        </div>

                        {/* Bottom Sticky Action Bar */}
                        <div className="border-t border-slate-100 bg-white/95 p-3 backdrop-blur-xs">
                          <Link
                            href={`/${activeItem.storeSlug}`}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800"
                          >
                            <ShoppingBag size={13} /> Order From Store
                          </Link>
                        </div>

                        {/* iOS Home Indicator Bar */}
                        <div className="flex justify-center pb-1.5 pt-0.5 bg-white">
                          <div className="h-1 w-28 rounded-full bg-slate-900/30" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ================= FLANKING PHOTO CARDS ================= */
                <div className="group relative h-[360px] w-[215px] overflow-hidden rounded-[28px] border-2 border-white/90 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.18)] transition-all sm:h-[420px] sm:w-[250px]">
                  {/* Photo with zoom on hover */}
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    sizes="260px"
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                  />

                  {/* Gradient Scrim for readable tags */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />

                  {/* Top Location Pill Badge (Just like '📍 Paris' in the reference) */}
                  <div className="absolute right-3.5 top-3.5 z-10 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow-md backdrop-blur-xs">
                    <MapPin size={12} className="text-indigo-600" />
                    <span>{item.location}</span>
                  </div>

                  {/* Bottom Card Content */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white">
                    <span className="inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold backdrop-blur-md">
                      {item.categoryTag}
                    </span>
                    <h4 className="mt-1.5 text-base font-extrabold leading-snug text-white drop-shadow-xs">
                      {item.storeName}
                    </h4>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-200">
                      {item.productName}
                    </p>
                    <div className="mt-2 flex items-center justify-between border-t border-white/20 pt-2 text-xs">
                      <span className="font-extrabold text-amber-300">{item.price}</span>
                      <span className="text-[11px] font-medium text-slate-300">
                        {item.remainingInfo}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Carousel Controls & Pagination Dots */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          onClick={prevSlide}
          aria-label="Previous drop"
          className="focus-ring grid size-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-slate-100 hover:text-slate-950"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {CAROUSEL_ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to drop ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === i ? "w-7 bg-indigo-600" : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          aria-label="Next drop"
          className="focus-ring grid size-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-slate-100 hover:text-slate-950"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
