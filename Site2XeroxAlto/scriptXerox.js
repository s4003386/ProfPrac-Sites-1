//KEEP THIS 1ST OK>>???
document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("command");
  const output = document.getElementById("output");
  const container = document.getElementById("MainSpace");
  const box = document.getElementById("AltoWelcomeBox");
  const desktop = document.getElementById('MainSpace');

  const windowMenu = document.getElementById("WindowContextMenu");
  const fileMenu = document.getElementById("FileContextMenu");
  const moveOption = document.getElementById("MoveOption");
  const closeOption = document.getElementById("CloseOption");

  console.log("Girl help me");

  const TrashData = {
  "Trashed Folder 1": [
    { name: "Trashed File 1", type: "text", content: "This is a trashed text file. Notice how the icon for the trash can is an actual trash can? Thats the desktop metaphor at work :3" }
  ]
  };

  const gridSize = 64;

//the stuff at the top
  const topBar = document.getElementById('TopBar');
  const commandInput = document.getElementById('CommandInput');

    function getGridPosition(x, y) {
    // Calculate grid boundaries for icons
    const minY = topBar.offsetHeight;
    const maxY = desktop.offsetHeight - commandInput.offsetHeight - gridSize;
    const minX = 0;
    const maxX = desktop.offsetWidth - gridSize;
    // Snap to grid and clamp
    let gx = Math.max(minX, Math.min(Math.round(x / gridSize) * gridSize, maxX));
    let gy = Math.max(minY, Math.min(Math.round(y / gridSize) * gridSize, maxY));
    return { x: gx, y: gy };
  }

  // for making the icon draggable
  const trashIcon = document.getElementById('TrashIcon');
  //makeIconDraggable(trashIcon);

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

  //file template
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
    //AAAAAAAAA
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
            <div class="FileItem" data-file="Text 1">Text 1.txt</div>
            <div class="FileItem" data-file="Text 2">Text 2.txt</div>
            <div class="FileItem" data-file="Text 3">Text 3.txt</div>
          `;
        } else if (folder === "folder2") {
          col2.innerHTML = `
            <div class="FileItem" data-file="Neo.img">Neo.img</div>
            <div class="FileItem" data-file="Text 4">Interface examples.txt</div>
            <div class="FileItem" data-file="Xerox.img">Xerox.img</div>
            <div class="FileItem" data-file="Mac.img">Macintosh system 1.img</div>
            <div class="FileItem" data-file="Windows.img">Windows 3.0.img</div>
          `;
        }

        //files + image thingies
        col2.querySelectorAll(".FileItem").forEach(fileItem => {
          fileItem.addEventListener("dblclick", () => {
            const name = fileItem.dataset.file;
            if (name === "Neo.img") {
              spawnImageViewer("Neo.img", "Images/NeoTestImage2.png");
            } else if (name === "Text 1") {
              spawnTextViewer("Text 1", "The Xerox Alto was one of the first computers to have a graphical user interface (GUI) and a mouse. It was developed at Xerox PARC in the 1970s and was a precursor to modern personal computers. The Alto featured a black and white bitmap display, which looked similar to what you are looking at now. The alto and subsequent computers made during the decade were responsible for the development of the desktop metaphor.  and was the beggining of the desktop metaphor we use today. ");
            } else if (name === "Text 2") {
              spawnTextViewer("Text 2", "The reason why displays looked the way they do during this decade was both because of the limitations of the technology and the main audience of computers during the time. Computers like early macintosh's and Windows would mostly be used by engineers, military personel, and researchers. The desktop metaphor was also born out of attempting to get this audience on board more easily with its resembelence to an actual desktop. An abstract computer file was equivalent to an actual file on a desk, and so on. ");
            } else if (name === "Text 3") {
              spawnTextViewer("Text 3", "Fun fact: You can actually edit the text in this viewer! Just double-click on the text to edit it. The Alto's text editor was one of the first to support WYSIWYG (What You See Is What You Get) editing, allowing users to see how their text would look when printed or displayed. Functions like copy, paste and undo were always available from the start.");
            } else if (name === "Text 4") {
              spawnTextViewer("Interface examples.txt", "Within this folder, you can see images of different early desktop metaphor interfaces. It's not a super comprehensive list but it shows the use of elements like icons, windows, pages and so on. ");
            } else if (name === "Xerox.img") {
              spawnImageViewer("Xerox.img", "Images/IE-Alto-3.jpg");
            } else if (name === "Mac.img") {
              spawnImageViewer("Macintosh system 1.img", "Images/Apple_Macintosh_Desktop.png");
            } else if (name === "Windows.img") {
              spawnImageViewer("Windows.img", "Images/Windows_3.0_workspace.png");
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

  //viewer for text. awawaaa
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
  //to paragraph or to allow edit. truly a connundrum

//function textViewerTemplate(headerText, bodyText) {
//   const viewer = document.createElement("div");
//   viewer.classList.add("TextViewer");
//   viewer.style.position = "absolute";
//   viewer.style.top = "86px";
//   viewer.style.left = "100px";
//   viewer.style.width = "300px";
//   viewer.style.height = "200px";
//   viewer.style.background = "#f1f1f1";
//   viewer.style.border = "3px solid #000";
//   viewer.style.boxSizing = "border-box";
//   viewer.innerHTML = `
//     <div class="TextViewerHeader" style="background:#000;color:#fff;padding:4px;cursor:move;">${headerText}</div>
//     <div class="TextViewerBody" style="padding:10px;overflow:auto;height:150px;width:95%;font-family:'Courier New',monospace;font-size:12px;box-sizing:border-box;">
//       ${bodyText}
//     </div>
//   `;
//   return viewer;
// }

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

  if (trashIcon && container) {
    const gridSize = 64;
    const desktopWidth = container.offsetWidth;
    const desktopHeight = container.offsetHeight;

    // Calculate the max grid-aligned position
    const maxX = Math.floor((desktopWidth - gridSize) / gridSize) * gridSize;
    const maxY = Math.floor((desktopHeight - gridSize) / gridSize) * gridSize;

    trashIcon.style.left = maxX + "px";
    trashIcon.style.top = maxY + "px";
    //makeIconDraggable(trashIcon);
  }

  function makeIconDraggable(icon) {
  let offsetX, offsetY, dragging = false;

  icon.onmousedown = function(e) {
    dragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    document.onmousemove = function(ev) {
      if (!dragging) return;
      let relX = ev.clientX - desktop.getBoundingClientRect().left - offsetX;
      let relY = ev.clientY - desktop.getBoundingClientRect().top - offsetY;
      // Snap to grid
      const pos = getGridPosition(relX, relY);
      icon.style.left = pos.x + "px";
      icon.style.top = pos.y + "px";
    };
    document.onmouseup = function() {
      dragging = false;
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
  }

  if (trashIcon) {
    trashIcon.ondblclick = function () {
      spawnTrashExplorer();
    };
  }
    
  function trashExplorerTemplate() {
  const explorer = document.createElement("div");
  explorer.classList.add("FileExplorer");
  explorer.style.position = "absolute";
  explorer.style.display = "block";
  explorer.innerHTML = `
    <div class="FileExplorerHeader">Trash</div>
    <div class="FileExplorerBody">
      <div class="FileColumn" id="TrashFileColumn1">
        <div class="FileItem" data-folder="trashedFolder1">Trashed Folder 1</div>
      </div>
      <div class="FileColumn" id="TrashFileColumn2"></div>
      <div class="FileColumn" id="TrashFileColumn3"></div>
    </div>
  `;
  return explorer;
}

function spawnTrashExplorer() {
  const explorer = trashExplorerTemplate();

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

  // Folder selection logic for Trash
  explorer.querySelectorAll("[data-folder]").forEach(item => {
    item.addEventListener("click", () => {
      explorer.querySelectorAll("[data-folder]").forEach(i => i.classList.remove("selected"));
      item.classList.add("selected");

      const folder = item.dataset.folder;
      const col2 = explorer.querySelector("#TrashFileColumn2");
      const col3 = explorer.querySelector("#TrashFileColumn3");
      col2.innerHTML = "";
      col3.innerHTML = "";

      if (folder === "trashedFolder1") {
        col2.innerHTML = `
          <div class="FileItem" data-file="Trashed File 1">Trashed File 1</div>
          <div class="FileItem" data-file="suspicious image">Sus.img</div>
        `;
      }

      col2.querySelectorAll(".FileItem").forEach(fileItem => {
        fileItem.addEventListener("dblclick", () => {
          const name = fileItem.dataset.file;
          if (name === "Trashed File 1") {
            spawnTextViewer("Trashed File 1", TrashData["Trashed Folder 1"][0].content);
          } else if (name === "suspicious image") {
            alert(`You double-clicked: ${name}`);
            spawnImageViewer("Suspicious Image", "Images/Sus.png");
          }
          else 
          {
            alert(`You double-clicked: ${name}`);
          } //lol
        });
      });
    });
  });

  container.appendChild(explorer);
  bringToFront(explorer);
  dragElement(explorer, explorer.querySelector(".FileExplorerHeader"));
}






});




//im never touching this again