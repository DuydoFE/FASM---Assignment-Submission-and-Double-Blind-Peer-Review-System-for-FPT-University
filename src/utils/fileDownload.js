import api from "../config/axios";

/**
 * Download a file with authentication
 * @param {string} fileUrl - The URL of the file to download
 * @param {string} fileName - The name to save the file as
 */
export const downloadFile = async (fileUrl, fileName) => {
  try {
    // Make an authenticated request to get the file
    const response = await api.get(fileUrl, {
      responseType: 'blob', // Important: This tells axios to handle binary data
    });

    // Create a blob from the response data
    const blob = new Blob([response.data], { type: response.headers['content-type'] });

    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName || 'downloaded-file';
    link.style.display = 'none';

    // Append to the document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL
    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

/**
 * Alternative method to download file using a direct URL with authorization header
 * @param {string} fileUrl - The URL of the file to download
 * @param {string} fileName - The name to save the file as
 */
export const downloadFileWithAuth = async (fileUrl, fileName) => {
  try {
    // If the fileUrl is a relative path that needs authentication
    const isRelativeUrl = !fileUrl.startsWith('http');
    
    if (isRelativeUrl) {
      // Use the API instance which includes auth headers
      const response = await api.get(fileUrl, {
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'downloaded-file';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      // For absolute URLs, we need to proxy through our backend
      // or the user needs to have a valid session/cookie
      const response = await api.get('/proxy/file', {
        params: { url: fileUrl },
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName || 'downloaded-file';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};