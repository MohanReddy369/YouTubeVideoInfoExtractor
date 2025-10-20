const API_KEY = "YOUR_API_KEY_HERE"; // <-- Replace with your API Key(The API name is:YouTube Data API v3)

document.getElementById("getInfoBtn").addEventListener("click", async function() {
    const url = document.getElementById("videoUrl").value.trim();

    if (!url) {
        alert("Please enter a YouTube URL");
        return;
    }

    // Function to extract video ID from any YouTube URL
    function extractVideoId(url) {
        let videoId = null;

        // Long URL: https://www.youtube.com/watch?v=VIDEOID
        if (url.includes("youtube.com")) {
            try {
                const urlObj = new URL(url);
                videoId = urlObj.searchParams.get("v");
            } catch (e) {
                videoId = null;
            }
        }

        // Short URL: https://youtu.be/VIDEOID
        if (!videoId && url.includes("youtu.be")) {
            const parts = url.split("/");
            videoId = parts[parts.length - 1].split("?")[0]; // remove query params
        }

        return videoId;
    }

    const videoId = extractVideoId(url);

    if (!videoId) {
        alert("Invalid YouTube URL");
        return;
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            document.getElementById("result").innerHTML = "No video found!";
            return;
        }

        const video = data.items[0];
        const snippet = video.snippet;
        const stats = video.statistics;

        document.getElementById("result").innerHTML = `
            <h3>${snippet.title}</h3>
            <p><b>Channel:</b> ${snippet.channelTitle}</p>
            <p><b>Views:</b> ${stats.viewCount}</p>
            <p><b>Published on:</b> ${new Date(snippet.publishedAt).toLocaleDateString()}</p>
            <p><b>Description:</b> ${snippet.description ? snippet.description.substring(0, 300) + "..." : "No description"}</p>
        `;
    } catch (error) {
        console.error(error);
        document.getElementById("result").innerHTML = "Error fetching video info!";
    }
});

