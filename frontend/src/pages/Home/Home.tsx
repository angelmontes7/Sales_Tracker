import React, { useEffect } from 'react';
import './Home.css';

const Home: React.FC = () => {

    return (
        <>
            <nav id="navbar">
                <div className="container">
                    <div className="nav-container">
                        <div className="logo">SalesTracker Pro</div>
                        <ul className="nav-links">
                            <li><a href="#features">Features</a></li>
                            <li><a href="#how-it-works">How It Works</a></li>
                            <li><a href="#tech-stack">Technology</a></li>
                        </ul>
                        <a href="/login" className="cta-btn">Get Started</a>
                    </div>
                </div>
            </nav>

            <section className="hero">
                <div className="hero-bg"></div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text fade-in">
                            <h1>Transform Your <span className="gradient-text">Life Insurance Sales</span> with Intelligent Discord Analytics</h1>
                            <p>Automatically track, analyze, and optimize your team's sales performance with our cutting-edge Discord bot.</p>
                            <div className="hero-buttons">
                                <a href="#cta" className="btn-primary">Start Free Trial</a>
                                <a href="#how-it-works" className="btn-secondary">See How It Works</a>
                            </div>
                        </div>
                        <div className="hero-visual fade-in">
                            <div className="discord-mockup">
                                <div className="mockup-header"><h3># sales-team</h3></div>
                                <div className="message"><div className="message-user">Angel | Viper</div><div className="message-content">$1890 AP Americo 08/10</div></div>
                                <div className="message"><div className="message-user">Sarah | Phoenix</div><div className="message-content">$2450 AP Lincoln 08/11</div></div>
                                <div className="message"><div className="message-user">Mike | Thunder</div><div className="message-content">$3200 AP Mutual 08/10</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features" id="features">
                <div className="container">
                    <div className="section-title animate-on-scroll">
                        <h2>Powerful Features That <span className="gradient-text">Drive Success</span></h2>
                        <p>Everything you need to transform Discord conversations into actionable sales intelligence</p>
                    </div>
                    <div className="features-grid">
                        {[
                            { icon: "📊", title: "Real-time Analytics", text: "Get instant insights..." },
                            { icon: "🏆", title: "Team Leaderboards", text: "Foster healthy competition..." },
                            { icon: "🎯", title: "Company Insights", text: "Track which insurance companies..." },
                            { icon: "📅", title: "Closing Analysis", text: "Analyze whether sales are closed..." },
                            { icon: "🔄", title: "Automatic Processing", text: "Zero manual work required..." },
                            { icon: "🔒", title: "Secure & Reliable", text: "Enterprise-grade security..." },
                        ].map((item, idx) => (
                            <div className="feature-card animate-on-scroll" key={idx}>
                                <div className="feature-icon">{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works" id="how-it-works">
                <div className="container">
                    <div className="section-title animate-on-scroll">
                        <h2>How It <span className="gradient-text">Works</span></h2>
                        <p>Simple setup, powerful results.</p>
                    </div>
                    <div className="process-steps">
                        {[
                            { number: "1", title: "Add Bot to Discord", desc: "Simply invite our bot..." },
                            { number: "2", title: "Team Posts Sales", desc: "Your team continues posting..." },
                            { number: "3", title: "Automatic Processing", desc: "Our bot instantly captures..." },
                            { number: "4", title: "View Analytics", desc: "Access your comprehensive dashboard..." }
                        ].map((step, idx) => (
                            <div className="step animate-on-scroll" key={idx}>
                                <div className="step-number">{step.number}</div>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section className="tech-stack" id="tech-stack">
                <div className="container">
                    <div className="section-title animate-on-scroll">
                        <h2>Built with <span className="gradient-text">Cutting-Edge Technology</span></h2>
                        <p>Leveraging modern tech for performance</p>
                    </div>
                    <div className="tech-grid">
                        {[
                            { icon: "⚛️", title: "React + TypeScript", desc: "Modern frontend with type safety" },
                            { icon: "🐍", title: "Django Backend", desc: "Robust Python backend" },
                            { icon: "🤖", title: "Python Discord Bot", desc: "Seamless message processing" },
                            { icon: "🛢️", title: "Neon PostgreSQL", desc: "Fast serverless DB" }
                        ].map((tech, idx) => (
                            <div className="tech-item animate-on-scroll" key={idx}>
                                <div className="tech-logo">{tech.icon}</div>
                                <h3>{tech.title}</h3>
                                <p>{tech.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section" id="cta">
                <div className="container">
                    <div className="animate-on-scroll">
                        <h2>Ready to Revolutionize Your Sales Analytics?</h2>
                        <p>Join life insurance teams maximizing their performance with SalesTracker Pro.</p>
                        <a href="#" className="btn-primary">Start Free Trial - No Credit Card Required</a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer>
                <div className="container">
                    <div className="footer-content">
                        {["Product", "Company", "Support", "Legal"].map((section, idx) => (
                            <div className="footer-section" key={idx}>
                                <h4>{section}</h4>
                                <ul>
                                    {["Features", "Pricing", "Documentation", "API"].map((link, lidx) => (
                                        <li key={lidx}><a href="#">{link}</a></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2025 SalesTracker Pro. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Home;
