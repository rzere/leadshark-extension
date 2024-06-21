# LeadShark Extension

Our Chrome extension can fetch LinkedIn profiles and enhance with additional information using the Apollo and Prospeo APIs.

## Getting Started

Follow these steps to set up and deploy the extension.

### Prerequisites

- Node.js and npm installed on your machine.
- A Chrome browser.

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/rzere/leadshark-extension.git
    cd leadshark-extension
    ```

2. **Install the necessary libraries:**

    ```sh
    npm install
    ```

3. **Create a `.env` file in the root directory:**

    ```sh
    touch .env
    ```

4. **Add the necessary API keys to the `.env` file:**

    ```env
    APOLLO_API_KEY=your_apollo_api_key
    PROSPEO_API_KEY=your_prospeo_api_key
    ```

### Running the Server

1. **Start the server:**

    ```sh
    node server.js
    ```

    This will start the proxy server on `http://localhost:3000`.

### Loading the Extension in Chrome

1. **Open Chrome and navigate to `chrome://extensions/`.**

2. **Enable Developer mode by clicking the toggle switch in the top right corner.**

3. **Click the "Load unpacked" button and select the directory where you cloned the repository.**

4. **The extension should now be loaded and visible in the extensions list.**

### Using the Extension

1. **Navigate to LinkedIn and perform a search.**

2. **Click on the extension icon in the Chrome toolbar.**

3. **The extension will automatically scrape the LinkedIn profiles and display the results in a popup.**

4. **Click the "Enhance" button next to a profile to fetch additional information using the Apollo API.**

5. **If no email is found, click the "Check Again with Prospeo" button to fetch the email using the Prospeo API.**

### Code Overview

- **server.js**: Sets up an Express server to handle API requests to Apollo and Prospeo.
- **content.js**: Contains the content script that scrapes LinkedIn profiles.
- **popup.js**: Manages the popup UI and handles interactions with the content script and server.

### Example Code References

- **server.js**: Handles API requests to Apollo and Prospeo.
  ```typescript:server.js
  startLine: 1
  endLine: 58
  ```

- **content.js**: Scrapes LinkedIn profiles.
  ```typescript:content.js
  startLine: 1
  endLine: 47
  ```

- **popup.js**: Manages the popup UI and interactions.
  ```typescript:popup.js
  startLine: 1
  endLine: 237
  ```

### Troubleshooting

- **API Errors**: Ensure your API keys are correct and have sufficient credits.
- **Extension Not Loading**: Make sure you have enabled Developer mode and selected the correct directory.

### Contributing

Feel free to submit issues or pull requests if you find any bugs or have suggestions for improvements.

### License

This project is licensed under the MIT License.
