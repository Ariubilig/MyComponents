import { useState, useEffect } from "react"
import './about.css'


export default function AboutPage() {

    const [currentTime, setCurrentTime] = useState("")

    useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Ulaanbaatar", // GMT+8
    })
    const updateTime = () => {
        setCurrentTime(formatter.format(new Date()))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
    }, [])



    return (
        <>
            <div className="about-page">
                <header className="about-header">
                    <h1 className="about-title">ABOUT</h1>
                    <button
                        className="about-close"
                        type="button"
                        aria-label="Close"
                        onClick={() => window.history.back()}
                    >
                        × <span>CLOSE</span>
                    </button>
                </header>

                <main className="about-grid">
                    <section className="about-bio">
                        <p>
                            I am a developer crafting motion‑based websites focusing on both
                            aesthetics and performance where each animation is fine‑tuned to
                            give the most pleasant feeling. I enjoy pushing creativity
                            boundaries and expressing a certain sensitivity in my approach to
                            work.
                        </p>
                        <p>
                            When I am not coding, I make electronic music.
                        </p>
                    </section>

                    <section className="about-col">
                        <div className="about-label">LOCATION</div>
                        <div>Ulaanbaatar, MN</div>
                        <div>47°55'24" N 106°55'12" E</div>
                    </section>

                    <section className="about-col">
                        <div className="about-label">SOCIALS</div>
                        <ul className="about-list">
                            <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
                            <li><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></li>
                            <li><a href="https://open.spotify.com" target="_blank" rel="noreferrer">Spotify</a></li>
                        </ul>
                    </section>

                    <section className="about-col">
                        <div className="about-label">STACK</div>
                        <ul className="about-list two-col">
                            <li>JavaScript</li>
                            <li>TypeScript</li>
                            <li>HTML5</li>
                            <li>CSS3 / Tailwind</li>
                            <li>React</li>
                            <li>Next.js</li>
                            <li>GSAP</li>
                            <li>Three.js</li>
                            <li>Node.js</li>
                            <li>Express</li>
                            <li>MongoDB</li>
                        </ul>
                    </section>

                    <section className="about-actions">
                        <a className="resume-link" href="#" onClick={(e) => e.preventDefault()}>Download Resume</a>
                        <span className="handle">@yourhandle</span>
                    </section>
                </main>
            </div>

            <footer className="footer">
                <span>{currentTime}</span>
                <span className="footer-title">FRONTEND DEV</span>
            </footer>
        </>
    )
}