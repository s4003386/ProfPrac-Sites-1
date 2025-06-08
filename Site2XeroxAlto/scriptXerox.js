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

  const Commands = {
    help: "Available commands: FileExplorer, help",
    FileExplorer: "FileExplorer Spawned.",
  };

  output.innerHTML += `<div class="output-line">System on. Awaiting commands.</div>`;

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

  function showMenuAt(event, menuElement) {
    const containerRect = container.getBoundingClientRect();
    let left = event.clientX - containerRect.left;
    let top = event.clientY - containerRect.top;

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

  const explorerTemplate = () => {
    const explorer = document.createElement("div");
    explorer.classList.add("FileExplorer");
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
  };

  function spawnFileExplorer() {
    const explorer = explorerTemplate();

    explorer.oncontextmenu = function (e) {
      e.preventDefault();
      selectedWindow = explorer;
      showMenuAt(e, windowMenu);
      return false;
    };

    explorer.querySelectorAll("[data-folder]").forEach(item => {
      item.addEventListener("click", () => {
        const folder = item.dataset.folder;
        const col2 = explorer.querySelector("#FileColumn2");
        const col3 = explorer.querySelector("#FileColumn3");
        col2.innerHTML = "";
        col3.innerHTML = "";

        if (folder === "folder1") {
          col2.innerHTML = `
            <div class="FileItem" data-file="Text 1">Text 1</div>
            <div class="FileItem" data-file="Text 2">Text 2</div>
          `;
        } else if (folder === "folder2") {
          col2.innerHTML = `
            <div class="FileItem" data-file="Neo.img">Neo.img</div>
          `;
        }

        col2.querySelectorAll(".FileItem").forEach(fileItem => {
          fileItem.addEventListener("dblclick", () => {
            const name = fileItem.dataset.file;
            alert(`You double-clicked: ${name}`);
          });

          fileItem.addEventListener("click", (e) => {
            e.preventDefault();
            showFileContextMenu(e, fileItem.dataset.file);
          });
        });
      });
    });

    container.appendChild(explorer);
    dragElement(explorer, explorer.querySelector(".FileExplorerHeader"));
  }
});
