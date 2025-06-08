document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById('command'); 
  const output = document.getElementById('output');

  const Commands = {
    help: "Available commands: open file [name], close file [name], next, back, help",
    status: "All systems nominal.",
    launch: "Rocket launch initiated...",
    testprint: "This is a test print message."
  };

  const Files = {
    "File #1": [
      "File #1 - Page 1: Welcome to File #1.",
      "File #1 - Page 2: Here's some more data.",
      "File #1 - Page 3: The end of File #1."
    ],
    "File #2": [
      "File #2 - Page 1: Another file begins here.",
      "File #2 - Page 2: It continues...",
    ]
  };

  let currentFile = null;
  let currentPage = 0;

  // Confirmation system
  let awaitingCloseConfirmation = false;
  let pendingFileToOpen = null;

  function handleCommand(cmd) {
    cmd = cmd.trim();

    // Handle "yes" or "no" confirmation if awaiting close
    if (awaitingCloseConfirmation) {
      if (cmd.toLowerCase() === "yes") {
        const closed = currentFile;
        currentFile = pendingFileToOpen;
        currentPage = 0;
        awaitingCloseConfirmation = false;
        pendingFileToOpen = null;
        return `${closed} closed.\n${currentFile} opened:\n${Files[currentFile][currentPage]}`;
      } else if (cmd.toLowerCase() === "no") {
        awaitingCloseConfirmation = false;
        pendingFileToOpen = null;
        return Files[currentFile][currentPage]; // re-show current page
      } else {
        return `Please type 'Yes' or 'No'.`;
      }
    }

    // Open File
    if (cmd.toLowerCase().startsWith("open file")) {
      const fileName = cmd.substring(9).trim(); // everything after "open file"
      if (!Files.hasOwnProperty(fileName)) {
        return `Error: ${fileName} not found.`;
      }
      if (currentFile && currentFile !== fileName) {
        awaitingCloseConfirmation = true;
        pendingFileToOpen = fileName;
        return `Close ${currentFile}? Yes / No`;
      }
      currentFile = fileName;
      currentPage = 0;
      return Files[fileName][currentPage];
    }

    // Close File
    if (cmd.toLowerCase().startsWith("close file")) {
      const fileName = cmd.substring(10).trim();
      if (currentFile === fileName) {
        currentFile = null;
        currentPage = 0;
        return `${fileName} closed.`;
      } else if (!currentFile) {
        return `Error: No file is currently open.`;
      } else {
        return `Error: ${fileName} is not open.`;
      }
    }

    // Next page
    if (cmd.toLowerCase() === "next") {
      if (!currentFile) return "Error: No file is currently open.";
      if (currentPage + 1 >= Files[currentFile].length) return "End of file reached.";
      currentPage++;
      return Files[currentFile][currentPage];
    }

    // Back page
    if (cmd.toLowerCase() === "back") {
      if (!currentFile) return "Error: No file is currently open.";
      if (currentPage === 0) return "You're already at the beginning.";
      currentPage--;
      return Files[currentFile][currentPage];
    }

    // Simple predefined commands
    if (Commands.hasOwnProperty(cmd)) {
      return Commands[cmd];
    }

    // List files / File manager
if (cmd.toLowerCase() === "list files" || cmd.toLowerCase() === "ls") {
  const fileList = Object.entries(Files)
    .map(([name, pages]) => `- ${name} (${pages.length} page${pages.length > 1 ? 's' : ''})`)
    .join("\n");
  return `Available files:\n${fileList}`;
}


    return `Error: Unknown command '${cmd}'`;
  }

  // Initial message
  output.innerHTML += `<div class="output-line">System on. Awaiting commands.</div>`;

  // Unified event listener
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      const cmd = input.value.trim();
      output.innerHTML += `<div class="output-line">> ${cmd}</div>`;

      const result = handleCommand(cmd);
      result.split("\n").forEach(line => {
        output.innerHTML += `<div class="output-line">${line}</div>`;
      });

      input.value = '';
      output.scrollTop = output.scrollHeight;
    }
  });
});
