const API_KEY = "3d1bae8abd2241248ba96b84402ce373";
const BASE_URL = "https://newsapi.org/v2";

// Create News Card
function createNewsCard(article) {
    return `
        <div class="news-card">
            <img src="${
                article.urlToImage ||
                "https://via.placeholder.com/400x250?text=No+Image"
            }" alt="News Image">

            <div class="news-content">
                <h3>${article.title || "No Title Available"}</h3>

                <p>
                    ${
                        article.description
                            ? article.description.substring(0, 120) + "..."
                            : "No description available."
                    }
                </p>

                <div class="news-source">
                    <strong>${article.source?.name || "Unknown Source"}</strong>
                    <br>
                    ${new Date(article.publishedAt).toLocaleDateString()}
                </div>

                <a href="${article.url}"
                   target="_blank">
                   Read More
                </a>
            </div>
        </div>
    `;
}

// Fetch News by Category
async function fetchCategoryNews(category, containerId) {
    try {

        let url;

        if (category === "india") {
    url = `${BASE_URL}/everything?q=India&pageSize=6&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;
}
        else if (category === "world") {
            url = `${BASE_URL}/everything?q=world&pageSize=6&sortBy=publishedAt&apiKey=${API_KEY}`;
        }
        else if (category === "today") {
            url = `${BASE_URL}/top-headlines?country=us&pageSize=6&apiKey=${API_KEY}`;
        }
        else {
            url = `${BASE_URL}/top-headlines?category=${category}&country=us&pageSize=6&apiKey=${API_KEY}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        const container = document.getElementById(containerId);

        if (!container) return;

        if (!data.articles || data.articles.length === 0) {
            container.innerHTML =
                "<p>No news available.</p>";
            return;
        }

        container.innerHTML = data.articles
            .map(createNewsCard)
            .join("");

    } catch (error) {
        console.error(error);

        const container = document.getElementById(containerId);

        if (container) {
            container.innerHTML =
                "<p>Unable to load news.</p>";
        }
    }
}

// Search News
async function searchNews() {

    const searchInput =
        document.getElementById("searchInput");

    const query = searchInput.value.trim();

    if (!query) {
        alert("Please enter a keyword.");
        return;
    }

    try {

        const response = await fetch(
            `${BASE_URL}/everything?q=${query}&pageSize=20&sortBy=publishedAt&apiKey=${API_KEY}`
        );

        const data = await response.json();

        const sections =
            document.querySelectorAll(".news-grid");

        sections.forEach(section => {
            section.innerHTML = "";
        });

        const firstSection =
            document.getElementById("todayNews");

        if (data.articles && data.articles.length > 0) {

            firstSection.innerHTML =
                data.articles
                    .map(createNewsCard)
                    .join("");

            window.scrollTo({
                top: firstSection.offsetTop - 100,
                behavior: "smooth"
            });

        } else {

            firstSection.innerHTML =
                "<p>No news found.</p>";
        }

    } catch (error) {

        console.error(error);

        alert("Error fetching search results.");
    }
}

// Search Button Event
document.addEventListener("DOMContentLoaded", () => {

    const searchBtn =
        document.getElementById("searchBtn");

    if (searchBtn) {
        searchBtn.addEventListener(
            "click",
            searchNews
        );
    }

    // Load News Sections
    fetchCategoryNews("today", "todayNews");
    fetchCategoryNews("india", "indiaNews");
    fetchCategoryNews("technology", "technologyNews");
    fetchCategoryNews("business", "businessNews");
    fetchCategoryNews("sports", "sportsNews");
    fetchCategoryNews("health", "healthNews");
    fetchCategoryNews("entertainment", "entertainmentNews");
    fetchCategoryNews("science", "scienceNews");
    fetchCategoryNews("world", "worldNews");
});

// Search by Enter Key
document.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        searchNews();
    }
});