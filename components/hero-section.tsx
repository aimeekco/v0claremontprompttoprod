"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {TextEffect} from "@/components/motion-primitives/text-effect";
import LanyardWithControls from "@/components/lanyard-with-controls";
import { useSearchParams } from 'next/navigation';

export default function HeroSection() {
    const searchParams = useSearchParams();
    const highlightOverride = searchParams.get('highlight'); // 'tracks', 'ship', or 'off'
    const eventState = searchParams.get('event'); // 'completed' to force finished state
    
    // Demo mode: ?demo=10:40 simulates being on event day at that time
    const demoTime = searchParams.get('demo');
    const [currentTime, setCurrentTime] = useState(new Date());
    
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        
        return () => clearInterval(timer);
    }, []);
    
    // Parse demo time if provided (format: "HH:MM" or "H:MM")
    let isEventDay = currentTime.getFullYear() === 2026 &&
        currentTime.getMonth() === 1 &&
        currentTime.getDate() === 7;
    let currentHour = currentTime.getHours();
    let currentMinute = currentTime.getMinutes();
    const isEventCompleted = eventState === 'completed';
    
    if (demoTime) {
        const timeMatch = demoTime.match(/^(\d{1,2}):(\d{2})$/);
        if (timeMatch) {
            isEventDay = true; // Force event day for demo
            currentHour = parseInt(timeMatch[1], 10);
            currentMinute = parseInt(timeMatch[2], 10);
        }
    }
    
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // Schedule times in minutes from midnight
    const scheduleTimes = [
        { start: 13 * 60, end: 13 * 60 + 10, title: "Kickoff" },
        { start: 13 * 60 + 10, end: 16 * 60 + 30, title: "Build!" },
        { start: 16 * 60 + 30, end: 17 * 60, title: "Ship & submit" },
        { start: 17 * 60, end: 18 * 60, title: "Event wrap-up" },
    ];
    
    const getCurrentScheduleIndex = () => {
        if (!isEventDay) return -1;
        for (let i = 0; i < scheduleTimes.length; i++) {
            if (currentTimeInMinutes >= scheduleTimes[i].start && currentTimeInMinutes < scheduleTimes[i].end) {
                return i;
            }
        }
        return -1;
    };
    
    const currentScheduleIndex = getCurrentScheduleIndex();
    
    // Compute button highlight states
    // Track selection & Teams: 10:10-10:30 (index 1)
    // Ship & submit: 12:00-12:30 (index 3)
    let highlightTracksButtons = false;
    let highlightSubmitButton = false;
    
    if (isEventCompleted) {
        highlightTracksButtons = false;
        highlightSubmitButton = false;
    } else if (highlightOverride === 'tracks') {
        highlightTracksButtons = true;
    } else if (highlightOverride === 'ship') {
        highlightSubmitButton = true;
    } else if (highlightOverride !== 'off') {
        // Use real time logic
        if (isEventDay) {
            if (currentScheduleIndex === 1) {
                // Track selection & Teams
                highlightTracksButtons = true;
            } else if (currentScheduleIndex === 3) {
                // Ship & submit
                highlightSubmitButton = true;
            }
        }
    }
    
    return (
        <main className="overflow-x-hidden">
            <section className='min-h-dvh overflow-hidden flex flex-col lg:relative'>
                {/* Left content - shrinks to fit on mobile, fixed width on desktop */}
                <div className="flex-shrink-0 pb-4 pt-6 sm:pt-8 lg:pb-8 lg:pt-36 lg:w-1/2 relative z-10">
                    <div className="relative mx-auto flex max-w-xl flex-col px-4 sm:px-6 lg:block">
                        <div className="mx-auto max-w-2xl text-center lg:ml-0 lg:text-left">
                            {/* Status Pill */}
                            <div className='mb-2 flex justify-center lg:justify-start'>
                                <div className="inline-flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2">
                                    <div className={`h-2 w-2 rounded-full ${isEventCompleted ? 'bg-muted-foreground' : isEventDay ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-pulse'}`}></div>
                                    <span className="text-sm font-medium text-gray-800">
                                        {isEventCompleted ? 'Event completed' : isEventDay ? 'Ongoing' : 'Not started'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className='mt-2'>
                                <TextEffect
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    as="h1"
                                    className="max-w-2xl text-balance text-2xl font-medium md:text-3xl xl:text-4xl">
                                    Prompt to Production - Claremont, CA
                                </TextEffect>
                                <TextEffect
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.1}
                                    as="p"
                                    className="mt-2 text-sm text-white">
                                    February 7, 2026
                                </TextEffect>
                            </div>
                            
                            {/* Schedule Block */}
                            <div className="mt-3 sm:mt-4 rounded-xl bg-white/6 backdrop-blur-2xl p-3 sm:p-4 relative overflow-hidden">
                                {isEventCompleted && (
                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 text-center gap-4">
                                        <span className="text-md font-geist text-white">Thank you for attending the event!!!</span>
                                        <span className="text-sm font-geist text-white">We hope to see you again soon for another v0 or Hacker Fund event ;)</span>
                                        <span className="text-sm font-geist text-white">- RF</span>
                                    </div>
                                )}
                                <h3 className="mb-2 sm:mb-4 text-base sm:text-lg font-semibold text-white">Schedule</h3>
                                <div className="space-y-1 sm:space-y-2">
                                    {scheduleTimes.map((item, index) => {
                                        const hour24 = Math.floor(item.start / 60);
                                        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                                        const startTime = `${hour12}:${(item.start % 60).toString().padStart(2, '0')} ${item.start < 12 * 60 ? 'AM' : 'PM'}`;
                                        const isActive = index === currentScheduleIndex;
                                        const isPast = isEventDay && currentTimeInMinutes > item.end;
                                        const isInactiveDay = !isEventDay;
                                        
                                        return (
                                            <div 
                                                key={index} 
                                                className={`flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg transition-all duration-300 ${
                                                    isActive 
                                                        ? 'bg-white/20 border border-white/30' 
                                                        : isPast 
                                                            ? 'opacity-60' 
                                                            : ''
                                                }`}
                                            >
                                                <span className={`text-xs sm:text-sm font-mono min-w-[70px] sm:min-w-[80px] ${
                                                    isActive
                                                        ? 'text-white'
                                                        : isInactiveDay
                                                            ? 'text-muted-foreground/60'
                                                            : 'text-muted-foreground'
                                                }`}>
                                                    {startTime}
                                                </span>
                                                <span className={`text-xs sm:text-sm font-medium ${
                                                    isActive
                                                        ? 'text-white'
                                                        : isInactiveDay
                                                            ? 'text-muted-foreground/60'
                                                            : isPast
                                                                ? 'text-muted-foreground'
                                                                : 'text-foreground'
                                                }`}>
                                                    {item.title}
                                                </span>
                                                {isActive && (
                                                    <div className="ml-auto">
                                                        <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="mt-3 sm:mt-4 flex flex-col items-center justify-center gap-2 sm:gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
                                <Button
                                    asChild
                                    size="default"
                                    variant="outline"
                                    className={`px-4 backdrop-blur-md rounded-md transition-all duration-300 ${
                                        highlightSubmitButton
                                            ? 'bg-blue-500/30 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.6)]'
                                            : 'bg-white/10 border-white/20'
                                    }`}>
                                    <Link href="https://v0-v0prompttoproduction2026.vercel.app/submit" target="_blank">
                                        <span className="text-nowrap">Submit your project</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="default"
                                    variant="outline"
                                    className={`px-4 backdrop-blur-md rounded-md transition-all duration-300 ${
                                        highlightTracksButtons
                                            ? 'bg-blue-500/30 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.6)]'
                                            : 'bg-white/10 border-white/20'
                                    }`}>
                                    <Link href="https://v0-v0prompttoproduction2026.vercel.app/inspiration" target="_blank">
                                        <span className="text-nowrap">Build Tracks</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="default"
                                    variant="outline"
                                    className={`px-4 backdrop-blur-md rounded-md transition-all duration-300 ${
                                        highlightTracksButtons
                                            ? 'bg-blue-500/30 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.6)]'
                                            : 'bg-white/10 border-white/20'
                                    }`}>
                                    <Link href="https://v0-v0prompttoproduction2026.vercel.app/browse" target="_blank">
                                        <span className="text-nowrap">Browse Submitted Projects</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Lanyard - fills remaining space on mobile, absolute positioned on desktop */}
                <LanyardWithControls 
                    position={[0, 6, 20]}
                    containerClassName='lg:absolute lg:top-0 lg:right-0 lg:w-1/2 relative w-full flex-1 min-h-[200px] lg:h-screen bg-radial lg:from-transparent lg:to-transparent from-muted to-background select-none'
                    defaultName=""/>
            </section>
        </main>
    )
}
