import './style.css'

function convertToHexAsElements(original: string): HTMLElement[] {
    const view = State.textEncoder.encode(original);
    const result = Array.from(view).map((c) => {
        // Convert to Hex, and make sure it's got a leading 0 if needed
        const displayValue = c.toString(16).padStart(2, "0")
        const hexElement = document.createElement("div");

        hexElement.className = "hex-digit";
        hexElement.innerText = displayValue

        return hexElement;
    });

    return result;
}

function getExtractionDisplayer(emojis: string[], hexElements: HTMLElement[], title: string): HTMLDivElement {
    const result = document.createElement("div");
    result.className = "extraction-container";

    const titleContainer = document.createElement("div");
    titleContainer.innerText = title;
    titleContainer.className = "extractor-title";

    const emojiContainer = document.createElement("div");
    emojiContainer.className = "extracted-emoji";
    for (const emoji of emojis) {
        const singleEmoji = document.createElement("span");
        singleEmoji.innerText = emoji;
        emojiContainer.appendChild(singleEmoji);
    }

    const hexConcontainer = document.createElement("div");
    hexConcontainer.className = "hex-container";
    hexConcontainer.append(...hexElements);

    result.append(titleContainer, emojiContainer, hexConcontainer);

    return result;
}

function extractEmojiWithEmoji_Presentation(original: string): HTMLElement {
    const segmenter = new Intl.Segmenter(undefined /* runtime default locale*/, { granularity: "grapheme" });
    const extractedClusters = segmenter.segment(original);
    const emojies = <string[]>[];

    // Filter them to check if any match the complex & rich regex that helps
    // check if there are any emoji (although, the regex cannot successfully
    // extract them)
    for (const cluster of extractedClusters) {
        // Match _emojis_. But of course emojies aren't that simple. This
        // captures both new -- pretty colours! -- and old ones that actually
        // have a colour variation. We will match the variation added by modern
        // input stacks -- which is to say the mono-glyph + 'colour variation'
        // selector. (See more: https://stackoverflow.com/questions/70401560/what-is-the-difference-between-emoji-presentation-and-extended-pictographic)
        // Note, that if you don't do this, the segmenter will have given
        // you all the characters, not just emojis. Doh.
        if (/\p{Emoji_Presentation}/v.test(cluster.segment)) {
            emojies.push(cluster.segment);
        }
    }

    const result = emojies.join('');
    return getExtractionDisplayer(emojies, convertToHexAsElements(result), "{Emoji_Presentation} Regex");
}

function extractEmojiWithEmoji(original: string): HTMLElement {
    const segmenter = new Intl.Segmenter(undefined /* runtime default locale*/, { granularity: "grapheme" });
    const extractedClusters = segmenter.segment(original);
    const emojies = <string[]>[];

    // Filter them to check if any match the complex & rich regex that helps
    // check if there are any emoji (although, the regex cannot successfully
    // extract them)
    for (const cluster of extractedClusters) {
        // Match _emojis_. But of course emojies aren't that simple. This
        // captures both new -- pretty colours! -- and old ones that actually
        // have a colour variation. We will match the variation added by modern
        // input stacks -- which is to say the mono-glyph + 'colour variation'
        // selector. (See more: https://stackoverflow.com/questions/70401560/what-is-the-difference-between-emoji-presentation-and-extended-pictographic)
        // Note, that if you don't do this, the segmenter will have given
        // you all the characters, not just emojis. Doh.
        if (/\p{Emoji}/v.test(cluster.segment)) {
            emojies.push(cluster.segment);
        }
    }

    const result = emojies.join('');
    return getExtractionDisplayer(emojies, convertToHexAsElements(result), "{Emoji} Regex");
}

function extractEmojiWithEmojiRegexXs(original: string): HTMLElement {
    const segmenter = new Intl.Segmenter(undefined /* runtime default locale*/, { granularity: "grapheme" });
    const extractedClusters = segmenter.segment(original);
    const emojies = <string[]>[];

    const r = String.raw;
    const seq = r`(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation})`;
    const sTags = r`\u{E0061}-\u{E007A}`;
    const matcher = new RegExp(r`[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[${sTags}]{2}[\u{E0030}-\u{E0039}${sTags}]{1,3}\u{E007F}|${seq}(?:\u200D${seq})*`, 'gu');

    // Filter them to check if any match the complex & rich regex that helps
    // check if there are any emoji (although, the regex cannot successfully
    // extract them)
    for (const cluster of extractedClusters) {
        // Match _emojis_. But of course emojies aren't that simple. This
        // captures both new -- pretty colours! -- and old ones that actually
        // have a colour variation. We will match the variation added by modern
        // input stacks -- which is to say the mono-glyph + 'colour variation'
        // selector. (See more: https://stackoverflow.com/questions/70401560/what-is-the-difference-between-emoji-presentation-and-extended-pictographic)
        // Note, that if you don't do this, the segmenter will have given
        // you all the characters, not just emojis. Doh.
        if (matcher.test(cluster.segment)) {
            emojies.push(cluster.segment);
        }
    }

    const result = emojies.join('');
    return getExtractionDisplayer(emojies, convertToHexAsElements(result), "emoji-regex-xs");
}

function extractEmojiWithEmojiAndNumber(original: string): HTMLElement {
    const segmenter = new Intl.Segmenter(undefined /* runtime default locale*/, { granularity: "grapheme" });
    const extractedClusters = segmenter.segment(original);
    const emojies = <string[]>[];

    // Filter them to check if any match the complex & rich regex that helps
    // check if there are any emoji (although, the regex cannot successfully
    // extract them)
    for (const cluster of extractedClusters) {
        // Match _emojis_. But of course emojies aren't that simple. This
        // captures both new -- pretty colours! -- and old ones that actually
        // have a colour variation. We will match the variation added by modern
        // input stacks -- which is to say the mono-glyph + 'colour variation'
        // selector. (See more: https://stackoverflow.com/questions/70401560/what-is-the-difference-between-emoji-presentation-and-extended-pictographic)
        // Note, that if you don't do this, the segmenter will have given
        // you all the characters, not just emojis. Doh.
        if (/\p{Emoji}/v.test(cluster.segment) && !(cluster.segment >= '0' && cluster.segment <= '9')) {
            emojies.push(cluster.segment);
        }
    }

    const result = emojies.join('');
    return getExtractionDisplayer(emojies, convertToHexAsElements(result), "{Emoji} Regex + 0-9 check");
}

const converters = [
    extractEmojiWithEmoji_Presentation,
    extractEmojiWithEmoji,
    extractEmojiWithEmojiRegexXs,
    extractEmojiWithEmojiAndNumber
];

function sourceTextChanged(ev: Event): void {
    const source = ev.target as HTMLTextAreaElement;
    const sourceString = source.value;

    // Output original string as hex values
    State.sourceAsHexContainer.innerHTML = ""; // Make sure we clear out any existing content
    State.sourceAsHexContainer.append(...convertToHexAsElements(sourceString));

    State.extractedEmojiVariantsContainer.innerHTML = "";

    for (const convert of converters) {
        State.extractedEmojiVariantsContainer.appendChild(convert(sourceString));
    }
}

function selectionChanged(ev: Event): void {
    const source = ev.target as HTMLTextAreaElement;
    const sourceString = source.value;

    let selectionByteStart = 0;
    let selectionByteEnd = 0;

    // Clear any selection state that may be present
    for (const item of State.sourceAsHexContainer.querySelectorAll(".selected")) {
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
        State.sourceAsHexContainer.children[index].classList.add("selected");
    }
}

let State: {
    sourceText: HTMLTextAreaElement,
    sourceAsHexContainer: HTMLDivElement,
    extractedEmojiVariantsContainer: HTMLDivElement,
    textEncoder: TextEncoder
}

document.addEventListener("DOMContentLoaded", () => {
    State = {
        sourceText: document.querySelector("textarea.source-text")!,
        sourceAsHexContainer: document.querySelector("div.source-as-hex-container")!,
        extractedEmojiVariantsContainer: document.querySelector("div.extracted-emoji-variants-container")!,
        textEncoder: new TextEncoder()
    }

    State.sourceText.addEventListener("input", sourceTextChanged);
    State.sourceText.addEventListener("selectionchange", selectionChanged);
});