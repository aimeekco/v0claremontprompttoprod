"use client"

import {Card, CardContent, CardHeader} from '@/components/ui/card'
import {CircleDollarSignIcon, EarthIcon, UsersIcon} from 'lucide-react'
import React, {ReactNode, useEffect, useMemo, useRef, useState} from 'react'
import {TextEffect} from "@/components/motion-primitives/text-effect";
import {transitionVariants} from "@/lib/utils";
import {AnimatedGroup} from "@/components/motion-primitives/animated-group";
import {Button} from "@/components/ui/button";

export default function Features() {
    const eventStartBase = useMemo(() => new Date(2026, 1, 7, 13, 0, 0), [])
    const [eventStart, setEventStart] = useState(eventStartBase)
    const [hasStarted, setHasStarted] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [timeLeft, setTimeLeft] = useState("")
    const [hasCopied, setHasCopied] = useState(false)
    const hasAutoOpened = useRef(false)

    useEffect(() => {
        if (typeof window === "undefined") return
        const params = new URLSearchParams(window.location.search)
        if (params.get("eventDebug") === "1") {
            const minutes = Number(params.get("eventDebugMinutes") ?? "2")
            const safeMinutes = Number.isFinite(minutes) && minutes > 0 ? minutes : 2
            setEventStart(new Date(Date.now() + safeMinutes * 60 * 1000))
        } else {
            setEventStart(eventStartBase)
        }
        hasAutoOpened.current = false
        setIsOpen(false)
        setHasStarted(false)
        setTimeLeft("")
    }, [eventStartBase])

    useEffect(() => {
        if (!hasCopied) return
        const timeout = setTimeout(() => setHasCopied(false), 2000)
        return () => clearTimeout(timeout)
    }, [hasCopied])

    useEffect(() => {
        const updateState = () => {
            const now = new Date()
            const started = now >= eventStart
            setHasStarted(started)

            if (started && !hasAutoOpened.current) {
                hasAutoOpened.current = true
                setIsOpen(true)
            }

            if (!started) {
                const diffMs = Math.max(0, eventStart.getTime() - now.getTime())
                const totalSeconds = Math.floor(diffMs / 1000)
                const days = Math.floor(totalSeconds / 86400)
                const hours = Math.floor((totalSeconds % 86400) / 3600)
                const minutes = Math.floor((totalSeconds % 3600) / 60)
                const seconds = totalSeconds % 60
                const dayLabel = days > 0 ? `${days}d ` : ""
                setTimeLeft(
                    `${dayLabel}${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`
                )
            } else {
                setTimeLeft("")
            }
        }

        updateState()
        const interval = setInterval(updateState, 1000)

        return () => clearInterval(interval)
    }, [eventStart])

    return (
        <section className="py-16 md:py-32 dark:bg-transparent bg-transparent">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <TextEffect
                        triggerOnView
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        as="h2"
                        className="text-balance text-4xl font-semibold lg:text-5xl">
                        Join us for Claremont's first official v0 builder event
                    </TextEffect>
                    <div className="mt-6 flex flex-col items-center gap-3 text-sm text-muted-foreground">
                        <Button
                            type="button"
                            size="lg"
                            className="shadow-sm"
                            disabled={!hasStarted}
                            onClick={() => setIsOpen(true)}
                        >
                            {hasStarted ? "View v0 credit details" : `Credits unlock in ${timeLeft || "soon"}`}
                        </Button>
                        <span>Local time. Button activates at the event start.</span>
                    </div>
                </div>
                <AnimatedGroup
                    triggerOnView
                    variants={{
                        container: {
                            visible: {
                                transition: {
                                    staggerChildren: 0.05,
                                    delayChildren: 0.75,
                                },
                            },
                        },
                        ...transitionVariants,
                    }}
                >
                    <Card
                        className="@min-4xl:max-w-full @min-4xl:grid-cols-3 @min-4xl:divide-x @min-4xl:divide-y-0 mx-auto mt-8 grid max-w-sm divide-y overflow-hidden shadow-zinc-950/5 *:text-center md:mt-16">
                        <div className="group shadow-zinc-950/5">
                            <CardHeader className="pb-3">
                                <CardDecorator>
                                    <CircleDollarSignIcon
                                        className="size-6"
                                        aria-hidden
                                    />
                                </CardDecorator>

                                <h3 className="mt-6 font-medium text-xl">Free v0 Credits</h3>
                            </CardHeader>

                            <CardContent>
                                <p className="text-sm text-muted-foreground">Credits to use towards building with
                                    v0.</p>
                            </CardContent>
                        </div>

                        <div className="group shadow-zinc-950/5">
                            <CardHeader className="pb-3">
                                <CardDecorator>
                                    <EarthIcon
                                        className="size-6"
                                        aria-hidden
                                    />
                                </CardDecorator>

                                <h3 className="mt-6 font-medium text-xl">Global Gallery</h3>
                            </CardHeader>

                            <CardContent>
                                <p className="mt-3 text-sm text-muted-foreground">Every project showcased in a worldwide
                                    exhibition</p>
                            </CardContent>
                        </div>

                        <div className="group shadow-zinc-950/5">
                            <CardHeader className="pb-3">
                                <CardDecorator>
                                    <UsersIcon
                                        className="size-6"
                                        aria-hidden
                                    />
                                </CardDecorator>

                                <h3 className="mt-6 font-medium text-xl">Community Voting</h3>
                            </CardHeader>

                            <CardContent>
                                <p className="mt-3 text-sm text-muted-foreground">Builders vote for favorites, winners
                                    get
                                    prizes</p>
                            </CardContent>
                        </div>
                    </Card>
                </AnimatedGroup>
            </div>

            {isOpen && hasStarted ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-6 py-8">
                    <button
                        type="button"
                        aria-label="Close credit information"
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    <Card className="relative w-full max-w-xl border bg-background/95 shadow-xl">
                        <CardHeader className="pb-2 text-center">
                            <h3 className="text-2xl font-semibold">v0 Credit Information</h3>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground">
                            <div className="rounded-lg border border-dashed px-4 py-3 text-base font-semibold text-foreground text-center">
                                Code: <span className="font-mono">V0PROMPTTOPRODUCTION2026</span>
                            </div>
                            <p>Credits will expire 2 weeks after redemption and can be redeemed once per individual.</p>
                            <p>Credits can be redeemed at v0.app by going to Profile &gt;&gt; Settings &gt;&gt; Billing &gt;&gt; Redeem usage code.</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <Button
                                    type="button"
                                    onClick={async () => {
                                        await navigator.clipboard.writeText("V0PROMPTTOPRODUCTION2026")
                                        setHasCopied(true)
                                    }}
                                >
                                    {hasCopied ? "Copied" : "Copy code"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : null}
        </section>
    )
}

const CardDecorator = ({children}: { children: ReactNode }) => (
    <div
        className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[24px_24px] dark:opacity-50"
        />

        <div
            className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)
