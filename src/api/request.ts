export async function my_request(path: string) {
    try {
        console.log("Fetching:", path); // Debug log
        
        const response = await fetch(path);

        console.log("Response status:", response.status); // Debug log

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - URL: ${path}`);
        }

        const data = await response.json();
        console.log("Response data:", data); // Debug log
        
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}