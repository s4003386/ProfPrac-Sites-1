document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById('command'); 
  const output = document.getElementById('output');

  const Commands = {
    help: "Available commands: OPEN \"I\", #1, CLOSE #1, next, back, help",
    status: "All systems nominal.",
    testprint: "This is a test print message.",
    meow: "Meow!",
      neo: `
                                   
                                
          ███      ███            
         █   ██    █   ██          
         █    ████ ██   ██          
       ██████████████████   
      ███             ███████     
      ██               ███████     
      ██ ███     ███  ██████     
      ██  ██      ██   ██████     
      ███              ██████       
        ████████████████          
`

  };

  const Texts = {
    "Text #1": [
      "Text #1 - Page 1: Welcome to Text #1. Type 'next' to continue.",
      "Text #1 - Page 2: This is known as a command line interface. You can type 'back' to return to the previous page.",
      "Text #1 - Page 3: This interface was popular in the early days of computing. It allows users to interact with the system using text commands.",
      "Text #1 - Page 4: You can open multiple texts, but you must close them before opening a new one. Data like these texts would have been stored in cartridges or tapes, then loaded into memory.",
      "Text #1 - Page 5: These cartridges would only be able to hold a limited amount of data, often just a few megabytes. A Datapoint 2200 cartridge could hold around 2.5 megabytes of data, or 2621440 characters. For reference, this line is only 260 characters long, 0.01% of 2621440.",
      "Text #1 - Page 6: The command line interface is still used today in various forms, such as terminal emulators and command prompts.",
    ],
    "Text #2": [
      "Text #2 - Page 1: Welcome to Text #2. Type 'next' to continue.",
      "Text #2 - Page 2: The design of the Datapoint 2200 was revolutionary for its time, featuring a microprocessor and a keyboard. The Datapoint 2200 could also be carried around like a portable computer, which was quite advanced for the early 1970s.",
      "Text #2 - Page 3: Computers like the Datapoint 2200 were often used in business environments, where they would handle tasks such as data entry and processing.",
      "Text #2 - Page 4: Because of its environment, the design of computers like the Datapoint 2200 was often focused on functionality and reliability, rather than aesthetics.",
      "Text #2 - Page 5: The terminal interface could only display text, and one colour. There was no need at the time for complex graphics or user interfaces, as the primary function was to input and retrieve data.",
    ],

    "Text #3": [
      "Text #3 - Page 1: Welcome to Text #3. Type 'next' to continue.",
      "Text #3 - Page 2: 'binary' was a common term in computing, referring to the base-2 numeral system. It is the foundation of all modern computing systems, where data is represented using only two symbols: 0 and 1.",
      "Text #3 - Page 3: This stemmed into punch cards, which were used to input data into early computers. Each card would represent a line of code or data, and the holes punched in the card would determine the information stored.",
      "Text #3 - Page 4: the previous iteration in computing was what led to the development of more advanced input methods, such as keyboards and mice. The Datapoint 2200 was one of the first computers to feature a keyboard, allowing users to input data directly.",
      "Text #3 - Page 5: Data input through a terminal was called analogus to a nut, where the user would interact with the shell. The shell then interacted with the kernel to get the desired results.",
      "Text #3 - Page 6: The kernel analogy is still used to this day in modern computing.",
    ],
  };

  let currentText = null;
  let currentPage = 0;

  // Confirmation system
  let awaitingCloseConfirmation = false;
  let pendingTextToOpen = null;




  
  function handleCommand(cmd) {
    cmd = cmd.trim();
    


    // Handle "yes" or "no" confirmation if awaiting close
    if (awaitingCloseConfirmation) {
      if (cmd.toLowerCase() === "yes") {
        const closed = currentText;
        currentText = pendingTextToOpen;
        currentPage = 0;
        awaitingCloseConfirmation = false;
        pendingTextToOpen = null;
        return `${closed} closed.\n${currentText} opened:\n${Texts[currentText][currentPage]}`;
      } else if (cmd.toLowerCase() === "no") {
        awaitingCloseConfirmation = false;
        pendingTextToOpen = null;
        return Texts[currentText][currentPage]; // re-show current page
      } else {
        return `Please type 'Yes' or 'No'.`;
      }
    }

    // Open Text: must match 'OPEN "I", #1' or 'OPEN "I", #2'
    const openMatch = cmd.match(/^OPEN "I", #(1|2)$/);
    if (openMatch) {
      const textNum = openMatch[1];
      const textName = `Text #${textNum}`;
      if (!Texts.hasOwnProperty(textName)) {
        return `Error: ${textName} not found.`;
      }
      if (currentText && currentText !== textName) {
        awaitingCloseConfirmation = true;
        pendingTextToOpen = textName;
        return `Close ${currentText}? Yes / No`;
      }
      currentText = textName;
      currentPage = 0;
      return Texts[textName][currentPage];
    }

    // Close Text: must match 'CLOSE #1' or 'CLOSE #2'
    const closeMatch = cmd.match(/^CLOSE #(1|2)$/);
    if (closeMatch) {
      const textNum = closeMatch[1];
      const textName = `Text #${textNum}`;
      if (currentText === textName) {
        currentText = null;
        currentPage = 0;
        return `${textName} closed.`;
      } else if (!currentText) {
        return `Error: No text is currently open.`;
      } else {
        return `Error: ${textName} is not open.`;
      }
    }

    // Next page
    if (cmd === "next") {
      if (!currentText) return "Error: No text is currently open.";
      if (currentPage + 1 >= Texts[currentText].length) return "End of text reached.";
      currentPage++;
      return Texts[currentText][currentPage];
    }

    // Back page
    if (cmd === "back") {
      if (!currentText) return "Error: No text is currently open.";
      if (currentPage === 0) return "You're already at the beginning.";
      currentPage--;
      return Texts[currentText][currentPage];
    }

    // Simple predefined commands
    if (Commands.hasOwnProperty(cmd)) {
      return Commands[cmd];
    }

    // List texts / Text manager
    if (cmd === "list texts" || cmd === "ls") {
      const textList = Object.entries(Texts)
        .map(([name, pages]) => `- ${name} (${pages.length} page${pages.length > 1 ? 's' : ''})`)
        .join("\n");
      return `Available texts:\n${textList}`;
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

// check if ascii or not
    if (/[\s]{2,}/.test(result) || result.split('\n').length > 4) {
      output.innerHTML += `<pre class="output-line">${result}</pre>`;
    } else {
      result.split("\n").forEach(line => {
        output.innerHTML += `<div class="output-line">${line}</div>`;
      });
    }

      input.value = '';
      output.scrollTop = output.scrollHeight;
    }
  });
});