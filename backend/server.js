const express = require("express");
const puppeteer = require("puppeteer-core");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/scrape", async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        // Use Puppeteer with a system-installed Chromium
        const browser = await puppeteer.launch({
            executablePath: "/usr/bin/chromium-browser", // Use Render's system-installed Chrome
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "domcontentloaded" });

        const result = await page.evaluate(() => {
            const getText = (selector) => document.querySelector(selector)?.innerText.trim() || "N/A";
            const getImages = (selector) =>
                [...document.querySelectorAll(selector)].map((img) => img.src);

            const getReviews = () => {
                return [...document.querySelectorAll(".review-text-content span")].map(review => review.innerText.trim());
            };

            return {
                productName: getText("#productTitle"),
                rating: getText(".a-icon-alt"),
                numRatings: getText("#acrCustomerReviewText"),
                price: getText(".a-price-whole"),
                discount: getText(".savingsPercentage"),
                bankOffers: getText("#ppd-bundles-section"),
                aboutThisItem: getText("#feature-bullets"),
                productInfo: getText("#productDetails_techSpec_section_1"),
                productImages: getImages("#imgTagWrapperId img"),
                manufacturerImages: getImages("#aplus"),
                aiReviewSummary: getText(".a-section.a-spacing-medium"), // AI-generated summary
                reviews: getReviews(), // Extract all reviews
            };
        });

        await browser.close();
        res.json(result);
    } catch (error) {
        console.error("Scraping error:", error);
        res.status(500).json({ error: "Failed to scrape data", details: error.message });
    }
});

// Use Render's PORT or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
