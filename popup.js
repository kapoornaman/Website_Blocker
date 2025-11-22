// Check current blocking status on load
async function checkStatus() {
  const data = await browser.storage.local.get(["isBlocked", "password", "blocklist"]);
  if (data.isBlocked && data.password) {
    // Don't show password, just show that sites are blocked
    document.getElementById("generatedPassword").textContent = "Sites are BLOCKED";
    document.getElementById("generatedPassword").style.color = "red";
    
    if (data.blocklist && data.blocklist.length > 0) {
      document.getElementById("blockedSites").textContent = 
        "Blocked: " + data.blocklist.join(", ");
    }
    
    document.getElementById("blockAll").textContent = "Sites Already Blocked";
    document.getElementById("blockAll").disabled = true;
  } else {
    document.getElementById("generatedPassword").textContent = "";
    document.getElementById("blockedSites").textContent = "";
    document.getElementById("blockAll").textContent = "Block All Sites";
    document.getElementById("blockAll").disabled = false;
  }
}

// Initialize on load
checkStatus();

// Handle Block All Sites button
document.getElementById("blockAll").onclick = async () => {
  const res = await browser.runtime.sendMessage({
    action: "blockAll"
  });

  if (res.success) {
    // Show password in alert (larger and more readable)
    alert("SITES BLOCKED!\n\nPASSWORD GENERATED:\n\n" + res.password + "\n\n⚠️ SAVE THIS PASSWORD!\n\nYou'll need it to unblock sites later.");
    
    // After alert, hide password and just show status
    document.getElementById("generatedPassword").textContent = "Sites are BLOCKED";
    document.getElementById("generatedPassword").style.color = "red";
    
    // Show blocked sites list
    if (res.blocklist && res.blocklist.length > 0) {
      document.getElementById("blockedSites").textContent = 
        "Blocked: " + res.blocklist.join(", ");
    }
    
    document.getElementById("blockAll").textContent = "Sites Already Blocked";
    document.getElementById("blockAll").disabled = true;
  }
};

// Handle Unblock button
document.getElementById("unblock").onclick = async () => {
  const passwordInput = document.getElementById("password").value.trim();
  const msgElement = document.getElementById("msg");

  if (!passwordInput) {
    msgElement.textContent = "Please enter a password!";
    msgElement.style.color = "red";
    return;
  }

  const res = await browser.runtime.sendMessage({
    action: "unblock",
    password: passwordInput
  });

  if (res.success) {
    msgElement.textContent = "Successfully unblocked!";
    msgElement.style.color = "green";
    document.getElementById("password").value = "";
    document.getElementById("generatedPassword").textContent = "";
    document.getElementById("blockedSites").textContent = "";
    document.getElementById("blockAll").textContent = "Block All Sites";
    document.getElementById("blockAll").disabled = false;
    
    // Clear message after 2 seconds
    setTimeout(() => {
      msgElement.textContent = "";
    }, 2000);
  } else {
    msgElement.textContent = "Incorrect password!";
    msgElement.style.color = "red";
  }
};
