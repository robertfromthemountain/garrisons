function formatDate(date) {
    if (!date) return "";
  
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      console.error("Invalid date provided:", date);
      return ""; // Return a fallback if the date is invalid
    }
  
    return new Intl.DateTimeFormat("hu-HU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",  // Optional, depending on how you want to display the time zone
    }).format(parsedDate);
  }
  
  function formatTime(time) {
    if (!time) return "";
  
    const parsedTime = new Date(time);
    if (isNaN(parsedTime)) {
      console.error("Invalid time provided:", time);
      return ""; // Return a fallback if the time is invalid
    }
  
    return new Intl.DateTimeFormat("hu-HU", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",  // Optional, depending on how you want to display the time zone
    }).format(parsedTime);
  }
  
  module.exports = {
    formatDate,
    formatTime
  };