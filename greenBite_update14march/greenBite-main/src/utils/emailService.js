export const sendApprovalEmail = async (ngoEmail, ngoName) => {
  try {
    const response = await fetch('http://localhost:5000/api/send-approval-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: ngoEmail,
        ngoName: ngoName 
      })
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};