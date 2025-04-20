import './style.css'

function sourceTextChanged(ev: Event): void {
    const source = ev.target as HTMLTextAreaElement;
    const sourceString = source.value;
    const view = State.textEncoder.encode(sourceString);

    const output = Array.from(view).map((c) => {
        // Convert to Hex, and make sure it's got a leading 0 if needed
        const displayValue = c.toString(16).padStart(2, "0")
        const hexElement = document.createElement("div");

        hexElement.className = "hex-digit";
        hexElement.innerText = displayValue

        return hexElement;
    });

    State.ouputArea.innerHTML = ""; // Make sure we clear out any existing content
    State.ouputArea.append(...output);
}

function selectionChanged(ev: Event): void {
    const source = ev.target as HTMLTextAreaElement;
    const sourceString = source.value;

    let selectionByteStart = 0;
    let selectionByteEnd = 0;

    // Clear any selection state that may be present
    for (const item of State.ouputArea.querySelectorAll(".selected")) {
        item.classList.remove("selected");
    }

    // Check if there is any sort of selection & cal
    if (source.selectionEnd > 0) {
        const startSlice = sourceString.slice(0, source.selectionStart);
        const endSlice = sourceString.slice(source.selectionStart, source.selectionEnd);
        selectionByteStart = State.textEncoder.encode(startSlice).length;
        selectionByteEnd = State.textEncoder.encode(endSlice).length + selectionByteStart;
    }

    // No selection? No work.
    if (selectionByteEnd <= 0) {
        return;
    }

    // Add selection class
    for (let index = selectionByteStart; index < selectionByteEnd; index += 1) {
        State.ouputArea.children[index].classList.add("selected");
    }
}

let State: {
    sourceText: HTMLTextAreaElement,
    ouputArea: HTMLDivElement,
    textEncoder: TextEncoder
}

document.addEventListener("DOMContentLoaded", () => {
    State = {
        sourceText: document.querySelector("textarea.source-text")!,
        ouputArea: document.querySelector("div.output-text-container")!,
        textEncoder: new TextEncoder()
    }

    State.sourceText.addEventListener("input", sourceTextChanged);
    State.sourceText.addEventListener("selectionchange", selectionChanged);
});