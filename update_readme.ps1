$readme = "README.md"

# Commit 1: Intro
$content1 = @"
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Ganga Tiram: 2,525 Kilometers of Heritage

Welcome to the **Ganga Tiram** project repository. This platform is a digital and physical tribute to the holy Ganges river, tracing its path from the Himalayas to the Bay of Bengal.
"@
Set-Content -Path $readme -Value $content1 -Encoding UTF8
git add $readme
git commit -m "docs: add intro and banner to README"

# Commit 2: Overview
$content2 = @"

## 📖 Overview
Ganga Tiram is an immersive web experience and heritage collection that documents 75 sacred locations along the 2,525 km course of the Ganga river. Our goal is to preserve the rich cultural, spiritual, and ecological legacy of the river and present it to the world.
"@
Add-Content -Path $readme -Value $content2 -Encoding UTF8
git add $readme
git commit -m "docs: add overview section"

# Commit 3: Features
$content3 = @"

## ✨ Key Features
- **Interactive Map:** Trace the exact route of the Ganga through 75 documented locations.
- **Cultural Archives:** Explore local art forms, music, and traditions.
- **Heritage Book Collection:** Purchase a tangible 300-page visual trail across sacred locations.
- **Ecological Action:** Direct support for environmental preservation efforts along the river.
"@
Add-Content -Path $readme -Value $content3 -Encoding UTF8
git add $readme
git commit -m "docs: add key features section"

# Commit 4: Architecture
$content4 = @"

## 🏗️ Architecture & Tech Stack
The project is built with modern web technologies focused on performance and aesthetic design:
- **Frontend Framework:** React 18 with TypeScript and Vite.
- **Styling:** Tailwind CSS for rapid, responsive UI development.
- **Animations:** Framer Motion for smooth, cinematic UI transitions.
- **Icons:** Lucide React for crisp, scalable iconography.
"@
Add-Content -Path $readme -Value $content4 -Encoding UTF8
git add $readme
git commit -m "docs: add architecture and tech stack section"

# Commit 5: Cause
$content5 = @"

## 🌱 The Cause & Impact
Ganga Tiram is more than a project; it's a movement.
- **Art & Craftsmanship:** Supporting Banarasi silk weavers and Madhubani painters.
- **Environmental Preservation:** Funding clean-water patrols and plastic waste removal (5,000 kg monthly).
- **Ecological Action:** Monitoring the Gangetic Dolphin Sanctuary and eliminating chemical waste.
"@
Add-Content -Path $readme -Value $content5 -Encoding UTF8
git add $readme
git commit -m "docs: add the cause and impact section"

# Commit 6: Installation
$content6 = @"

## 🚀 Getting Started (Local Development)
To run this project locally, you will need Node.js installed.

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and add your configuration (e.g., `GEMINI_API_KEY` if applicable).
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` (or the port specified in your terminal) in your browser.
"@
Add-Content -Path $readme -Value $content6 -Encoding UTF8
git add $readme
git commit -m "docs: add installation and setup instructions"

# Commit 7: Open Source
$content7 = @"

## 🤝 Open Source & Contributing
We believe in the power of community. **Ganga Tiram is open source**, and we welcome contributions from developers, designers, historians, and environmentalists.
- **Code:** Submit PRs for bug fixes, performance improvements, or new features.
- **Content:** Help us document more locations, stories, or art forms.
Please read our `CONTRIBUTING.md` (coming soon) before making a pull request.
"@
Add-Content -Path $readme -Value $content7 -Encoding UTF8
git add $readme
git commit -m "docs: add open source and contributing guidelines"

# Commit 8: License
$content8 = @"

## 📄 License
This project is licensed under the Apache 2.0 License. See the `LICENSE` file for more details. We encourage sharing and adaptation while giving appropriate credit.
"@
Add-Content -Path $readme -Value $content8 -Encoding UTF8
git add $readme
git commit -m "docs: add license information"

# Commit 9: Credits
$content9 = @"

## 🙏 Credits & Acknowledgements
- **Development & Design:** Built with passion for the Ganga Heritage.
- **Images:** High-quality imagery curated and generated for local hosting.
- **Artisans:** Deep gratitude to the weavers, painters, and locals who keep the traditions alive.
"@
Add-Content -Path $readme -Value $content9 -Encoding UTF8
git add $readme
git commit -m "docs: add credits and acknowledgements section"

# Commit 10: Badges and Polish
$content10 = @"

---
<div align="center">
Made with ❤️ in India.
</div>
"@
Add-Content -Path $readme -Value $content10 -Encoding UTF8
git add $readme
git commit -m "docs: add footer and final polish"
