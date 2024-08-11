export function formatDate(dateString: string) {
    const date = new Date(dateString);
  
    // Array of month names
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    // Extract the day, month, and year from the date
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
  
    // Return the formatted date
    return `${month} ${day}, ${year}`;
  }