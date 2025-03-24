import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // Import custom CSS

function App() {
    const [url, setUrl] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        if (!url.trim()) return alert("Please enter a valid Amazon URL");

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/scrape", { url });
            setData(response.data);
        } catch (error) {
            alert("Error fetching data");
        }
        setLoading(false);
    };

    return (
        <div className="container mt-5">
            <div className="scraper-box">
                <h2 className="text-center mb-4">📺 Amazon Smart TV Scraper</h2>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Amazon Smart TV URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={fetchData} disabled={loading}>
                        {loading ? "Scraping..." : "Scrape"}
                    </button>
                </div>
            </div>

            {data && (
                <div className="card product-card p-3 mt-4">
                    <h4 className="text-primary">{data.productName}</h4>
                    <p>⭐ <strong>{data.rating}</strong> ({data.numRatings})</p>
                    <p>💰 <strong>Price:</strong> {data.price} <span className="text-success">({data.discount})</span></p>
                    <p>🎁 <strong>Bank Offers:</strong> {data.bankOffers}</p>
                    <p><strong>About This Item:</strong> {data.aboutThisItem}</p>
                    <p><strong>Product Information:</strong> {data.productInfo}</p>

                    <h5 className="mt-3">🖼️ Images:</h5>
                    <div className="image-container">
                        {data.productImages?.map((img, index) => (
                            <img key={index} src={img} alt="Product" className="product-image" />
                        ))}
                    </div>

                    <h5 className="mt-4">📝 Customer Reviews:</h5>
                    <div className="reviews-box">
                        {data.reviews && data.reviews.length > 0 ? (
                            data.reviews.map((review, index) => (
                                <p key={index} className="review-item">🗨️ {review}</p>
                            ))
                        ) : (
                            <p>No reviews available</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
