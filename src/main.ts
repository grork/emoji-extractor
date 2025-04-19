import './style.css'

function sourceTextChanged(ev: Event): void {
    const source = ev.target as HTMLTextAreaElement;
    State.ouputArea.innerText = source.value;
}

let State: {
    sourceText: HTMLTextAreaElement,
    ouputArea: HTMLDivElement
}

document.addEventListener("DOMContentLoaded", () => {
    State = {
        sourceText: document.querySelector("textarea.source-text")!,
        ouputArea: document.querySelector("div.output-text-container")!,
    }

    State.sourceText.addEventListener("input", sourceTextChanged);
});