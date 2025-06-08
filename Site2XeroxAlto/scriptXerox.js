document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("command");
  const output = document.getElementById("output");
  const container = document.getElementById("MainSpace");
  const box = document.getElementById("AltoWelcomeBox");

  const windowMenu = document.getElementById("WindowContextMenu");
  const fileMenu = document.getElementById("FileContextMenu");
  const moveOption = document.getElementById("MoveOption");
  const closeOption = document.getElementById("CloseOption");

  let isMovable = false;
  let selectedWindow = null;
  let topZ = 100;

  const Commands = {
    help: "Available commands: FileExplorer, help",
    FileExplorer: "FileExplorer Spawned.",
    meow: "Meow! ",
  };

  output.innerHTML += `<div class="output-line">System on. Awaiting commands.</div>`;


  //bring to front function
  function bringToFront(el) {
    topZ += 2;
    el.style.zIndex = topZ;
  }

  //welcome box bring to front
  box.onmousedown = function () {
  bringToFront(box);
};

  function explorerTemplate() {
    const explorer = document.createElement("div");
    explorer.classList.add("FileExplorer");
    explorer.style.position = "absolute";
    explorer.style.display = "block";
    explorer.innerHTML = `
      <div class="FileExplorerHeader">File Explorer</div>
      <div class="FileExplorerBody">
        <div class="FileColumn" id="FileColumn1">
          <div class="FileItem" data-folder="folder1">Folder 1</div>
          <div class="FileItem" data-folder="folder2">Folder 2</div>
        </div>
        <div class="FileColumn" id="FileColumn2"></div>
        <div class="FileColumn" id="FileColumn3"></div>
      </div>
    `;
    return explorer;
  }


  //spawns file explorer
  function spawnFileExplorer() {
    const explorer = explorerTemplate();
    //on mouse down, bring to front
    explorer.onmousedown = function () {
      bringToFront(explorer);
    };

    explorer.oncontextmenu = function (e) {
      e.preventDefault();
      selectedWindow = explorer;
      bringToFront(explorer);
      showMenuAt(e, windowMenu);
      return false;
    };

    // Folder selection logic
    explorer.querySelectorAll("[data-folder]").forEach(item => {
      item.addEventListener("click", () => {
        explorer.querySelectorAll("[data-folder]").forEach(i => i.classList.remove("selected"));
        item.classList.add("selected");

        const folder = item.dataset.folder;
        const col2 = explorer.querySelector("#FileColumn2");
        const col3 = explorer.querySelector("#FileColumn3");
        col2.innerHTML = "";
        col3.innerHTML = "";

        if (folder === "folder1") {
          col2.innerHTML = `
            <div class="FileItem" data-file="Text 1">Text 1</div>
            <div class="FileItem" data-file="Text 2">Text 2</div>
            <div class="FileItem" data-file="Text 3">Text 3</div>
          `;
        } else if (folder === "folder2") {
          col2.innerHTML = `
            <div class="FileItem" data-file="Neo.img">Neo.img</div>
          `;
        }

        //Contains the information for the text files//
        col2.querySelectorAll(".FileItem").forEach(fileItem => {
          fileItem.addEventListener("dblclick", () => {
            const name = fileItem.dataset.file;
            if (name === "Neo.img") {
              spawnImageViewer("Neo.img", "Images/NeoTestImage2.png");
            } else if (name === "Text 1") {
              spawnTextViewer("Text 1", "The Xerox Alto was one of the first computers to have a graphical user interface (GUI) and a mouse. It was developed at Xerox PARC in the 1970s and was a precursor to modern personal computers. The Alto featured a black and white bitmap display, which looked similar to what you are looking at now. It was able to display text and simple graphics, and was the beggining of the desktop metaphor we use today. The Alto was never sold commercially, but it influenced many later systems, including the Apple Macintosh and Microsoft Windows.");
            } else if (name === "Text 2") {
              spawnTextViewer("Text 2", "It was actually possible to customise the Alto's interface with different fonts and sizes, but it was not as flexible as modern systems. The Alto used a bitmap display, which allowed for more complex graphics than earlier systems that used character-based displays. However, the Alto's display was still limited to black and white, and did not support color until later models were developed.");
            } else if (name === "Text 3") {
              spawnTextViewer("Text 3", "Fun fact: You can actually edit the text in this viewer! Just double-click on the text to edit it. The Alto's text editor was one of the first to support WYSIWYG (What You See Is What You Get) editing, allowing users to see how their text would look when printed or displayed. Functions like copy, paste and undo were always available from the start.");
            } else {
              alert(`You double-clicked: ${name}`);
            }
          });
        });
      });
    });

    container.appendChild(explorer);
    bringToFront(explorer);
    dragElement(explorer, explorer.querySelector(".FileExplorerHeader"));
  }

  //viewer for text
  //Text viewer template
function textViewerTemplate(headerText, bodyText) {
  const viewer = document.createElement("div");
  viewer.classList.add("TextViewer");
  viewer.style.position = "absolute";
  viewer.style.top = "86px";
  viewer.style.left = "100px";
  viewer.style.width = "300px";
  viewer.style.height = "200px";
  viewer.style.background = "#f1f1f1";
  viewer.style.border = "3px solid #000";
  viewer.style.boxSizing = "border-box";
  viewer.innerHTML = `
    <div class="TextViewerHeader" style="background:#000;color:#fff;padding:4px;cursor:move;">${headerText}</div>
    <textarea style="padding:10px;overflow:auto;height:150px;width:95%;resize:none;font-family:'Courier New',monospace;font-size:12px;box-sizing:border-box;">${bodyText}</textarea>
  `;
  return viewer;
}

function spawnTextViewer(headerText, bodyText) {
  const viewer = textViewerTemplate(headerText, bodyText);

  viewer.onmousedown = function () {
    bringToFront(viewer);
  };

  dragElement(viewer, viewer.querySelector(".TextViewerHeader"));

  viewer.oncontextmenu = function (e) {
    e.preventDefault();
    selectedWindow = viewer;
    bringToFront(viewer);
    showMenuAt(e, windowMenu);
    return false;
  };

  container.appendChild(viewer);
  bringToFront(viewer);
}
  
//viewer for image
function imageViewerTemplate(headerText, imageUrl) {
  const viewer = document.createElement("div");
  viewer.classList.add("ImageViewer");
  viewer.style.position = "absolute";
  viewer.style.top = "150px";
  viewer.style.left = "150px";
  viewer.style.width = "320px";
  viewer.style.height = "260px";
  viewer.style.background = "#fff";
  viewer.style.border = "3px solid #000";
  viewer.style.boxSizing = "border-box";
  viewer.innerHTML = `
    <div id="ImageViewerHeader" style="background:#000;color:#fff;padding:4px;cursor:move;">${headerText}</div>
    <div style="padding:10px;">
      <img src="${imageUrl}" alt="${headerText}" style="max-width:100%;max-height:180px;display:block;margin:auto;">
    </div>
  `;
  return viewer;
}

  function spawnImageViewer(headerText, imageUrl) {
    const viewer = imageViewerTemplate(headerText, imageUrl);

    viewer.onmousedown = function () {
      bringToFront(viewer);
    };

    dragElement(viewer, viewer.querySelector("#ImageViewerHeader"));

    viewer.oncontextmenu = function (e) {
      e.preventDefault();
      selectedWindow = viewer;
      bringToFront(viewer);
      showMenuAt(e, windowMenu);
      return false;
    };

    container.appendChild(viewer);
    bringToFront(viewer);
  }

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const cmd = input.value.trim();
      output.innerHTML += `<div class="output-line">> ${cmd}</div>`;
      const result = handleCommand(cmd);
      result.split("\n").forEach(line => {
        output.innerHTML += `<div class="output-line">${line}</div>`;
      });
      input.value = "";
      output.scrollTop = output.scrollHeight;
    }
  });

  function handleCommand(cmd) {
    if (cmd === "FileExplorer") {
      spawnFileExplorer();
      return Commands[cmd];
    }
    if (Commands[cmd]) return Commands[cmd];
    return `Unknown command: ${cmd}`;
  }


  //context menu logic
function showMenuAt(event, menuElement) {
  const containerRect = container.getBoundingClientRect();
  const menuWidth = menuElement.offsetWidth || 120;
  const menuHeight = menuElement.offsetHeight || 60;

  let left = event.clientX - containerRect.left;
  let top = event.clientY - containerRect.top;

  if (left + menuWidth > container.clientWidth) {
    left = container.clientWidth - menuWidth;
  }
  if (top + menuHeight > container.clientHeight) {
    top = container.clientHeight - menuHeight;
  }
  left = Math.max(0, left);
  top = Math.max(0, top);

  // Always on top
  menuElement.style.zIndex = 9999;
  menuElement.style.left = `${left}px`;
  menuElement.style.top = `${top}px`;
  menuElement.style.display = "block";
}

  function showFileContextMenu(event, filename) {
    fileMenu.innerHTML = `
      <div class="context-option">Open ${filename}</div>
      <div class="context-option">Delete ${filename}</div>
    `;
    fileMenu.querySelectorAll(".context-option").forEach(option => {
      option.onclick = () => {
        alert(`${option.textContent} clicked!`);
        fileMenu.style.display = "none";
      };
    });
    showMenuAt(event, fileMenu);
  }

  document.addEventListener("click", (e) => {
    windowMenu.style.display = "none";
    fileMenu.style.display = "none";
    if (!windowMenu.contains(e.target)) {
      isMovable = false;
    }
  });

  moveOption.onclick = function (e) {
    e.stopPropagation();
    isMovable = true;
    if (selectedWindow) {
      dragElement(selectedWindow, selectedWindow.querySelector(".FileExplorerHeader") || selectedWindow.querySelector("#AltoWelcomeBoxHeader"));
    }
    windowMenu.style.display = "none";
  };

  closeOption.onclick = function (e) {
    e.stopPropagation();
    if (selectedWindow) {
      selectedWindow.style.display = "none";
    }
    windowMenu.style.display = "none";
  };

  function dragElement(elmnt, headerElement) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = headerElement || elmnt;
    header.onmousedown = function (e) {
      if (!isMovable) return;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    };

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      let newTop = elmnt.offsetTop - pos2;
      let newLeft = elmnt.offsetLeft - pos1;
      newTop = Math.max(0, Math.min(newTop, container.clientHeight - elmnt.offsetHeight));
      newLeft = Math.max(0, Math.min(newLeft, container.clientWidth - elmnt.offsetWidth));
      elmnt.style.top = newTop + "px";
      elmnt.style.left = newLeft + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  box.oncontextmenu = function (e) {
    e.preventDefault();
    selectedWindow = box;
    showMenuAt(e, windowMenu);
    return false;
  };
});



