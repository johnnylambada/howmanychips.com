export default function About() {
    return (
        <div>
            <div className="input-section">
                <h2>About How Many Chips</h2>
                <p>
                    How Many Chips is a free calculator tool designed to help poker enthusiasts
                    plan their home games with ease.
                </p>

                <h3>Our Story</h3>
                <p>
                    This tool was created by poker players who were tired of running out of chips
                    mid-game or struggling to distribute chips fairly among players. We wanted a simple
                    way to calculate optimal chip distributions for any size game.
                </p>

                <h3>How It Works</h3>
                <p>
                    Our calculator uses algorithms to determine the most efficient distribution of poker
                    chips based on:
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                    <li>Number of players</li>
                    <li>Number of buy-ins (including fractional buy-ins)</li>
                    <li>Available chip types and quantities</li>
                    <li>Chip values</li>
                </ul>

                <h3>Contact</h3>
                <p>
                    Have questions, feedback, or suggestions? We'd love to hear from you!
                </p>
                <p>
                    Email: contact@howmanychips.com
                </p>
            </div>
    </div>
    );
}