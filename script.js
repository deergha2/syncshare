async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) return alert('Please select a file.');

    // Get SAS token from your server
    const response = await fetch('/generate-sas-token');
    const sasToken = await response.text();

    const blobUrl = sasToken + '&' + new URLSearchParams({
        'sv': '2021-06-08',
        'ss': 'b',
        'srt': 'sco',
        'sp': 'rwd',
        'se': '2024-07-31T00:00:00Z',
        'st': '2024-07-30T00:00:00Z',
        'spr': 'https,http',
        'sig': 'your_signature'
    }).toString();

    try {
        const response = await fetch(blobUrl, {
            method: 'PUT',
            headers: {
                'x-ms-blob-type': 'BlockBlob',
            },
            body: file
        });
        if (response.ok) {
            alert('File uploaded successfully');
        } else {
            alert('Failed to upload file');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
    }
}